'use strict';

/**
 * Useful directive to display last notification on the page
 */
(function() {
    function notifier(NotificationSvc) {
        return {
            restrict: 'E',
            replace: true,
            template: [
                '<div ng-show="show(notification)" role="alert" ng-class="notificationClass(notification.isError)">',
                '{{ notification.message }}',
                '</div>'
            ].join(''),
            link: function($scope) {
                $scope.notification = null;

                $scope.$watch(NotificationSvc.getLastNotification, function(notification) {
                    $scope.notification = notification;
                });

                $scope.show = function(notification) {
                    return (typeof notification === 'object' && notification !== null);
                };

                $scope.notificationClass = function(isError) {
                    var style = 'alert alert-';
                    return style + (isError ? 'danger' : 'success');
                };
            }
        };
    }

    angular.module('core').directive('notifier', notifier);
})();
