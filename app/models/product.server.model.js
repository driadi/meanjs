'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

/**
 * Validates the length of product name
 */
var validateProductNameLength = function(name) {
    return (name && name.length >= 3);
};

/**
 * Simple URL validator that checks whether it contains
 * http or ftp
 */
var validateImageUrl = function(imageUrl) {
    if (!imageUrl) {
        return true;
    }

    imageUrl = imageUrl.toLowerCase();
    return  (imageUrl.indexOf('http') === 0 || imageUrl.indexOf('ftp') === 0);
};

/**
 * Product Schema
 */
var ProductSchema = new Schema({
    name: {
		type: String,
		default: '',
		required: 'Please fill Product name',
        unique: true,
        validate: [validateProductNameLength, 'Name must be longer'],
		trim: true
	},
    sku: {
        type: String,
        default: '',
        unique: true,
        required: 'Product SKU is required',
        match: [/^[A-Z]{3}\d+$/, 'Unknown SKU format'],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
	imageUrl: {
		type: String,
		default: '',
        trim: true,
        validate: [validateImageUrl, 'Invalid URL']
	},
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    stockQty: {
        type: Number,
        default: 0,
        min: 0
    },
	categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    }],
    nameUpper: {
        // This field is useful when it comes to searching prod by name
        type: String,
        default: '',
        trim: true
    }
});

// Apply the uniqueValidator plugin
ProductSchema.plugin(uniqueValidator);

ProductSchema.statics.findByCategoryId = function(categoryId, callback) {
    return this.find({ categories: categoryId }, callback);
};

ProductSchema.statics.findByKeyword = function(keyword, callback) {
    keyword = keyword.toUpperCase();
    return this.find({$or: [{ nameUpper: keyword }, { sku: keyword }]}, callback);
};

ProductSchema.statics.findByCategoryIdAndKeyword = function(categoryId, keyword, callback) {
    keyword = keyword.toUpperCase();
    return this.find({$and: [{ categories: categoryId },
        {$or: [{ nameUpper: keyword }, { sku: keyword }]}]}, callback);
};

mongoose.model('Product', ProductSchema);