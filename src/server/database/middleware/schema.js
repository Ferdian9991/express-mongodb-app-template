const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt-nodejs');

/**
* Call all packages to build schema here!.
*/

module.exports = {
    schema: (fields, options) => {
        if ( typeof fields === 'object' ) {
            fields._id = {type: String, required: true, default: () => uuid()};

            if (options != undefined) {
                if (typeof options !== 'object') {
                    throw new Error('Schema options must be an object!') 
                }
            }
            const schema = new mongoose.Schema(fields, options)
            return schema;
        } else {
            throw new Error('Schema field must be an object!') 
        }
    },
    model: (modelName, schema) => {
        return mongoose.model(modelName, schema)
    },
    paginate: (schema) => {
        return schema.plugin(mongoosePaginate);
    },
    bcrypt: () => bcrypt
}