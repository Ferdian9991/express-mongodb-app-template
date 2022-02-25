require('dotenv').config();
const express = require('express')
const { check }  = require('express-validator');
const credential = require('../controller/actions/auth').credential()

const MainController = require('../controller/MainController');
const UserController = require('../controller/UserController');

class Router {
    index() {
        const router = express.Router()
        
        router.get('/', MainController.service)

        /**
        * Make route in the UserController in here!.
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

        return router
    }
}

module.exports = new Router
