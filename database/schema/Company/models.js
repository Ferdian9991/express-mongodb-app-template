const bcrypt = require('bcrypt-nodejs');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const companySchema = new mongoose.Schema({
    _id: {type: String, required: true, default: () => uuid()},

    _createdAt: {type: String, default: ''},
    _updatedAt: {type: String, default: ''},
    _deletedAt: {type: String, default: ''},

    userId: {type: String, default: ''},
    name: {type: String, default: ''},
    profile: {type: String, default: ''},
    email: {type: String, default: ''},
    address: {type: String, default: ''},

}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    usePushEach: true, 
    collection: 'Companies'
});

companySchema.plugin(mongoosePaginate);

const User = mongoose.model('Company', companySchema);


module.exports = User;