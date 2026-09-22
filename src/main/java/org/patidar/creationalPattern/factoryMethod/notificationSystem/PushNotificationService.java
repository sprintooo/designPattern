package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class PushNotificationService implements NotificationService {
    @Override
    public Notification createNotification(String message) {
        return new PushNotification();
    }
}
