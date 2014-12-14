'use strict';

(function() {
    function mainMenu($location) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/core/views/main-menu.client.view.html',
            link: function($scope) {
                $scope.search = function(input) {
                    $scope.searchInput = '';
                    $location.path('products').search('search', input);
                };
            }
        };
    }

    angular.module('core').directive('mainMenu', mainMenu);
})();
