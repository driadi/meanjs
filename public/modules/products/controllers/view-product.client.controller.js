'use strict';

(function() {
    function productViewCtrl($scope, $location, ProductSvc) {
        $scope.find = function() {
            var searchParams = $location.search(),
                foundAnySearchParam = false;

            for (var prop in searchParams) {
                foundAnySearchParam = true;
                break;
            }

            if (!foundAnySearchParam) {
                $scope.products = ProductSvc.query();
            } else if (searchParams.hasOwnProperty('search')) {
                $scope.products = ProductSvc.query(
                    { keyword: searchParams.search });
            } else {
                $scope.products = [];
            }
        };
    }

    angular.module('products').controller('productViewCtrl', productViewCtrl);
})();
