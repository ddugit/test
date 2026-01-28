package com.example.backend.Controller;

import com.example.backend.Entity.Disease;
import com.example.backend.Repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private DiseaseRepository diseaseRepository;

    @PostMapping("/disease")
    public ResponseEntity<?> addDisease(@RequestBody Disease disease) {
        return ResponseEntity.ok(diseaseRepository.save(disease));
    }
}
