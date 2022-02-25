require('dotenv').config();
const express = require('express')
const MainController = require('../controller/MainController');

class Router {
    index() {
        const router = express.Router()
        
        router.get('/', MainController.service)

        return router
    }
}

module.exports = new Router
