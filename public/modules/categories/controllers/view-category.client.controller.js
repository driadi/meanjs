'use strict';

(function() {
    function categoryViewCtrl($scope, $routeParams, $location, CategorySvc, NotificationSvc, ProductSvc) {
        $scope.findOne = function() {
            var categoryId = $routeParams.categoryId;

            var onSuccess = function(category) {
                    $scope.category = category;
                    $scope.products = ProductSvc.query({categoryId: category._id});
                },
                onError = function() {
                    NotificationSvc.error('Unable to find category with ID: ' + categoryId);
                    $location.path('home');
                };

            CategorySvc.get({
                categoryId: categoryId
            }, onSuccess, onError);
        };
    }

    angular.module('categories').controller('categoryViewCtrl', categoryViewCtrl);
})();
