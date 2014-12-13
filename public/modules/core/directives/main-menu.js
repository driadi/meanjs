'use strict';

(function() {
    function mainMenu($location) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/core/directives/main-menu.html',
            link: function($scope) {
                $scope.searchInput = 'product search';

                $scope.search = function(input) {
                    $location.path('/products').search('search', input);
                };
            }
        };
    }

    angular.module('core').directive('mainMenu', mainMenu);
})();
