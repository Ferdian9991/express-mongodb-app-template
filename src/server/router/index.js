require("dotenv").config({
    path: "../../.env",
});
const express = require('express')
const { check }  = require('express-validator');
const credential = require('../controller/actions/auth').credential()

const MainController = require('../controller/MainController');
const UserController = require('../controller/UserController');
const CompanyController = require('../controller/CompanyController');

class Router {
    index() {
        const router = express.Router()
        
        router.get('/', MainController.service)

        /**
        * Make UserController route in here!.
        */

        router.post('/register', 
            check('username').exists(), 
            check('email').exists(), 
            check('phoneNumber').exists(),
            check('password').exists(), 
            check('fullname').exists(), 
            UserController.register
        )
        router.post('/login', 
            check('username').exists(), 
            check('password').exists(), 
            UserController.login
        )
        router.post('/update', credential,
            check('id').exists(), 
            UserController.update
        )
        router.post('/delete', credential,
            check('id').exists(), 
            UserController.delete
        )

        /**
        * Make CompanyController route in here!.
        */

        router.post('/register-company', credential,
            check('name').exists(), 
            check('email').exists(), 
            check('address').exists(), 
            CompanyController.create
        )
        router.post('/update-company', credential,
            check('id').exists(), 
            CompanyController.update
        )
        router.post('/delete-company', credential,
            check('id').exists(), 
            CompanyController.delete
        )

        return router
    }
}

module.exports = new Router
