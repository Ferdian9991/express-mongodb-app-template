/**
 * Application Entry point
 * @type {createApplication}
 */
 require("dotenv").config(); 
 const express = require('express');
 const bodyParser = require('body-parser');
 const logger = require('morgan');
 const cors = require("cors");
 const routes = require('./server/router');
 const mongoose = require('./server/database/connection');
 
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
 app.listen(app.get('port'), function () {
   console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
 });
 
 module.exports = app;
 