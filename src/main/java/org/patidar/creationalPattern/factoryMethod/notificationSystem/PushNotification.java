package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class PushNotification implements Notification {
    @Override
    public void send(String johnDoeStartedFollowingYou) {
        System.out.println("Sending push notification");
    }
}
