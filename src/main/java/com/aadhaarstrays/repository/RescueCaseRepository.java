package com.aadhaarstrays.repository;

import com.aadhaarstrays.entity.RescueCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface RescueCaseRepository extends JpaRepository<RescueCase, Long> {
    Optional<RescueCase> findByCaseId(String caseId);
    List<RescueCase> findByUrgency(RescueCase.Urgency urgency);
    List<RescueCase> findByOrderByCreatedAtDesc();

    @Query("SELECT MAX(r.caseId) FROM RescueCase r WHERE r.caseId LIKE 'CASE-%'")
    String findMaxCaseId();
}
