package com.example.backend.service;

import com.example.backend.Entity.Disease;
import com.example.backend.Repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DiseaseService {
    @Autowired
    private DiseaseRepository diseaseRepository;

    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

    public List<Disease> searchDiseases(String nameQuery, String symptomQuery) {
        List<Disease> byName = List.of();
        List<Disease> bySymptom = List.of();

        if (nameQuery != null && !nameQuery.isBlank()) {
            byName = diseaseRepository.findByNameContainingIgnoreCase(nameQuery);
        }

        if (symptomQuery != null && !symptomQuery.isBlank()) {
            bySymptom = diseaseRepository.findBySymptomContaining(symptomQuery);
        }

        if (nameQuery != null && !nameQuery.isBlank() && symptomQuery != null && !symptomQuery.isBlank()) {
            // Intersection
            Set<Long> symptomIds = bySymptom.stream().map(Disease::getId).collect(Collectors.toSet());
            return byName.stream().filter(d -> symptomIds.contains(d.getId())).collect(Collectors.toList());
        } else if (nameQuery != null && !nameQuery.isBlank()) {
            return byName;
        } else if (symptomQuery != null && !symptomQuery.isBlank()) {
            return bySymptom;
        } else {
            return getAllDiseases();
        }
    }
}
