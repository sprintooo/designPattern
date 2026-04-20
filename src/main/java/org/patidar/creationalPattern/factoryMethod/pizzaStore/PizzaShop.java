package org.patidar.creationalPattern.factoryMethod.pizzaStore;


/**
 * PROBLEM
 */

//public class PizzaShop {
//    Pizza orderPizza(String type) {
//        Pizza pizza;
//
//        if (type.equals("cheese")) {
//            pizza = new CheesePizza();
//        } else if (type.equals("pepperoni")) {
//            pizza = new PepperoniPizza();
//        } else if (type.equals("veggie")) {
//            pizza = new VeggiePizza();
//        }
//
//        pizza.prepare();
//        pizza.bake();
//        return pizza;
//    }
//}

/**
 * SOLUTION
 */
public abstract class PizzaShop {
    abstract Pizza createPizza();

    Pizza orderPizza() {
        Pizza pizza = createPizza();
        pizza.prepare();
        pizza.bake();
        return pizza;
    }
}


