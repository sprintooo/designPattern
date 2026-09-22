package org.patidar.creationalPattern.singleton;

/**
 * {@code Singleton Pattern} is a {@code creational} design pattern that guarantees a class has only one instance and provides a global point of access to it.
 *
 * <p>
 * {@code Singleton} implementation varies across languages. The central challenge is thread safety: if two threads call {@code getInstance()} simultaneously when the instance has not been created yet, both might create separate instances.
 */

public class SampleExample{
}

class LazySingleton {
    private static LazySingleton instance;

    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}

class ThreadSafeSingleton {
    private static ThreadSafeSingleton instance;

    public static synchronized ThreadSafeSingleton getInstance() {
        if (instance == null) {
            instance = new ThreadSafeSingleton();
        }
        return instance;
    }
}

class DoubleCheckedSingleton {
    private static volatile DoubleCheckedSingleton instance;

    public static DoubleCheckedSingleton getInstance() {
        if (instance == null) {
            synchronized (DoubleCheckedSingleton.class) {
                if (instance == null) {
                    instance = new DoubleCheckedSingleton();
                }
            }
        }
        return instance;
    }
}


