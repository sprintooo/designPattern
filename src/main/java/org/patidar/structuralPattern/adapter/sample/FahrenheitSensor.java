package org.patidar.structuralPattern.adapter.sample;

class FahrenheitSensor {
    private final double fahrenheit;

    FahrenheitSensor(double fahrenheit) {
        this.fahrenheit = fahrenheit;
    }

    public double readFahrenheit() {
        return fahrenheit;
    }
}
