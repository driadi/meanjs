'use strict';

var should = require('should'),
	mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
	Product = mongoose.model('Product');

/**
* Globals
*/
var category, product;

/**
* Unit tests
*/
describe('Product Model Unit Tests:', function() {
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

        category.save(function() {
            product.save(function() {
                done();
            });
        });
	});

    function errorShouldNotExistAfterSaving(done) {
        return product.save(function(err) {
            should.not.exist(err);
            done();
        });
    }
    function errorShouldExistAfterSaving(done) {
        return product.save(function(err) {
            should.exist(err);
            done();
        });
    }

    it('should be able to save without problems', function(done) {
        return errorShouldNotExistAfterSaving(done);
    });

	describe('Validate name', function() {
        it('should save trimmed product name', function(done) {
            var newProductName = 'New Pencil   ';
            product.name = newProductName;

            return product.save(function(err, savedProduct) {
                savedProduct.name.should.not.be.exactly(newProductName);
                savedProduct.name.should.be.exactly(newProductName.trim());
                done();
            });
        });

		it('should be able to show an error when try to save without name', function(done) {
			product.name = '';
			return errorShouldExistAfterSaving(done);
		});

        it('should be able to show an error when try to save name with length less ' +
            'than 3 chars', function(done) {
            product.name = 'BB';
            return errorShouldExistAfterSaving(done);
        });

        it('should be able to show an error when try to save name that already exists', function(done) {
            product = new Product({
                name: 'Pencil',
                sku: 'PEN09874',
                nameUpper: 'PENCIL'
            });
            return errorShouldExistAfterSaving(done);
        });
	});

    describe('Validate sku', function() {
        it('should save trimmed sku', function(done) {
            var newSku = 'PEN123  ';
            product.sku = newSku;

            return product.save(function(err, savedProduct) {
                savedProduct.sku.should.not.be.exactly(newSku);
                savedProduct.sku.should.be.exactly(newSku.trim());
                done();
            });
        });

        it('should be able to show an error when try to save without sku', function(done) {
            product.sku = '';
            return errorShouldExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with sku that does not ' +
            'follow the format', function(done) {
            product.sku = 'SKU';
            return errorShouldExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with sku that already exists', function(done) {
            product = new Product({
                name: 'Ballpoint',
                sku: 'PEN1234567',
                nameUpper: 'BALLPOINT'
            });
            return errorShouldExistAfterSaving(done);
        });
    });

    describe('Validate imageUrl', function() {
        it('should be able to save with imageUrl that starts with http', function(done) {
            product.imageUrl = 'http://www.google.com/image.jpg';
            return errorShouldNotExistAfterSaving(done);
        });

        it('should be able to save with imageUrl that starts with ftp', function(done) {
            product.imageUrl = 'ftp://www.google.com/image.jpg';
            return errorShouldNotExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with imageUrl that does not ' +
            'start with http or ftp', function(done) {
            product.imageUrl = 'image.jpg';
            return errorShouldExistAfterSaving(done);
        });
    });

    describe('Validate price', function() {
        it('should save default price as 0', function(done) {
            Product.findById(product._id, function(err, prod) {
                prod.price.should.be.exactly(0);
                done();
            });
        });

        it('should be able to save price that is greater than or equal to 0', function(done) {
            product.price = 1;
            return errorShouldNotExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with price less than 0', function(done) {
            product.price = -1;
            return errorShouldExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with price as string', function(done) {
            product.price = 'abc';
            return errorShouldExistAfterSaving(done);
        });
    });

    describe('Validate stockQty', function() {
        it('should save default stockQty as 0', function(done) {
            Product.findById(product._id, function(err, prod) {
                prod.stockQty.should.be.exactly(0);
                done();
            });
        });

        it('should be able to save stockQty that is greater than or equal to 0', function(done) {
            product.stockQty = 1;
            return errorShouldNotExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with stockQty less than 0', function(done) {
            product.stockQty = -1;
            return errorShouldExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with stockQty as string', function(done) {
            product.stockQty = 'abc';
            return errorShouldExistAfterSaving(done);
        });
    });

    describe('Validate categories', function() {
        it('should be able to save with known category id', function(done) {
            product.categories.push(category._id);
            return errorShouldNotExistAfterSaving(done);
        });

        it('should be able to show an error when try to save with unknown category id', function(done) {
            product.categories = ['abc', '1'];
            return errorShouldExistAfterSaving(done);
        });
    });

    describe('Method findByKeyword', function() {
        it('should return empty array if there is no product matches keyword', function(done) {
            Product.findByKeyword('', function(err, products) {
                products.length.should.be.exactly(0);
                should.not.exists(err);
                done();
            });
        });

        it('should be able to find product with name matches keyword', function(done) {
            Product.findByKeyword('pencil', function(err, products) {
                products.length.should.be.exactly(1);
                should.not.exists(err);
                done();
            });
        });

        it('should be able to find product with sku matches keyword', function(done) {
            Product.findByKeyword('PeN1234567', function(err, products) {
                products.length.should.be.exactly(1);
                should.not.exists(err);
                done();
            });
        });
    });

    describe('Method findByCategoryId', function() {
        it('should return empty array if there is no product in certain category', function(done) {
            Product.findByCategoryId(category._id, function(err, products) {
                products.length.should.be.exactly(0);
                should.not.exists(err);
                done();
            });
        });

        it('should be able to find product with matching category', function(done) {
            product.categories.push(category._id);
            product.save(function() {
                Product.findByCategoryId(category._id, function(err, products) {
                    products.length.should.be.exactly(1);
                    should.not.exists(err);
                    done();
                });
            });
        });

        it('should be able to show an error when categoryId is unrecognized', function(done) {
            Product.findByCategoryId(1, function(err) {
                should.exists(err);
                done();
            });
        });
    });

    describe('Method findByCategoryIdAndKeyword', function() {
        it('should return empty array if there is no product in certain category', function(done) {
            Product.findByCategoryIdAndKeyword(category._id, 'pencil', function(err, products) {
                products.length.should.be.exactly(0);
                should.not.exists(err);
                done();
            });
        });

        it('should return empty array if there is no product that matches the keyword', function(done) {
            product.categories.push(category._id);
            product.save(function() {
                Product.findByCategoryIdAndKeyword(category._id, 'pen', function(err, products) {
                    products.length.should.be.exactly(0);
                    should.not.exists(err);
                    done();
                });
            });
        });

        it('should return the product that matches the category and keyword', function(done) {
            product.categories.push(category._id);
            product.save(function() {
                Product.findByCategoryIdAndKeyword(category._id, 'pencil', function(err, products) {
                    products.length.should.be.exactly(1);
                    should.not.exists(err);
                    done();
                });
            });
        });
    });

	afterEach(function(done) {
		Product.remove().exec();
		Category.remove().exec();
		done();
	});
});