package com.example.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class AiHistoryItem {
    private Long id;
    private String disease;
    private List<String> symptoms;
    private String message;
    private LocalDateTime createdAt;
    private Map<String, Object> ai;
}
