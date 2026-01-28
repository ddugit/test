package com.example.backend.service;

import com.example.backend.Entity.AiHistoryEntry;
import com.example.backend.Repository.AiHistoryRepository;
import com.example.backend.payload.request.AiQueryRequest;
import com.example.backend.payload.response.AiHistoryItem;
import com.example.backend.payload.response.AiQueryResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.List;
import java.util.Map;


@Service
public class AiQueryService {

    private static final TypeReference<Map<String, Object>> MAP_REF = new TypeReference<>() {};
    private static final TypeReference<List<String>> LIST_STRING_REF = new TypeReference<>() {};

    private final AiModelClient aiModelClient;
    private final AiHistoryRepository aiHistoryRepository;
    private final ObjectMapper objectMapper;

    public AiQueryService(AiModelClient aiModelClient,
                          AiHistoryRepository aiHistoryRepository,
                          ObjectMapper objectMapper) {
        this.aiModelClient = aiModelClient;
        this.aiHistoryRepository = aiHistoryRepository;
        this.objectMapper = objectMapper;
    }

    public AiQueryResponse query(Long userId, AiQueryRequest request) {
        Object ai = aiModelClient.query(request);
        if (ai == null) {
            throw new IllegalStateException("AI service returned empty response");
        }

        if (userId != null) {
            AiHistoryEntry entry = new AiHistoryEntry();
            entry.setUserId(userId);
            entry.setDisease(blankToNull(request.getDisease()));
            entry.setMessage(blankToNull(request.getMessage()));

            try {
                if (request.getSymptoms() != null) {
                    entry.setSymptomsJson(objectMapper.writeValueAsString(request.getSymptoms()));
                }
                entry.setAiResponseJson(objectMapper.writeValueAsString(ai));
            } catch (Exception e) {
                throw new IllegalStateException("Failed to serialize AI request/response", e);
            }

            AiHistoryEntry saved = aiHistoryRepository.save(entry);
            return new AiQueryResponse(saved.getId(), saved.getCreatedAt(), ai);
        } else {
            return new AiQueryResponse(null, null, ai);
        }
    }

    public List<AiHistoryItem> history(Long userId, int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 200));

        return aiHistoryRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, safeLimit))
                .map(e -> new AiHistoryItem(
                        e.getId(),
                        e.getDisease(),
                        parseSymptoms(e.getSymptomsJson()),
                        e.getMessage(),
                        e.getCreatedAt(),
                        parseAi(e.getAiResponseJson())
                ))
                .getContent();
    }

    private List<String> parseSymptoms(String symptomsJson) {
        if (symptomsJson == null || symptomsJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(symptomsJson, LIST_STRING_REF);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private Map<String, Object> parseAi(String aiResponseJson) {
        if (aiResponseJson == null || aiResponseJson.isBlank()) {
            return Collections.emptyMap();
        }
        try {
            return objectMapper.readValue(aiResponseJson, MAP_REF);
        } catch (Exception e) {
            return Map.of("raw", aiResponseJson);
        }
    }

    private static String blankToNull(String s) {
        if (s == null) return null;
        String trimmed = s.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
