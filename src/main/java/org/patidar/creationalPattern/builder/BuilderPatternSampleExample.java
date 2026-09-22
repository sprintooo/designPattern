package org.patidar.creationalPattern.builder;

import java.util.Map;

public class BuilderPatternSampleExample {
    private String url;
    private String method;
    private Map<String, String> headers;
    private Map<String, String> queryParams;
    private String body;
    private int timeout;

    public BuilderPatternSampleExample(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = builder.headers;
        this.queryParams = builder.queryParams;
        this.body = builder.body;
        this.timeout = builder.timeout;
    }

    public static class Builder{
        private String url;
        private String method;
        private Map<String, String> headers;
        private Map<String, String> queryParams;
        private String body;
        private int timeout;

        public Builder setUrl(String url) {
            this.url = url;
            return this;
        }

        public BuilderPatternSampleExample build(){
            return new BuilderPatternSampleExample(this);
        }
    }
}