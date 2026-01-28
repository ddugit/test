package com.example.backend.service;

import com.example.backend.Entity.Disease;
import com.example.backend.Repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    @Autowired
    private DiseaseRepository diseaseRepository;

    public Map<String, Object> getMedicinesByDisease(String diseaseName) {
        Map<String, Object> response = new HashMap<>();
        Optional<Disease> diseaseOpt = diseaseRepository.findByName(diseaseName);

        if (diseaseOpt.isPresent()) {
            Disease disease = diseaseOpt.get();
            response.put("disease", disease.getName());
            response.put("description", disease.getDescription());
            response.put("medicines", disease.getSolutions()); // Mapping solutions as medicines
            response.put("symptoms", disease.getSymptoms());
        } else {
            // Try partial match if exact match fails
            List<Disease> diseases = diseaseRepository.findByNameContainingIgnoreCase(diseaseName);
            if (!diseases.isEmpty()) {
                Disease disease = diseases.get(0);
                response.put("disease", disease.getName());
                response.put("description", disease.getDescription());
                response.put("medicines", disease.getSolutions());
                response.put("symptoms", disease.getSymptoms());
                response.put("note", "Exact match not found, showing result for: " + disease.getName());
            } else {
                response.put("error", "Disease not found");
            }
        }
        return response;
    }

    public Map<String, Object> getMedicinesBySymptoms(List<String> symptomNames) {
        Map<String, Object> response = new HashMap<>();
        Set<Disease> matchedDiseases = new HashSet<>();

        for (String sName : symptomNames) {
            List<Disease> found = diseaseRepository.findBySymptomContaining(sName);
            matchedDiseases.addAll(found);
        }

        if (matchedDiseases.isEmpty()) {
            response.put("error", "No diseases found matching these symptoms");
        } else {
            // Group solutions from all matched diseases
            Set<String> allSolutions = matchedDiseases.stream()
                    .flatMap(d -> d.getSolutions().stream())
                    .collect(Collectors.toSet());
            
            List<String> diseaseNames = matchedDiseases.stream()
                    .map(Disease::getName)
                    .collect(Collectors.toList());

            response.put("possible_diseases", diseaseNames);
            response.put("recommended_medicines", allSolutions);
        }
        
        return response;
    }
}
