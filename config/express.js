'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    cors = require('cors'),
    models = [ 'category', 'product' ],
    routes = [ 'categories', 'products', 'core' ];

/**
 * Handle errors that may occur in the application
 */
var handleErrors = function(app) {
    /**
     * Callback handler that is used when user requests an unknown
     * REST path
     */
    var unknownPath = function(req, res) {
        res.status(404).send(
            { error: { message: 'Not found' }}
        );
    };

    /**
     * Generic error handler that logs the error to console
     */
    var logError = function(err, req, res, next) {
        console.error('Error occurs within the application');
        console.dir(err);
        res.status(400).send(err);
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

    app.use(bodyParser.json());
    app.use(cors());

    // define routes
    routes.forEach(function(route) {
        require('../app/routes/' + route + '.server.routes')(app);
    });

    app.use(express.static(path.resolve('./public')));

    handleErrors(app);

    return app;
};