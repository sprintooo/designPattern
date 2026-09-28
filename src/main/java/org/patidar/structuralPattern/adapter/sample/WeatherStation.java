package org.patidar.structuralPattern.adapter.sample;

import java.util.ArrayList;
import java.util.List;

class WeatherStation {
    private final List<Thermometer> sensors = new ArrayList<>();

    public WeatherStation() {
    }

    public int addCelsiusSensor(double celsius) {
        sensors.add(new CelsiusSensor(celsius));
        return sensors.size() - 1;
    }

    public int addFahrenheitSensor(double fahrenheit) {
        sensors.add(new FahrenheitSensorAdapter(new FahrenheitSensor(fahrenheit)));
        return sensors.size() - 1;
    }

    public double readCelsius(int index) {
        if (index < 0 || index >= sensors.size()) {
            return -1000.0;
        }
        return sensors.get(index).getCelsius();
    }

    public String reading(int index) {
        if (index < 0 || index >= sensors.size()) {
            return "UNKNOWN";
        }
        return String.format(java.util.Locale.US, "%.1f C", sensors.get(index).getCelsius());
    }

    public String warmest() {
        if (sensors.isEmpty()) {
            return "NONE";
        }
        int best = 0;
        for (int i = 1; i < sensors.size(); i++) {
            if (sensors.get(i).getCelsius() > sensors.get(best).getCelsius()) {
                best = i;
            }
        }
        return reading(best);
    }

    public int sensorCount() {
        return sensors.size();
    }
}
