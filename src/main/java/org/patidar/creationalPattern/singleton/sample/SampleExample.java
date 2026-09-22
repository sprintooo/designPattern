package org.patidar.creationalPattern.singleton.sample;

/**
 * {@code Singleton Pattern} is a {@code creational} design pattern that guarantees a class has only one instance and provides a global point of access to it.
 *
 * <p>
 * {@code Singleton} implementation varies across languages. The central challenge is thread safety: if two threads call {@code getInstance()} simultaneously when the instance has not been created yet, both might create separate instances.
 */

public class SampleExample{
    LazySingleton lazySingleton = LazySingleton.getInstance();
    DoubleCheckedSingleton doubleCheckedSingleton = DoubleCheckedSingleton.getInstance();
    ThreadSafeSingleton threadSafeSingleton = ThreadSafeSingleton.getInstance();
}


