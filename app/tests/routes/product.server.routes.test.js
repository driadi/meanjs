'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../../../server'),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    Product = mongoose.model('Product'),
    agent = request.agent(app);

/**
* Globals
*/
var category,
    product,
    path = '/api/products',
    pathwithKeyword = path + '?keyword=',
    pathWithCategoryId = path + '?categoryId=',
    pathWithId;

/**
* Product routes tests
*/
describe('Product CRUD tests', function() {
    function updateProductWithCategory(callback) {
        product.categories.push(category._id);
        product.save(function() {
           callback();
        });
    }

    function validateCreateAndUpdateTests(reqMethod, reqPath, expectedResCode, endCallback) {
        agent[reqMethod](reqPath)
            .send(product)
            .expect(expectedResCode)
            .end(endCallback);
    }
    function validateGetTests(reqPath, expectedResCode, endCallback) {
        agent.get(reqPath)
            .expect(expectedResCode)
            .end(endCallback);
    }

	beforeEach(function(done) {
        category = new Category({
            name: 'Category A'
        });

        product = new Product({
            name: 'Pencil',
            sku: 'PEN1234567',
            nameUpper: 'PENCIL',
            categories: []
        });

        pathWithId = path + '/' + product._id;

        category.save(function() {
            product.save(function() {
                done();
            });
        });
	});

    describe('Create', function() {
        it('should be able to save new Product instance', function(done) {
            product = new Product({
                name: 'Ballpoint',
                sku: 'B1234'
            });

            validateCreateAndUpdateTests(
                'post',
                path,
                200,
                function(productSaveErr, productSaveRes) {
                    var res = productSaveRes.body;
                    should.not.exists(res.error);
                    res.name.should.be.exactly(product.name);
                    res.nameUpper.should.be.exactly(product.name.toUpperCase());
                    res.categories.length.should.be.exactly(0);

                    // sku should only be defined by controller
                    res.sku.should.not.be.exactly(product.sku);
                    res.sku.indexOf('BAL').should.be.exactly(0);
                    done();
                });
        });

        it('should not be able to create same Product instance', function(done) {
            validateCreateAndUpdateTests(
                'post',
                path,
                400,
                function(productSaveErr, productSaveRes) {
                    should.exists(productSaveRes.body.error);
                    done();
                });
        });
    });

    describe('Update', function() {
        it('should be able to update existing product', function(done) {
            product.name = 'Ballpoint';

            validateCreateAndUpdateTests(
                'put',
                pathWithId,
                200,
                function(productSaveErr, productSaveRes) {
                    var res = productSaveRes.body;
                    should.not.exists(res.error);
                    res.name.should.be.exactly(product.name);
                    res.nameUpper.should.be.exactly(product.name.toUpperCase());
                    done();
                }
            );
        });

        it('should not be able to update product sku', function(done) {
            product.sku = 'abc12345';

            validateCreateAndUpdateTests(
                'put',
                pathWithId,
                200,
                function(productSaveErr, productSaveRes) {
                    var res = productSaveRes.body;
                    should.not.exists(res.error);
                    res.sku.should.not.be.exactly(product.sku);
                    res.sku.indexOf('PEN').should.be.exactly(0);
                    done();
                }
            );
        });

        it('should not be able to update new Product instance', function(done) {
            product = new Product({
                name: 'Ballpoint'
            });
            validateCreateAndUpdateTests(
                'put',
                pathWithId,
                400,
                function(productSaveErr, productSaveRes) {
                    should.exists(productSaveRes.body.error);
                    done();
                }
            );
        });
    });

    describe('Create & Update', function() {
        it('should not save duplicate categories', function(done) {
            product.categories = [ category._id, category._id ];
            validateCreateAndUpdateTests(
                'put',
                pathWithId,
                200,
                function(productSaveErr, productSaveRes) {
                    productSaveRes.body.categories.length.should.be.exactly(1);
                    done();
                }
            );
        });
    });

    describe('List', function() {
        it('should be able to get list of products', function(done) {
            validateGetTests(path, 200, function(req, res) {
                res.body.length.should.be.exactly(1);
                res.body[0].name.should.be.exactly(product.name);
                done();
            });
        });

        it('should return empty collection when there is no product', function(done) {
            Product.remove().exec(function() {
                validateGetTests(path, 200, function(req, res) {
                    res.body.length.should.be.exactly(0);
                    done();
                });
            });
        });

        it('should not be able to get list of products when path is wrong', function(done) {
            validateGetTests('/product', 404, function(req, res) {
                should.exists(res.body.error);
                done();
            });
        });

        it('should be able to get list of products with name matches keyword', function(done) {
            validateGetTests(pathwithKeyword + 'pencil', 200, function(req, res) {
                res.body.length.should.be.exactly(1);
                done();
            });
        });

        it('should be able to get list of products with sku matches keyword', function(done) {
            validateGetTests(pathwithKeyword + product.sku, 200, function(req, res) {
                res.body.length.should.be.exactly(1);
                done();
            });
        });

        it('should be able to get list of products by categoryId', function(done) {
            updateProductWithCategory(function() {
                validateGetTests(pathWithCategoryId + category._id, 200, function(req, res) {
                    res.body.length.should.be.exactly(1);
                    done();
                });
            });
        });

        it('should be able to get list of products by categoryId and keyword', function(done) {
            var reqPath = pathWithCategoryId + category._id + '&keyword=' + product.name;
            updateProductWithCategory(function() {
                validateGetTests(reqPath, 200, function(req, res) {
                    res.body.length.should.be.exactly(1);
                    done();
                });
            });
        });

        it('should not be able to get list of products when the category matches but not the keyword', function(done) {
            var reqPath = pathWithCategoryId + category._id + '&keyword=pen';
            updateProductWithCategory(function() {
                validateGetTests(reqPath, 200, function(req, res) {
                    res.body.length.should.be.exactly(0);
                    done();
                });
            });
        });

        it('should not be able to get list of products when the keyword matches but not the category', function(done) {
            var reqPath = pathWithCategoryId + 12345 + '&keyword=pen';
            updateProductWithCategory(function() {
                validateGetTests(reqPath, 400, function(req, res) {
                    should.exists(res.body.error);
                    done();
                });
            });
        });
    });

    describe('Read', function() {
        it('should be able to read product with valid id', function(done) {
            validateGetTests(pathWithId, 200, function(req, res) {
                res.body.name.should.be.exactly(product.name);
                done();
            });
        });

        it('should not be able to read product with unknown id', function(done) {
            validateGetTests(path + 1, 400, function(req, res) {
                should.exists(res.body.error);
                done();
            });
        });
    });

	afterEach(function(done) {
		Product.remove().exec();
        Category.remove().exec();
		done();
	});
});