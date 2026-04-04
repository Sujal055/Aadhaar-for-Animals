package com.aadhaarstrays.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "animals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "animal_id", unique = true, nullable = false, length = 20)
    private String animalId;          // e.g. AASA-0007

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AnimalType type;

    @Column(length = 100)
    private String breed;

    @Column(nullable = false, length = 100)
    private String area;

    @Column(nullable = false)
    @Builder.Default
    private Boolean vaccinated = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean sterilized = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AnimalStatus status = AnimalStatus.stable;

    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "registered_by", length = 100)
    private String registeredBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MedicalHistory> medicalHistory = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (registrationDate == null) registrationDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AnimalType {
        Dog, Cat, Cow, Other
    }

    public enum AnimalStatus {
        stable, moderate, critical
    }
}
