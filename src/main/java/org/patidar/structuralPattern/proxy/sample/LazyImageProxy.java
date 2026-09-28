package org.patidar.structuralPattern.proxy.sample;

import java.util.Locale;

// Implement the LazyImageProxy class here.
class LazyImageProxy implements ImageResource {
    private final String fileName;
    private RealImage realImage = null;
    private final LoadTracker loadTracker;
    private int disPlayCount;

    public LazyImageProxy(String fileName) {
        this.fileName = fileName;
        loadTracker = new LoadTracker();
        disPlayCount = 0;
    }

    public String preview() {
        return String.format(Locale.US, "Preview: %s", fileName);
    }

    public String display() {
        if (realImage == null) {
            realImage = new RealImage(fileName, loadTracker);
        }
        disPlayCount++;
        return realImage.display();
    }

    public boolean isLoaded() {
        return realImage != null;
    }

    public int loadCount() {
        return loadTracker.count();
    }

    public int displayCount() {
        return disPlayCount;
    }
}
