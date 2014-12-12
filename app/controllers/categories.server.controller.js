'use strict';

var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Category = mongoose.model('Category'),
    _ = require('lodash');

/**
 * Create a Category
 */
var create = function(req, res) {
	var category = new Category(req.body);
	category.save(function(err) {
        var error;
		if (err) {
            error = errorHandler.generateError(
                'Error occurs when attempting to create new category.', err);
			return res.status(400).send(error);
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * Show the current Category
 */
var read = function(req, res) {
	res.jsonp(req.category);
};

/**
 * Update a Category
 */
var update = function(req, res) {
	var category = req.category ;
	category = _.extend(category , req.body);

	category.save(function(err) {
        var error;
		if (err) {
            error = errorHandler.generateError('Error occurs when attempting to update ' +
                'category with id ' + category._id, err);
			return res.status(400).send(error);
		} else {
			res.jsonp(category);
		}
	});
};

/**
 * List of Categories
 */
var list = function(req, res) {
	Category.find().sort('-name').exec(function(err, categories) {
        var error;
		if (err || !categories) {
            error = errorHandler.generateError('Error occurs when attempting to retrieve category list', err);
			return res.status(400).send(error);
		} else {
			res.jsonp(categories);
		}
	});
};

/**
 * Category middleware
 */
var categoryById = function(req, res, next, id) {
	Category.findById(id).exec(function(err, category) {
		var error;
        if (err || !category) {
            error = errorHandler.generateError('Failed to load Category ' + id, err);
            return next(error);
        }

		req.category = category;
		next();
	});
};

module.exports = {
    create: create,
    read: read,
    update: update,
    list: list,
    categoryById: categoryById
};
