'use strict';

module.exports = function(app) {
	var categories = require('../../app/controllers/categories.server.controller');

	// Categories Routes
	app.route('/categories')
		.get(categories.list)
		.post(categories.create);

	app.route('/categories/:categoryId')
		.get(categories.read)
		.put(categories.update);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryById);
};
