package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class PushNotificationService extends NotificationService {
    @Override
    public Notification createNotification(String message) {
        return new PushNotification();
    }
}
