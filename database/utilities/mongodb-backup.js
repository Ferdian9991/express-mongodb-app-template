require('dotenv').config();
const { existsSync, mkdirSync, writeFileSync } = require('fs');
const shell = require('shelljs')
const { join } = require('path');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const getCollection = require('../connection').collectionLists;
require('../connection').connect();
require('../schema/init').init();

const sortArray = (value) => {
    const sort = value.sort(function(a, b){
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0;
    })
    return sort
}

const start = async () => {

    const dirname = `DB-${ dayjs().format("YYYY-MM-DD") }`
    const filename = `DB-${ dayjs().format("YYYY-MM-DD") }.tar.zst`

    try {
        const collectionLists = await getCollection(mongoose);
        const collections = sortArray(collectionLists)
        const connection = mongoose.connection

        const backupPath = join(__dirname, '../../database', 'backup')
        if (!existsSync(backupPath)) {
            mkdirSync(backupPath, {
                recursive: true
            })
        }

        const dbPath = `${process.cwd()}/${dirname}`
        
        if (existsSync(dbPath)) {
            shell.exec(`rm -rf ${dbPath}`)
        }

        mkdirSync(dbPath, {
            recursive: true
        })

        const model = sortArray(mongoose.modelNames());
        
        for (let i = 0; i < collections.length; i++) {
            const data = await connection
                .collection(collections[i].name)
                .find({})
                .toArray();
            if (data.length > 0) {
                writeFileSync(
                    `${dbPath}/${model[i]}.json`,
                    JSON.stringify(data)
                )
            }
        }
        shell.exec(`tar --use-compress-program zstd -cf ${join(__dirname, '../../database/backup', filename)} ${dirname}`)
        shell.exec(`rm -rf ${dbPath}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
    console.log(`Successfully created backup database: ${filename}`)
    process.exit()
}
start()
