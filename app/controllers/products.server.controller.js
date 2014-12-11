'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Product = mongoose.model('Product'),
	_ = require('lodash');

/**
 * Generates SKU by combining the first 3 letters of prod name
 * and current timestamp
 */
var generateProductSku = function(product) {
    var result = '';
    if (product && product.name && product.name.length >= 3) {
        result = product.name.toUpperCase().substr(0, 3) + (new Date()).getTime();
    }
    return result;
};

/**
 * Sanitize product by setting the nameUpper field and ensure no duplicates
 * in the categories
 */
var sanitizeData = function(product) {
    if (!product) {
        return;
    }

    // set name_upper
    product.nameUpper = product.name.toUpperCase();

    // make sure categories are unique
    // perhaps need to use $addToSet to ensure no duplicate categories
    // but this approach gets the job done quicker for now
    product.categories = _.uniq(product.categories, function(obj) {
        return obj.toString();
    });
};

/**
 * Create a Product
 */
var create = function(req, res) {
	var product = new Product(req.body);

    // set a unique product SKU
    product.sku = generateProductSku(product);

    sanitizeData(product);

	product.save(function(err) {
        var error;
        if (err) {
            error = errorHandler.generateError(
                'Error occurs when attempting to create new product.', err);
            return res.status(400).send(error);
        } else {
            res.jsonp(product);
        }
	});
};

/**
 * Show the current Product
 */
var read = function(req, res) {
	res.jsonp(req.product);
};

/**
 * Update a Product
 */
var update = function(req, res) {
	var product = req.product,
        sku = product.sku;

	product = _.extend(product , req.body);

    // we need to make sure that product sku is non editable
    product.sku = sku;

    sanitizeData(product);

    product.save(function(err) {
        var error;
        if (err) {
            error = errorHandler.generateError('Error occurs when attempting to update ' +
                'product with id ' + product._id, err);
            return res.status(400).send(error);
        } else {
            res.jsonp(product);
        }
	});
};


/**
 * List of Products
 */
var list = function(req, res) {
    var query;

    if (req.query.hasOwnProperty('categoryId')) {
        query = Product.findByCategoryId(req.query.categoryId);
    } else if (req.query.hasOwnProperty('keyword')) {
        query = Product.findByKeyword(req.query.keyword);
    } else {
        query = Product.find();
    }

    query.sort('-name').populate('categories').exec(function(err, products) {
		var error;
        if (err || !products) {
            error = errorHandler.generateError('Error occurs when attempting to retrieve product list', err);
            return res.status(400).send(error);
        } else {
            res.jsonp(products);
        }
	});
};

/**
 * Product middleware
 */
var productById = function(req, res, next, id) {
	Product.findById(id).populate('categories').exec(function(err, product) {
        var error;

        if (err || !product) {
            error = errorHandler.generateError('Failed to load Product ' + id, err);
            return next(error);
        }

        req.product = product;
        next();
    });
};

module.exports = {
    create: create,
    read: read,
    update: update,
    list: list,
    productById: productById
};
