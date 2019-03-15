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
  const validationExp = /User\svalidation\sfailed/;
  if (validationExp.test(err.message)) {
    err.status = 400;
  }
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
