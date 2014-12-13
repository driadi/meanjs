'use strict';

module.exports = function(app) {
	var categories = require('../controllers/categories.server.controller'),
        categoryRoute = '/api/categories';

	// Categories Routes
	app.route(categoryRoute)
		.get(categories.list)
		.post(categories.create);

	app.route(categoryRoute + '/:categoryId')
		.get(categories.read)
		.put(categories.update);

	// Finish by binding the Category middleware
	app.param('categoryId', categories.categoryById);
};
