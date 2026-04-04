package com.aadhaarstrays.repository;

import com.aadhaarstrays.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    List<Volunteer> findByActive(Boolean active);
    List<Volunteer> findByAreaContainingIgnoreCase(String area);
}
