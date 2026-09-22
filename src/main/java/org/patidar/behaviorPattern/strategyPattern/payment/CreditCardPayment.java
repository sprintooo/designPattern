package org.patidar.behaviorPattern.strategyPattern.payment;

public class CreditCardPayment implements PaymentProcessor {
    @Override
    public void makePayment(int amount) {
        System.out.println("Paid " + amount + " using Credit Card");
    }
}
