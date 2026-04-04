package com.aadhaarstrays.repository;

import com.aadhaarstrays.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByOrderByCreatedAtDesc();
    List<Notification> findByReadFalse();
    long countByReadFalse();
}
