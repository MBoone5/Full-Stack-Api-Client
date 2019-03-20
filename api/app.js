'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const jsonParser = require('body-parser').json;
const router = require('./router');
const mongoose = require('mongoose');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// initialzig connection to db
mongoose.connect('mongodb://127.0.0.1:27017/fsjstd-restapi');
const db = mongoose.connection;

// connection error handler
db.on('error', console.error.bind(console, 'connection error:')); // from mongoose documentation

// once connection is open
db.once('open', () => {
  // connection message
  console.log('connection sucessful');
});

// parsing json
app.use(jsonParser());

// external routing module
app.use('/api', router);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
 
  // reg exp for error message testing
  const validationExp = /User\svalidation\sfailed/;
  const hashExp = /Illegal\sarguments:/;

  if (validationExp.test(err.message)) {  // tetsting for a schema validation error
    err.status = 400;
  } else if (hashExp.test(err.message)) {   // testing for .hash fails because a password wasn't sent in the request body
    err.message = 'Please send user information`';
    err.status = 400;
  }

  // sending the error 
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
