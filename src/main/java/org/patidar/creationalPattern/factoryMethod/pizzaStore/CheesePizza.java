package org.patidar.creationalPattern.factoryMethod.pizzaStore;

class CheesePizza implements Pizza {
    @Override
    public void prepare() {
        System.out.println("Preparing Cheese Pizza");
    }

    @Override
    public void bake() {
        System.out.println("Baking Cheese Pizza");
    }
}
