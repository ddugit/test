package com.example.backend.Controller;

import com.example.backend.payload.request.AiQueryRequest;
import com.example.backend.security.services.UserDetailsImpl;
import com.example.backend.service.AiQueryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiQueryService aiQueryService;

    public AiController(AiQueryService aiQueryService) {
        this.aiQueryService = aiQueryService;
    }

    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody AiQueryRequest request) {

        boolean hasDisease = request.getDisease() != null && !request.getDisease().isBlank();
        boolean hasSymptoms = request.getSymptoms() != null && !request.getSymptoms().isEmpty();
        boolean hasMessage = request.getMessage() != null && !request.getMessage().isBlank();

        if (!hasDisease && !hasSymptoms && !hasMessage) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Provide at least one of: disease, symptoms, message"
            ));
        }

        try {
            return ResponseEntity.ok(aiQueryService.query(null, request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                    "error", "Failed to call AI service",
                    "details", e.getMessage() == null ? "unknown" : e.getMessage()
            ));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> history(@AuthenticationPrincipal UserDetailsImpl user,
                                     @RequestParam(defaultValue = "50") int limit) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<?> items = aiQueryService.history(user.getId(), limit);
        return ResponseEntity.ok(items);
    }
}
