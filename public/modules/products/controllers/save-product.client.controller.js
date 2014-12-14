'use strict';

(function() {
    function productSaveCtrl($scope, $routeParams, $location, ProductSvc, CategorySvc, NotificationSvc ) {

        /**
         * As the checklist-model directive returns object with extra attrs that $resource does not
         * understand, we need to convert the collection of object to array of category IDs
         */
        function getCategoryIds(categories) {
            if (!categories || categories.length <= 0) {
                return categories;
            }

            var result = [];
            categories.forEach(function(category) {
                result.push(category._id);
            });
            return result;
        }

        $scope.isUpdateMode = true;

        $scope.categories = CategorySvc.query();

        $scope.cancel = function() {
            $location.path('home');
        };

        $scope.save = function() {
            var product = $scope.product;

            product.categories = getCategoryIds(product.categories);

            var onSuccess = function() {
                    NotificationSvc.notify('Product has been successfully saved.');
                    $location.path('products');
                },
                onError = function(res) {
                    NotificationSvc.error(res.data.error.message);
                };

            if ($scope.isUpdateMode) {
                product.$update(onSuccess, onError);
            } else {
                product.$save(onSuccess, onError);
            }
        };

        $scope.findOne = function() {
            var productId = $routeParams.productId;

            if (productId === '0') {
                $scope.isUpdateMode = false;
                $scope.product = new ProductSvc({
                    name: '',
                    description: '',
                    sku: '',
                    price: 0,
                    stockQty: 0,
                    imageUrl: ''
                });
                return;
            }

            var onSuccess = function(product) {
                    $scope.product = product;
                },
                onError = function() {
                    NotificationSvc.error('Unable to find product with ID: ' + productId + '. Create new one?');
                    $location.path('products/save/0');
                };

            ProductSvc.get({
                productId: productId
            }, onSuccess, onError);
       };
    }

    angular.module('products').controller('productSaveCtrl', productSaveCtrl);
})();
