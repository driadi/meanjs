'use strict';

(function() {
    function homeCtrl($scope, CategorySvc) {
        $scope.categories = CategorySvc.query();
    }

    angular.module('core').controller('homeCtrl', homeCtrl);
})();
