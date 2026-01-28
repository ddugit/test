package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type; // e.g., Herb, Modern
    
    @Column(columnDefinition = "TEXT")
    private String usage;

    public Medicine(String name, String type, String usage) {
        this.name = name;
        this.type = type;
        this.usage = usage;
    }
}
