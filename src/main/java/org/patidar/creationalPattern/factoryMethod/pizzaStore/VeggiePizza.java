package org.patidar.creationalPattern.factoryMethod.pizzaStore;

class VeggiePizza implements Pizza {
    @Override
    public void prepare() {
        System.out.println("Preparing Veggie Pizza");
    }

    @Override
    public void bake() {
        System.out.println("Baking Veggie Pizza");
    }
}