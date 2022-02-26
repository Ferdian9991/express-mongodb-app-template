const Builder = require('../../middleware/schema')

const companySchema = Builder.schema({
    userId: {type: String, default: ''},
    name: {type: String, default: ''},
    profile: {type: String, default: ''},
    email: {type: String, default: ''},
    address: {type: String, default: ''},

    _createdAt: {type: String, default: ''},
    _updatedAt: {type: String, default: ''},
    _deletedAt: {type: String, default: ''},

}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    usePushEach: true, 
    collection: 'Companies'
});

Builder.paginate(companySchema);

const Company = Builder.model('Company', companySchema);

module.exports = Company;