'use strict';

(function() {
    describe('productSaveCtrl', function () {
        var productSaveCtrl,
            scope,
            location = { path: function() {}},
            routeParams = { productId: 0},
            mockedProductSvc,
            mockedCategorySvc,
            mockedNotificationSvc,
            categories = [
                { _id: 123, name: 'Category A' },
                { _id: 234, name: 'Category B'}
            ],
            product = {
                _id: 123,
                name: 'product',
                categories: [],
                $save: function() {},
                $update: function() {}
            };

        function createProduct() {
            scope.product = product;
        }

        beforeEach(module(prodMgmtApp.moduleName));

        beforeEach(inject(function($rootScope, $controller) {
            mockedProductSvc = {
                query: function() {
                    return [];
                }
            };
            mockedCategorySvc = {
                query: function() {
                    return categories;
                }
            };
            mockedNotificationSvc = {
                notify: function() {},
                error: function() {}
            };
            mockedProductSvc = {
                get: function() {}
            };

            scope = $rootScope.$new();
            productSaveCtrl = $controller('productSaveCtrl', {
                $scope : scope,
                $location: location,
                $routeParams: routeParams,
                ProductSvc : mockedProductSvc,
                CategorySvc: mockedCategorySvc,
                NotificationSvc: mockedNotificationSvc
            });
        }));

        it('$scope.categories should contain categories', function() {
            expect(scope.categories).toEqual(categories);
        });

        describe('$scope.save()', function() {
            it('should call ProductSvc.save when $scope.isUpdate is false', function() {
                createProduct();
                scope.isUpdateMode = false;
                spyOn(scope.product, '$save');
                spyOn(scope.product, '$update');
                scope.save();
                expect(scope.product.$save).toHaveBeenCalled();
                expect(scope.product.$update).not.toHaveBeenCalled();
            });

            it('should call ProductSvc.update when $scope.isUpdate is false', function() {
                createProduct();
                scope.isUpdateMode = true;
                spyOn(scope.product, '$save');
                spyOn(scope.product, '$update');
                scope.save();
                expect(scope.product.$save).not.toHaveBeenCalled();
                expect(scope.product.$update).toHaveBeenCalled();
            });
        });
    });
})();
