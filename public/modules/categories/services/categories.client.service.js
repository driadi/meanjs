'use strict';

(function() {
    angular.module('categories').factory('CategorySvc', ['$resource',
        function($resource) {
            return $resource('api/categories/:categoryId', {
                categoryId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
})();
