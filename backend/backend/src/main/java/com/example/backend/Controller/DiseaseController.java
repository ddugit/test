package com.example.backend.Controller;

import com.example.backend.Entity.Disease;
import com.example.backend.service.DiseaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/diseases")
public class DiseaseController {

    @Autowired
    private DiseaseService diseaseService;

    @GetMapping
    @Transactional
    public ResponseEntity<List<Disease>> getAllDiseases() {
        return ResponseEntity.ok(diseaseService.getAllDiseases());
    }

    @GetMapping("/search")
    @Transactional
    public ResponseEntity<List<Disease>> searchDiseases(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String symptom) {
        return ResponseEntity.ok(diseaseService.searchDiseases(name, symptom));
    }
}
