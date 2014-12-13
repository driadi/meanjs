'use strict';

(function() {
    angular.module('products').factory('ProductSvc', ['$resource',
        function($resource) {
            return $resource('api/products/:productId', {
                productId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ]);
})();
