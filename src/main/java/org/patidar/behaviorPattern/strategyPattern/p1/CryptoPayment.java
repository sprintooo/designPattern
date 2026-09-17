package org.patidar.behaviorPattern.strategyPattern.p1;

public class CryptoPayment implements PaymentProcessor {
    @Override
    public void makePayment(int amount) {
        System.out.println("Processing crypto payment of $" + amount);
    }
}
