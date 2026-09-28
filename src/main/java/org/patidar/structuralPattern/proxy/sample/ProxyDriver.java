package org.patidar.structuralPattern.proxy.sample;

// ProxyDriver is pre-implemented for you. Do not modify it.
class ProxyDriver {
    private final LazyImageProxy proxy;

    public ProxyDriver(String fileName) {
        proxy = new LazyImageProxy(fileName);
    }

    public String preview() {
        return proxy.preview();
    }

    public String display() {
        return proxy.display();
    }

    public boolean isLoaded() {
        return proxy.isLoaded();
    }

    public int loadCount() {
        return proxy.loadCount();
    }

    public int displayCount() {
        return proxy.displayCount();
    }
}
