require('dotenv').config();
const { readdirSync, readFileSync } = require('fs');
const shell = require('shelljs')
const { join, resolve, parse } = require('path');
const dayjs = require('dayjs');
const yesno = require('yesno');
const readlineSync = require('readline-sync')
const mongoose = require('mongoose');
require('../connection').connect();

const start = async () => {
    try {
        const getBackupFile = readdirSync(join(__dirname, '../backup/'))
            .filter((name) => name.endsWith(".tar.zst"))

        const backupLists = [];
        for (let i = 0; i < getBackupFile.length; i++) {
            console.log(`${i + 1}). ${getBackupFile[i]}`)
            backupLists.push({
                name: `${i + 1}). ${getBackupFile[i]}`
            })
        }

        if (backupLists[0] === undefined) {
            console.log("Database backup not available!")
            process.exit();
        }

        let selectBackup = readlineSync.question("\nSelect the backup number do you want to restore: ");
        const numberValidator = /^\d+$/.test(selectBackup)

        if (!numberValidator) {
            console.log("Wrong input format!!");
            process.exit();
        }
        
        const val = backupLists.filter((data) => {
            return data.name.includes(`${selectBackup}).`)
        })

        if (val[0] === undefined) {
            console.log(`\nThe backup number that you selected is not available`)
            process.exit();
        }

        const getSelectedValue = val[0].name.substring(val[0].name.indexOf('DB'), val[0].name.length);
        
        const fullpath = resolve(join(__dirname, '../backup', getSelectedValue));
        const parsePathResult = parse(fullpath);
        const dirname = parsePathResult.name.split(".")[0];
        const filename = parsePathResult.base;

        const continueRestore = await yesno({
            question: `\nAre you sure you want to continue restoring ${filename}? (y/n)`,
        });

        if (!continueRestore) {
            process.exit()
        }

        const targetFilename = join(__dirname, '../backup', filename)
        const targetDirname = join(__dirname, '../backup', dirname)

        shell.exec(`tar --use-compress-program=unzstd -xvf ${targetFilename} -C ${join(__dirname, '../backup')}`);
        const fileNames = readdirSync(targetDirname)
            .filter((name) => name.endsWith(".json"));

        const getSchema = readdirSync(join(__dirname, '../schema'))
            .filter((name) => {
                for (const key of fileNames) {
                    return key.includes(name)
                }
            })
            
        const Schema = [];
        const restoreData = [];

        for (const key in fileNames) {
            const jsonData = readFileSync(resolve(targetDirname, fileNames[key]));
            const data = JSON.parse(jsonData);
            const collectionName = fileNames[key].replace(".json", "");

            const model = getSchema[key]
            const code = `
                (() => {
                    const ${model} = require('../schema/${model}/resolvers');
                    Schema.push(${model})
                })()
            `;

            eval(code)
            
            for (const document of data) {
                let { _id, ...body } = document;

                const schema = Schema[key]

                
            
                let query = {_id};
                let update = { 
                    $setOnInsert: {
                        ...body
                    }
                };
                
                let options = { new: true, upsert: true, rawData: true };

                const restore = await mongoose.model(model).findOneAndUpdate(query, update, options)
                            .catch(error => console.error(error));
                            
                restoreData.push(restore);
            }
            console.log(`Successfully restoring: ${restoreData.length} items on collection ${collectionName}`)
        }
        console.log(`\nThe database is up to date`);
        shell.exec(`rm -rf ${targetDirname}`);
        process.exit();
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

start()