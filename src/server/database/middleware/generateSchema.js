const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { join } = require('path');
const yesno = require('yesno')
const readlineSync = require('readline-sync')
const lineReplace = require('line-replace')
const _ = require('lodash')
const columns = require('cli-columns');
const mongoose = require('mongoose');

const schemaFile = [
    'models.js',
    'resolvers.js'
]

const start = async () => {
    if (!process.argv[2]) {
        console.log(`Please specify name to make schema. Example: yarn make:schema User`);
        process.exit(1);
    }

    const schemaName = process.argv[2];
    const schemaPath = join(__dirname, '../schema', schemaName);

    if (existsSync(schemaPath)) {
        console.log(`Schema ${schemaName} already exists!`);
        process.exit(1);
    }

    let collectionName = readlineSync.question(`Please enter collection name in ${schemaName}Model (ex: Users) `);

    if (!collectionName) {
        console.log(`Wrong input format please enter again`);
        process.exit(1);
    }

    const continueGenerate = await yesno({
        question: `Do you want to add some field to the model ${schemaName}? (y/n)`,
    });

    let writeCode = [];
    const fieldLists = [];
    const typeLists = [];

    if (continueGenerate) {
        let totalField = readlineSync.question("\nHow many field do you want? (ex: 1) ");
        const parentheses = /\(([^)]+)\)/;
        const listTypes = Object.keys(mongoose.Schema.Types);

        console.log('Select schema type lists: ex: foo(String) or foo for default type string\n')
        console.log(columns(listTypes) + '\n')

        const numberValidator = /^\d+$/.test(totalField)

        if (!numberValidator) {
            console.log("Wrong input format!!");
            process.exit();
        }

        for (let i = 1; i <= totalField; i++) {
            let fieldName = readlineSync.question(`${i}). Enter field name! (ex: foo(String) ) `);
            let parenthesesVal = parentheses.exec(fieldName)
            const type = parenthesesVal !== null ? parenthesesVal[1] : 'String';
            if (!listTypes.includes(type)) {
                console.log("Wrong input format!!");
                process.exit();
            }
            typeLists.push(type)
            fieldLists.push(fieldName.replace(`(${type})`, ''))
        }

        for (const key in fieldLists) {
            const makeField = `    ${fieldLists[key]}: {type: ${typeLists[key]}, default: ''},\n`;
            writeCode.push(makeField)
        }
    }

    mkdirSync(schemaPath, {
        recursive: true
    })

    for (const file of schemaFile) {
        writeFileSync(
            join(schemaPath, file),
            `const ${schemaName};`,
        )
    }

    lineReplace({
        file: join(schemaPath, schemaFile[0]),
        line: 1,
        text: modelTemplate(schemaName, writeCode, collectionName),
        addNewLine: true,
        callback: ({ file, line, text, replacedText, error }) => {
            if (error) {
                process.exit(1)
            } else {
                console.log(`Successfully make ${schemaName} models${fieldLists[0] !== undefined ? ` with field ${fieldLists.join(', ')}` : ''}!`)
            }
        }
    })

    lineReplace({
        file: join(schemaPath, schemaFile[1]),
        line: 1,
        text: resolverTemplate(schemaName),
        addNewLine: true,
        callback: ({ file, line, text, replacedText, error }) => {
            if (error) {
                process.exit(1)
            } else {
                console.log(`Successfully make ${schemaName} resolvers!`)
            }
        }
    })
}
const modelTemplate = (schemaName, options, collectionName) => {
    const template = `
const Builder = require('../../middleware/schema')

const ${_.camelCase(schemaName)}Schema = Builder.schema({

/**
* Put the Foo model field what do you need here!
* Ex: email: {types: String, default: '', required: false}
*/
${options.join('')}
    _createdAt: {type: String, default: ''},
    _updatedAt: {type: String, default: ''},
    _deletedAt: {type: String, default: ''},

}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    usePushEach: true, 
    collection: '${collectionName}'
});

Builder.paginate(${_.camelCase(schemaName)}Schema);

const ${schemaName} = Builder.model('${schemaName}', ${_.camelCase(schemaName)}Schema);

module.exports = ${schemaName};
`;
    return template;
}

const resolverTemplate = (schemaName) => {
    const template = `
const ${schemaName}Models = require('../../schema/${schemaName}/models');

class ${schemaName}Resolver {

/**
* Put your actions here to execute ${schemaName}Model
* Ex: async register () {} 
*/

    constructor(model) {
        this.model = ${schemaName}Models;
    }

    async create (data) {
        try {   
            const record = new this.model(data);
            const newData = await record.save()

            newData._createdAt = new Date().toISOString();
            newData._updatedAt = new Date().toISOString();

            const addNew = await newData.save();
            
            return await addNew;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

};

module.exports = new ${schemaName}Resolver();    
`;
    return template;
}

start()