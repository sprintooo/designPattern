package org.patidar.behaviorPattern.strategyPattern.p1;

public class CreditCardPayment implements PaymentProcessor {
    @Override
    public void makePayment(int amount) {
        System.out.println("Paid " + amount + " using Credit Card");
    }
}
