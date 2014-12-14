'use strict';

(function() {
    function categorySaveCtrl($scope, $routeParams, $location, CategorySvc, NotificationSvc) {
        var isUpdateMode = true;

        $scope.cancel = function() {
            $location.path('home');
        };

        $scope.save = function() {
            var category = $scope.category;

            var onSuccess = function() {
                    NotificationSvc.notify('Category has been successfully saved.');
                    $location.path('categories/' + category._id);
                },
                onError = function(res) {
                    NotificationSvc.error(res.data.error.message);
                };

            if (isUpdateMode) {
                category.$update(onSuccess, onError);
            } else {
                category.$save(onSuccess, onError);
            }
        };

        $scope.findOne = function() {
            var categoryId = $routeParams.categoryId;

            if (categoryId === '0') {
                isUpdateMode = false;
                $scope.category = new CategorySvc({
                   name: ''
                });
                return;
            }

            var onSuccess = function(category) {
                    $scope.category = category;
                },
                onError = function() {
                    NotificationSvc.error('Unable to find category with ID: ' + categoryId + '. Create new one?');
                    $location.path('categories/save/0');
                };

            CategorySvc.get({
                categoryId: categoryId
            }, onSuccess, onError);
        };
    }

    angular.module('categories').controller('categorySaveCtrl', categorySaveCtrl);
})();
