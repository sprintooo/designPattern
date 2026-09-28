package org.patidar.structuralPattern.proxy.sample;

class RealImage implements ImageResource {
    private final String fileName;

    public RealImage(String fileName, LoadTracker tracker) {
        this.fileName = fileName;
        tracker.recordLoad();
    }

    @Override
    public String display() {
        return "Displaying " + fileName;
    }
}
