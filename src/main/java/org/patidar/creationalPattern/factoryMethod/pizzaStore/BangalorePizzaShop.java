package org.patidar.creationalPattern.factoryMethod.pizzaStore;

public class BangalorePizzaShop extends PizzaShop {
    @Override
    Pizza createPizza() {
        return new VeggiePizza();
    }
}
