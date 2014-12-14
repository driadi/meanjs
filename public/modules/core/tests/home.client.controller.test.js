'use strict';

(function() {
    describe('homeCtrl', function () {
        var homeCtrl,
            scope,
            mockedCategorySvc,
            categories = [
                { _id: 1, name: 'Category A' },
                { _id: 2, name: 'Category B' }
            ];

        beforeEach(module(prodMgmtApp.moduleName));

        beforeEach(inject(function($rootScope, $controller) {
            mockedCategorySvc = {
                query: function() {
                    return categories;
                }
            };
            scope = $rootScope.$new();
            homeCtrl = $controller('homeCtrl', {
                $scope : scope,
                CategorySvc : mockedCategorySvc
            });

        }));

        it('should contain categories array in the scope', function () {
            expect(scope.categories).toEqual(categories);
        });

    });
})();