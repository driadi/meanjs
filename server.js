'use strict';

/**
 * Main entry to the server side app.
 * Using ExpressJS to connect to Mongo DB and listens on port 3000
 */
var mongoose = require('mongoose'),
    dbUri = 'mongodb://localhost/meanproduct';

// Bootstrap db connection
var db = mongoose.connect(dbUri, function(err) {
    if (err) {
        console.error('Could not connect to MongoDB!');
        console.dir(err);
    }
});

// Init the express application
var app = require('./config/express')();

var appPort = app.get('port');

// Start the app by listening on <port>
app.listen(appPort);

// Logging initialization
console.log('MEAN.JS application started on port ' + appPort);


// Expose app
exports = module.exports = app;