package com.example.backend.config;

import com.example.backend.Entity.Disease;
import com.example.backend.Repository.DiseaseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(DiseaseRepository diseaseRepository) {
        return args -> {
            if (diseaseRepository.count() == 0) {
                Disease cold = new Disease();
                cold.setName("Common Cold");
                cold.setDescription("A viral infection of your nose and throat (upper respiratory tract).");
                cold.setSymptoms(List.of("Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches or a mild headache", "Sneezing", "Low-grade fever"));
                cold.setSolutions(List.of("Stay hydrated (water, juice, warm lemon water)", "Rest", "Soothe a sore throat (salt water gargle)", "Combat stuffiness (saline drops)", "Relieve pain (OTC pain relievers)"));
                cold.setPrecautions(List.of("Wash your hands often", "Disinfect your stuff", "Use tissues", "Don't share things", "Steer clear of colds"));

                Disease migraine = new Disease();
                migraine.setName("Migraine");
                migraine.setDescription("A headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head.");
                migraine.setSymptoms(List.of("Pain on one side of your head", "Pain that pulses or throbs", "Sensitivity to light, sound, and sometimes smell and touch", "Nausea and vomiting"));
                migraine.setSolutions(List.of("Pain relief medications", "Preventive medications", "Rest in a quiet, dark room", "Apply a cold or hot compress to your head or neck", "Massage", "Small amounts of caffeine"));
                migraine.setPrecautions(List.of("Avoid triggers (certain foods, stress)", "Establish a regular sleep schedule", "Eat regular meals", "Stay hydrated", "Manage stress"));

                Disease diabetes = new Disease();
                diabetes.setName("Diabetes (Type 2)");
                diabetes.setDescription("A chronic condition that affects the way the body processes blood sugar (glucose).");
                diabetes.setSymptoms(List.of("Increased thirst", "Frequent urination", "Increased hunger", "Unintended weight loss", "Fatigue", "Blurred vision", "Slow-healing sores", "Frequent infections"));
                diabetes.setSolutions(List.of("Healthy eating", "Regular physical activity", "Weight loss", "Diabetes medication or insulin therapy", "Blood sugar monitoring"));
                diabetes.setPrecautions(List.of("Eat healthy foods", "Get more physical activity", "Lose excess pounds", "Avoid fad diets", "Don't smoke"));

                Disease hypertension = new Disease();
                hypertension.setName("Hypertension (High Blood Pressure)");
                hypertension.setDescription("A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.");
                hypertension.setSymptoms(List.of("Headaches", "Shortness of breath", "Nosebleeds (mostly asymptomatic)", "Flushing", "Dizziness", "Chest pain", "Visual changes"));
                hypertension.setSolutions(List.of("Heart-healthy diet with less salt", "Regular physical activity", "Maintaining a healthy weight", "Limiting alcohol", "Not smoking", "Managing stress"));
                hypertension.setPrecautions(List.of("Eat a healthy diet", "Keep a healthy weight", "Be physically active", "Don't smoke", "Limit alcohol", "Get enough sleep"));

                diseaseRepository.saveAll(List.of(cold, migraine, diabetes, hypertension));
                System.out.println("Diseases seeded");
            }
        };
    }
}
