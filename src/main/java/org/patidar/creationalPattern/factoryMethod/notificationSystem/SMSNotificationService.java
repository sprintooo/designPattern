package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class SMSNotificationService extends NotificationService {
    @Override
    public Notification createNotification(String message) {
        return new SMSNotification();
    }
}
