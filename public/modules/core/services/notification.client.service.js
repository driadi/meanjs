'use strict';

/**
 * This service can be used by all modules to record notifications and errors
 */
(function() {
    var notifications = [];

    function clear() {
        notifications = [];
    }

    function addNotification(message, isError) {
        var notification = {
            message: message,
            isError: (isError === true)
        };

        notifications.push(notification);
        return notification;
    }

    function error(message) {
        return addNotification(message, true);
    }

    function notify(message) {
        return addNotification(message, false);
    }

    function getNotifications() {
        return notifications;
    }

    function getLastNotification() {
        var length = notifications.length;
        return (length > 0) ? notifications[length - 1] : null;
    }

    function notificationSvc() {
        return {
            clear: clear,
            error: error,
            notify: notify,
            getNotifications: getNotifications,
            getLastNotification: getLastNotification
        };
    }

    angular.module('core').factory('NotificationSvc', notificationSvc);
})();