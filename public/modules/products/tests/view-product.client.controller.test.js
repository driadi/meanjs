'use strict';

(function() {
    describe('productViewCtrl', function () {
        var productViewCtrl,
            scope,
            location = { search: function() {}},
            mockedProductSvc;

        beforeEach(module(prodMgmtApp.moduleName));

        beforeEach(inject(function($rootScope, $controller) {
            mockedProductSvc = {
                query: function() {
                    return [];
                }
            };
            scope = $rootScope.$new();
            productViewCtrl = $controller('productViewCtrl', {
                $scope : scope,
                $location: location,
                ProductSvc : mockedProductSvc
            });
        }));

        describe('$scope.find()', function() {
            it('should call ProductSvc.query() without parameter if there is no query parameters', function () {
                spyOn(location, 'search').and.returnValue({});
                spyOn(mockedProductSvc, 'query');
                scope.find();
                expect(mockedProductSvc.query).toHaveBeenCalled();
                expect(mockedProductSvc.query.calls.mostRecent().args.length).toBe(0);
            });

            it('should call ProductSvc.query() with parameter if there is "search" query string', function () {
                var query = 'name',
                    args;

                spyOn(location, 'search').and.returnValue({ search: query});
                spyOn(mockedProductSvc, 'query');
                scope.find();
                expect(mockedProductSvc.query).toHaveBeenCalled();
                args = mockedProductSvc.query.calls.mostRecent().args;
                expect(args[0]).toEqual({ keyword: query});
            });

            it('should set $scope.product to be [] if query parameters are unknown', function () {
                spyOn(location, 'search').and.returnValue({ category: 1 });
                spyOn(mockedProductSvc, 'query');
                scope.find();
                expect(scope.products).toEqual([]);
            });
        });
    });
})();
