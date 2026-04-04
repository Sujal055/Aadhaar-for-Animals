package com.aadhaarstrays.repository;

import com.aadhaarstrays.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    List<MedicalHistory> findByAnimalIdOrderByEventDateDesc(Long animalId);
}
