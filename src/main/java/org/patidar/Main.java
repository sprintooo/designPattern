package org.patidar;

import org.patidar.creationalPattern.factoryMethod.notificationSystem.EmailNotificationService;
import org.patidar.creationalPattern.factoryMethod.notificationSystem.Notification;
import org.patidar.creationalPattern.factoryMethod.notificationSystem.NotificationService;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        //TIP Press <shortcut actionId="ShowIntentionActions"/> with your caret at the highlighted text
        // to see how IntelliJ IDEA suggests fixing it.
        System.out.println(String.format("Hello and welcome!"));

        NotificationService service = new EmailNotificationService(); // or SMS/Push
        Notification notif = service.createNotification("NewFollower");
        notif.send("John Doe started following you");

        for (int i = 1; i <= 5; i++) {
            //TIP Press <shortcut actionId="Debug"/> to start debugging your code. We have set one <icon src="AllIcons.Debugger.Db_set_breakpoint"/> breakpoint
            // for you, but you can always add more by pressing <shortcut actionId="ToggleLineBreakpoint"/>.
            System.out.println("i = " + i);
        }
    }
}
