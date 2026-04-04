package com.aadhaarstrays.dto;

import com.aadhaarstrays.entity.Animal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AnimalDto {

    @Data
    public static class AnimalRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotNull(message = "Type is required")
        private String type;         // Dog | Cat | Cow | Other

        private String breed;

        @NotBlank(message = "Area is required")
        private String area;

        private Boolean vaccinated = false;
        private Boolean sterilized = false;
        private String status = "stable";  // stable | moderate | critical
        private String contactPerson;
        private String notes;
        private Double latitude;
        private Double longitude;
        private String registeredBy;
    }

    @Data
    public static class AnimalResponse {
        private Long id;
        private String animalId;
        private String name;
        private String type;
        private String breed;
        private String area;
        private Boolean vaccinated;
        private Boolean sterilized;
        private String status;
        private LocalDate registrationDate;
        private String contactPerson;
        private String notes;
        private Double latitude;
        private Double longitude;
        private String photoUrl;
        private String registeredBy;
        private LocalDateTime createdAt;
        private List<MedicalHistoryDto.HistoryResponse> history;

        public static AnimalResponse from(Animal a, List<MedicalHistoryDto.HistoryResponse> history) {
            AnimalResponse r = new AnimalResponse();
            r.id = a.getId();
            r.animalId = a.getAnimalId();
            r.name = a.getName();
            r.type = a.getType().name();
            r.breed = a.getBreed();
            r.area = a.getArea();
            r.vaccinated = a.getVaccinated();
            r.sterilized = a.getSterilized();
            r.status = a.getStatus().name();
            r.registrationDate = a.getRegistrationDate();
            r.contactPerson = a.getContactPerson();
            r.notes = a.getNotes();
            r.latitude = a.getLatitude();
            r.longitude = a.getLongitude();
            r.photoUrl = a.getPhotoUrl();
            r.registeredBy = a.getRegisteredBy();
            r.createdAt = a.getCreatedAt();
            r.history = history;
            return r;
        }
    }
}
