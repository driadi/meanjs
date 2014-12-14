'use strict';

(function() {
    describe('productSaveCtrl', function () {
        var productSaveCtrl,
            scope,
            location = { path: function() {}},
            routeParams = { productId: 0},
            mockedProductSvc,
            mockedCategorySvc,
            mockedNotificationSvc;

        beforeEach(module(prodMgmtApp.moduleName));

        beforeEach(inject(function($rootScope, $controller) {
            mockedProductSvc = {
                query: function() {
                    return [];
                }
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


    });
})();
