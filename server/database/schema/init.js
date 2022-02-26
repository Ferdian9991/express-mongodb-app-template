const _eval = require('eval');
const fsScandir = require('@nodelib/fs.scandir');

/**
* Make ignoring config that you have code file outside the your schema folder (ex: User).
*/

const ignores = [
    'init.js',
];

/**
* This is code to render all schema folders!.
*/

const init = () => {
    let models = [];
    const schemas = fsScandir.scandirSync(__dirname, new fsScandir.Settings())
        .filter((dirname) => {
            return !ignores.includes(dirname.name)
        });
    for (const schema of schemas) {
        const model = _eval(`const _${schema.name} = require("../schema/${schema.name}/models"); 
            module.exports = {${schema.name}: _${schema.name}}`, true)
        models.push(model)
    }
    return models
}

module.exports = {
    init
}