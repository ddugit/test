package com.example.backend.Repository;

import com.example.backend.Entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.query.Param;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    List<Disease> findByNameContainingIgnoreCase(String name);
    
    Optional<Disease> findByName(String name);

    @Query("SELECT d FROM Disease d JOIN d.symptoms s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :symptom, '%'))")
    List<Disease> findBySymptomContaining(@Param("symptom") String symptom);
}
