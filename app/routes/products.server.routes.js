'use strict';

module.exports = function(app) {
	var products = require('../controllers/products.server.controller'),
        productRoute = '/api/products';

	// Products Routes
	app.route(productRoute)
		.get(products.list)
		.post(products.create);

	app.route(productRoute + '/:productId')
		.get(products.read)
		.put(products.update);

	// Finish by binding the Product middleware
	app.param('productId', products.productById);
};
