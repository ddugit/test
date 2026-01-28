package com.example.backend.service;

import com.example.backend.payload.request.AiQueryRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class HttpAiModelClient implements AiModelClient {

    private static final ParameterizedTypeReference<Object> OBJECT_TYPE =
            new ParameterizedTypeReference<>() {};

    private final RestClient restClient;
    private final String predictPath;

    public HttpAiModelClient(RestClient.Builder builder,
                             @Value("${ai.base-url:http://localhost:8000}") String baseUrl,
                             @Value("${ai.predict-path:/predict}") String predictPath) {
        this.restClient = builder.baseUrl(baseUrl).build();
        this.predictPath = predictPath;
    }

    @Override
    public Object query(AiQueryRequest request) {
        // Try to call the external AI service, but fallback to default if it fails
        try {
            Map<String, Object> body = new HashMap<>();
            if (request.getDisease() != null && !request.getDisease().isBlank()) {
                body.put("disease", request.getDisease());
                // Some model services use this key name
                body.put("disease_name", request.getDisease());
            }
            if (request.getSymptoms() != null && !request.getSymptoms().isEmpty()) {
                body.put("symptoms", String.join(", ", request.getSymptoms()));
            }

            Object response = restClient.post()
                    .uri(predictPath)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(OBJECT_TYPE);

            if (response instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) response;
                if (map.containsKey("output")) {
                    return map.get("output");
                }
            }
            return response;
        } catch (Exception e) {
            // Return an error object (so frontend shows error, not a fake "answer")
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to call AI service");
            errorResponse.put("details", e.getMessage() == null ? "unknown" : e.getMessage());
            errorResponse.put("request_id", UUID.randomUUID().toString());
            return errorResponse;
        }
    }
}
