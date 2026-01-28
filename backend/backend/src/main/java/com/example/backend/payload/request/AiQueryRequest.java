package com.example.backend.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AiQueryRequest {
    private String disease;
    private List<String> symptoms;
    private String message;
}
