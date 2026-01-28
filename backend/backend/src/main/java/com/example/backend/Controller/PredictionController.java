package com.example.backend.Controller;

import com.example.backend.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/predict")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping("/disease")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getByDisease(@RequestBody Map<String, String> request) {
        String disease = request.get("disease");
        return ResponseEntity.ok(predictionService.getMedicinesByDisease(disease));
    }

    @PostMapping("/symptoms")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getBySymptoms(@RequestBody Map<String, List<String>> request) {
        List<String> symptoms = request.get("symptoms");
        return ResponseEntity.ok(predictionService.getMedicinesBySymptoms(symptoms));
    }
}
