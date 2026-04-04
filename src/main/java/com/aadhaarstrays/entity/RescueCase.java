package com.aadhaarstrays.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rescue_cases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RescueCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", unique = true, nullable = false, length = 20)
    private String caseId;            // e.g. CASE-2485

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String area;

    @Enumerated(EnumType.STRING)
    @Column(name = "animal_type", nullable = false, length = 20)
    private Animal.AnimalType animalType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Urgency urgency;

    @Column(name = "reported_by", length = 100)
    private String reportedBy;

    @Column(name = "current_step", nullable = false)
    @Builder.Default
    private Integer currentStep = 0;   // 0=Reported,1=Assigned,2=Rescued,3=Care,4=Released

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Urgency {
        critical, moderate, stable
    }
}
