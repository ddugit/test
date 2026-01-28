package com.example.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;

@Configuration
public class AppConfig {
    // Intentionally empty.
    // Spring Boot auto-configures RestClient.Builder and ObjectMapper with the
    // proper HTTP message converters + Jackson modules. Defining our own beans
    // here can break JSON serialization (e.g., sending empty bodies to FastAPI).

    /**
     * Spring Boot 4.x may not provide a RestClient.Builder bean by default in some setups.
     * We provide one and ensure Jackson JSON serialization is configured for request bodies.
     */
    @Bean
    public ObjectMapper objectMapper() {
        // Build directly (some environments don't auto-register Jackson2ObjectMapperBuilder as a bean)
        // and auto-register common modules (e.g., Java time).
        return new ObjectMapper().findAndRegisterModules();
    }

    @Bean
    public RestClient.Builder restClientBuilder(ObjectMapper objectMapper) {
        // Force HTTP/1.1 so Uvicorn doesn't see an h2c "Upgrade" request (which causes 422/missing body).
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        return RestClient.builder()
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .messageConverters(converters -> {
                    // Ensure we have a Jackson converter wired to the application's ObjectMapper
                    converters.removeIf(c -> c instanceof MappingJackson2HttpMessageConverter);
                    converters.add(0, new MappingJackson2HttpMessageConverter(objectMapper));
                });
    }
}
