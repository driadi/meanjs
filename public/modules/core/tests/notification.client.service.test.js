'use strict';

(function() {
    describe('NotificationSvc', function() {
        beforeEach(module(prodMgmtApp.moduleName));

        beforeEach(inject(function(NotificationSvc) {
            NotificationSvc.clear();
        }));

        describe('getNotifications', function() {
            it('should return empty array when there is no notification', inject(function(NotificationSvc) {
                expect(NotificationSvc.getNotifications()).toEqual([]);
            }));

            it('should return all recorded notifications in order that they are added', inject(function(NotificationSvc) {
                var error = NotificationSvc.error('This is an error'),
                    success = NotificationSvc.notify('Successful!');

                var notifications = NotificationSvc.getNotifications();
                expect(notifications.length).toBe(2);
                expect(notifications[0]).toEqual(error);
                expect(notifications[1]).toEqual(success);
            }));
        });

        describe('getLastNotification', function() {
            it('should return null when there is no notification', inject(function(NotificationSvc) {
                expect(NotificationSvc.getLastNotification()).toBeNull();
            }));

            it('should return all recorded notifications in order that they are added', inject(function(NotificationSvc) {
                var success = NotificationSvc.notify('Successful!');
                expect(NotificationSvc.getLastNotification()).toEqual(success);
            }));
        });

        describe('error', function() {
            it('should return error notification', inject(function(NotificationSvc) {
                var errorMsg = 'This is an error',
                    error = NotificationSvc.error(errorMsg);
                expect(error.message).toBe(errorMsg);
                expect(error.isError).toBeTruthy();
            }));
        });

        describe('notify', function() {
            it('should return good notification', inject(function(NotificationSvc) {
                var msg = 'successful!',
                    success = NotificationSvc.notify(msg);
                expect(success.message).toBe(msg);
                expect(success.isError).toBeFalsy();
            }));
        });

        describe('clear', function() {
            it('should clear all recorded notifications', inject(function(NotificationSvc) {
                NotificationSvc.error('This is an error');
                NotificationSvc.notify('Successful!');
                NotificationSvc.clear();
                expect(NotificationSvc.getNotifications.length).toBe(0);
                expect(NotificationSvc.getLastNotification()).toBeNull();
            }));
        });
    });
})();

