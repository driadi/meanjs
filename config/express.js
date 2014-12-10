'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    runningPort = 3000,
    models = [ 'category' ],
    routes = [ 'categories' ];

/**
 * Handle errors that may occur in the application
 */
var handleErrors = function(app) {
    /**
     * Callback handler that is used when user requests an unknown
     * REST path
     */
    var unknownPath = function(req, res) {
        res.statusCode = 404;
        res.send({ error: 'Not found' });
    };

    /**
     * Generic error handler that logs the error to console
     */
    var logError = function(err, req, res) {
        console.error('Error occurs within the application');
        console.dir(err);
        res.send(err);
    };

    if (app) {
        app.use(unknownPath);
        app.use(logError);
    }
};

module.exports = function() {
    var app = express();

    // init the models
    models.forEach(function(model) {
        require('../app/models/' + model + '.server.model');
    });

    app.set('port', runningPort);
    app.use(bodyParser.json());

    // define routes
    routes.forEach(function(route) {
        require('../app/routes/' + route + '.server.routes')(app);
    });

    handleErrors(app);

    return app;
};