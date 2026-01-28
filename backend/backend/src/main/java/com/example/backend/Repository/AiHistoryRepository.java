package com.example.backend.Repository;

import com.example.backend.Entity.AiHistoryEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiHistoryRepository extends JpaRepository<AiHistoryEntry, Long> {
    Page<AiHistoryEntry> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
