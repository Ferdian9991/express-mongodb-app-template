/**
 * Application Entry point
 * @type {createApplication}
 */
require("dotenv").config({
  path: "../../.env",
}); 
 const express = require('express');
 const bodyParser = require('body-parser');
 const logger = require('morgan');
 const cors = require("cors");
 const routes = require('./router');
 const mongoose = require('./database/connection');
 
 const app = express();
 
 mongoose.connect();
 
 app.set('port', process.env.PORT || 3000);
 
 app.use(logger('dev'));
 
 const corsOptions = {
   origin: `http://localhost:3000`,
   optionsSuccessStatus: 200,
 };

 // PreFLIGHT!

 app.use(cors(corsOptions));
 app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 5000 }));
 app.use(bodyParser.json({ limit: '50mb' }));
 
 app.use('/', routes.index())
 
 /**
  * Start express.
  */
 app.listen(process.env.API_PORT || 3000, function () {
   console.log('Express server listening on port %d in %s mode', process.env.API_PORT || 3000, app.get('env'));
 });
 
 module.exports = app;
 