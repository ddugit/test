package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "diseases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disease {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "disease_symptom_items", joinColumns = @JoinColumn(name = "disease_id"))
    @Column(name = "symptom")
    private List<String> symptoms;

    @ElementCollection
    @CollectionTable(name = "disease_solution_items", joinColumns = @JoinColumn(name = "disease_id"))
    @Column(name = "solution")
    private List<String> solutions;

    @ElementCollection
    @CollectionTable(name = "disease_precaution_items", joinColumns = @JoinColumn(name = "disease_id"))
    @Column(name = "precaution")
    private List<String> precautions;
}
