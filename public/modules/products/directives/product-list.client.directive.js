'use strict';

/**
 * Reusable directive to display list of products in a table
 */
(function() {
    function productList() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/products/views/product-list.client.view.html',
            scope: {
                products: '='
            },
            link: function($scope) {
                $scope.show = function() {
                    var products = $scope.products;
                    return products && products.length > 0;
                };
            }
        };
    }

    angular.module('products').directive('productList', productList);
})();
