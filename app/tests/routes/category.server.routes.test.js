'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../../server'),
	mongoose = require('mongoose'),
	Category = mongoose.model('Category'),
	agent = request.agent(app);

/**
* Globals
*/
var category,
    path = '/categories/',
    pathWithId;

/**
* Category routes tests
*/
describe('Category CRUD tests', function() {
    function validateCreateAndUpdateTests(reqMethod, reqPath, expectedResCode, endCallback) {
        agent[reqMethod](reqPath)
            .send(category)
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
        pathWithId = path + category._id;
        category.save(function() {
            done();
        });
	});

    describe('Create', function() {
        it('should be able to save new Category instance', function(done) {
            category = new Category({
                name: 'Category B'
            });

            validateCreateAndUpdateTests(
                'post',
                path,
                200,
                function(categorySaveErr, categorySaveRes) {
                    var res = categorySaveRes.body;
                    should.not.exists(res.error);
                    res.name.should.be.exactly(category.name);
                    done();
                });
        });

        it('should not be able to create same Category instance', function(done) {
            validateCreateAndUpdateTests(
                'post',
                path,
                400,
                function(categorySaveErr, categorySaveRes) {
                    should.exists(categorySaveRes.body.error);
                    done();
                });
            });
    });

    describe('Update', function() {
        it('should be able to update existing category', function(done) {
            category.name = 'Category B';

            validateCreateAndUpdateTests(
                'put',
                pathWithId,
                200,
                function(categorySaveErr, categorySaveRes) {
                    var res = categorySaveRes.body;
                    should.not.exists(res.error);
                    res.name.should.be.exactly(category.name);
                    done();
                }
            );
        });

        it('should not be able to update new Category instance', function(done) {
            category = new Category({
                name: 'Category B'
            });

            validateCreateAndUpdateTests(
                'put',
                ('/categories/' + category._id),
                400,
                function(categorySaveErr, categorySaveRes) {
                    should.exists(categorySaveRes.body.error);
                    done();
                }
            );
        });
    });

    describe('List', function() {
        it('should be able to get list of categories', function(done) {
            validateGetTests(path, 200, function(req, res) {
                res.body.length.should.be.exactly(1);
                res.body[0].name.should.be.exactly(category.name);
                done();
            });
        });

        it('should return empty collection when there is no categories', function(done) {
            Category.remove().exec(function() {
                validateGetTests(path, 200, function(req, res) {
                    res.body.length.should.be.exactly(0);
                    done();
                });
            });
        });

        it('should not be able to get list of categories when path is wrong', function(done) {
            validateGetTests('/category', 404, function(req, res) {
                should.exists(res.body.error);
                done();
            });
        });
    });

    describe('Read', function() {
        it('should be able to read category with valid id', function(done) {
            validateGetTests(pathWithId, 200, function(req, res) {
                res.body.name.should.be.exactly(category.name);
                done();
            });
        });

        it('should not be able to read category with unknown id', function(done) {
            validateGetTests(path + 1, 400, function(req, res) {
                should.exists(res.body.error);
                done();
            });
        });
    });

	afterEach(function(done) {
		Category.remove().exec();
		done();
	});
});