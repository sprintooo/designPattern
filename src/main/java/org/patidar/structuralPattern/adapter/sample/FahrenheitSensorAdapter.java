package org.patidar.structuralPattern.adapter.sample;

public class FahrenheitSensorAdapter implements Thermometer {
    private final FahrenheitSensor fahrenheitSensor;

    public FahrenheitSensorAdapter(FahrenheitSensor fahrenheitSensor) {
        this.fahrenheitSensor = fahrenheitSensor;
    }

    @Override
    public double getCelsius() {
        return (fahrenheitSensor.readFahrenheit() - 32) * 5 / 9;
    }
}
