const { existsSync, mkdirSync, writeFileSync } = require('fs')
const { join } = require('path');
const yesno = require('yesno')
const readlineSync = require('readline-sync')
const lineReplace = require('line-replace')
const _ = require('lodash')

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

    const continueRestore = await yesno({
        question: `\nDo you want to add a field to the model ${schemaName}? (y/n)`,
    });

    let writeCode = [];
    const fieldLists = [];

    if (continueRestore) {
        let totalField = readlineSync.question("\nHow many field do you want? (ex: 1) ");
        const numberValidator = /^\d+$/.test(totalField)

        if (!numberValidator) {
            console.log("Wrong input format!!");
            process.exit();
        }

        for (let i = 1; i <= totalField; i++) {
            let fieldName = readlineSync.question(`${i}). Enter field name! (ex: foo) `);
            fieldLists.push(fieldName)
        }
        
        for (const field of fieldLists) {
            const makeField = `    ${field}: {type: String, default: ''},\n`;
            writeCode.push(makeField)
        }
    }
    
    mkdirSync(schemaPath, {
        recursive:true
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
        text: `const Builder = require('../../middleware/schema')`
            + `\n\n`
            + `const ${_.camelCase(schemaName)}Schema = Builder.schema({\n\n`
            + `/**\n`
            + `* Put the ${schemaName} model field what do you need here!\n`
            + `* Ex: email: {types: String, default: '', required: false}\n`
            + `*/` 
            + `\n\n`
            + writeCode.join('')
            + `    _createdAt: {types: String, default: ''},\n`
            + `    _updateAt: {types: String, default: ''},\n`
            + `    _deletedAt: {types: String, default: ''},\n`
            + `\n}, {\n`
            + `    toObject: {virtuals: true},\n`
            + `    toJSON: {virtuals: true},\n`
            + `    usePushEach: true,\n`
            + `    collection: '${schemaName}'\n`
            + `})\n\n`
            + `Builder.paginate(${_.camelCase(schemaName)}Schema);\n\n`
            + `const ${schemaName} = Builder.model('${schemaName}', ${_.camelCase(schemaName)}Schema);\n\n`
            + `module.exports = ${schemaName};`,
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
        text: `const ${schemaName}Models = require('../../schema/${schemaName}/models');`
            + `\n\n`
            + `class ${schemaName}Resolver {\n\n`
            + `/**\n`
            + `* Put your actions here to execute ${schemaName}Model\n`
            + `* Ex: async register () {} \n`
            + `*/\n\n` 
            + `    constructor(model) {\n`
            + `        this.model = ${schemaName}Models;\n`
            + `    }\n\n`
            + `};\n\n`
            + `module.exports = new ${schemaName}Resolver();`,
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

start()