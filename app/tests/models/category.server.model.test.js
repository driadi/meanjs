'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category');

/**
 * Globals
 */
var category;

/**
 * Unit tests
 */
describe('Category Model Unit Tests:', function() {
    beforeEach(function(done) {
        category = new Category({
            name: 'Category A'
        });

        category.save(function() {
            done();
        });
    });

    function errorShouldExistAfterSaving(done) {
        return category.save(function(err) {
            should.exist(err);
            done();
        });
    }

    it('should be able to save without problems', function(done) {
        return category.save(function(err) {
            should.not.exist(err);
            done();
        });
    });

    it('should save trimmed category name', function(done) {
        var newCategoryName = 'ABC DEF ';
        category.name = newCategoryName;

        return category.save(function(err, savedCategory) {
            savedCategory.name.should.not.be.exactly(newCategoryName);
            savedCategory.name.should.be.exactly(newCategoryName.trim());
            done();
        });
    });

    it('should be able to show an error when try to save without name', function(done) {
        category.name = '';
        return errorShouldExistAfterSaving(done);
    });

    it('should be able to show an error when try to save new category with' +
        ' duplicate name', function(done) {

        category = new Category({
            name: 'Category A'
        });
        return errorShouldExistAfterSaving(done);
    });

    afterEach(function(done) {
        Category.remove().exec();
        done();
    });
});