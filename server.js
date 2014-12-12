'use strict';

/**
 * Main entry to the server side app.
 * Using ExpressJS to connect to Mongo DB and listens on port 3000
 */
var mongoose = require('mongoose'),
    config = require('./config/config');

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
        console.error('Could not connect to MongoDB!');
        console.dir(err);
    }
});

// Init the express application
var app = require('./config/express')();

// Start the app by listening on <port>
app.listen(config.runningPort);

// Logging initialization
console.log('MEAN.JS application started on port ' + config.runningPort);

// Expose app
exports = module.exports = app;