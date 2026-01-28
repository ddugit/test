package com.example.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@AllArgsConstructor
public class AiQueryResponse {
    private Long historyId;
    private LocalDateTime createdAt;
    private Object ai;
}
