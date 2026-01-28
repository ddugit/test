package com.example.backend.service;

import com.example.backend.payload.request.AiQueryRequest;

import java.util.Map;

public interface AiModelClient {
    Object query(AiQueryRequest request);
}
