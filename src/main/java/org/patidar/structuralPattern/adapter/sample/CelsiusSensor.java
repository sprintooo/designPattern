package org.patidar.structuralPattern.adapter.sample;

class CelsiusSensor implements Thermometer {
    private final double celsius;

    CelsiusSensor(double celsius) {
        this.celsius = celsius;
    }

    @Override
    public double getCelsius() {
        return celsius;
    }
}
