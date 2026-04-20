package org.patidar.creationalPattern.factoryMethod.notificationSystem;

public class EmailNotification implements Notification {
    @Override
    public void send(String johnDoeStartedFollowingYou) {
        System.out.println("Sending email notification");
    }
}
