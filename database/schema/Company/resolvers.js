const bcrypt = require('bcrypt-nodejs');
const CompanyModels = require('../../schema/Company/models');
const option = require('../../../config/options');

class CompanyResolver {

    constructor(model) {
        this.model = CompanyModels;
    }

    async findByName (options) {
        try {
            const record = this.model.findOne({name: options.name}).exec()
            
            return await record
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async findById (options) {
        try {
            const record = this.model.findOne({_id: options.id}).exec()
            
            return await record
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async create (data) {
        try {   
            const record = new this.model(data);
            const company = await record.save()

            company._createdAt = new Date().toISOString();
            company._updatedAt = new Date().toISOString();

            const registerData = await company.save();
            
            return await registerData
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async update (id, data) {
        try {
            const record = this.model.findOne({_id: id}).exec();
            const company = await record;
            Object.keys(data).map(field => {
                company[field] = data[field];
            });
            const update = await company.save();

            return update
        } catch (err) {
            return err
        }
    }

    async delete (options) {
        try {
            const record = this.model.findOne({_id: options.id}).exec();
            const company = await record;
            company.delete();
            return company;
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
;

module.exports = new CompanyResolver();
