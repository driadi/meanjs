'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
    uniqueValidator = require('mongoose-unique-validator');

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	name: {
		type: String,
		default: '',
        unique: true,
		required: 'Please fill Category name',
		trim: true
	}
});

// Apply the uniqueValidator plugin
CategorySchema.plugin(uniqueValidator);

mongoose.model('Category', CategorySchema);