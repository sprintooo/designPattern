package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class EmailNotificationService extends NotificationService {
    @Override
    public Notification createNotification(String message) {
        return new EmailNotification();
    }
}
