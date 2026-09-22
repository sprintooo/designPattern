package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class EmailNotificationService implements NotificationService {
    @Override
    public Notification createNotification(String message) {
        return new EmailNotification();
    }
}
