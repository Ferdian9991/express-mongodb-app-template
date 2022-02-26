const { validationResult }  = require('express-validator');
const options  = require('../config/options');
const companyResolvers = require('../database/schema/Company/resolvers')
const auth = require('./actions/auth')

class CompanyController {
  async create(req, res) {
    const errors = validationResult(req)
    const context = await auth.getContext(req);

    let message = '';

    if (context.auth) {
        if(!errors.isEmpty()){
            message = 'Required parameters missing';
            options.responseMessage({res, statusCode: 400, auth: false, message})
            throw new Error(message);
        }
    
        message = "Successfully registered a new company!"
        const params = req.body;
        params['userId'] = context.user.id
    
        const data = await companyResolvers.create(params)
        
        options.responseMessage({res, statusCode: 200, auth: context.auth, message, data})
    } else {
        message = 'Unauthorization!';
        options.responseMessage({res, statusCode: 401, auth: context.auth, message})
    }
  }

  async update (req, res) {
    const errors = validationResult(req)
    const context = await auth.getContext(req);

    let message = '';

    if (context.auth) {
        if(!errors.isEmpty()){
            message = 'Required parameters missing';
            options.responseMessage({res, statusCode: 400, auth: false, message})
            throw new Error(message);
        }

        const params = req.body;

        const foundCompany = await companyResolvers.findById(params);

        if (!foundCompany) {
            message = `Cannot find company id ${params.id}`;
            options.responseMessage({res, statusCode: 400, auth: context.auth, message})
            throw new Error(message);
        }

        const data = await companyResolvers.update(params.id, params)

        message = `Company updated successfully!`;
        options.responseMessage({res, statusCode: 200, auth: context.auth, message, data})
    } else {
        message = 'Unauthorization!';
        options.responseMessage({res, statusCode: 401, auth: context.auth, message})
    }
  }

  async delete (req, res) {
    const errors = validationResult(req)
    const context = await auth.getContext(req);

    let message = '';

    if (context.auth) {
        if(!errors.isEmpty()){
            message = 'Required parameters missing';
            options.responseMessage({res, statusCode: 400, auth: false, message})
            throw new Error(message);
        }

        const params = req.body;

        const foundCompany = await companyResolvers.findById(params);

        if (!foundCompany) {
            message = `Cannot find company id ${params.id}`;
            options.responseMessage({res, statusCode: 400, auth: context.auth, message})
            throw new Error(message);
        }

        const data = await companyResolvers.delete(params)

        message = `Company deleted successfully!`;
        options.responseMessage({res, statusCode: 200, auth: context.auth, message, data})
    } else {
        message = 'Unauthorization!';
        options.responseMessage({res, statusCode: 401, auth: context.auth, message})
    }
  }
}

module.exports = new CompanyController();