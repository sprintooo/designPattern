package org.patidar.structuralPattern.proxy.sample;

class LoadTracker {
    private int loads = 0;

    public void recordLoad() {
        loads++;
    }

    public int count() {
        return loads;
    }
}
