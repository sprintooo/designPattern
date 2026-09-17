package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class SMSNotification implements Notification {
    @Override
    public void send(String johnDoeStartedFollowingYou) {
        System.out.println("Sending SMS notification");
    }
}
