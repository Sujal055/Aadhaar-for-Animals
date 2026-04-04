package com.aadhaarstrays.dto;

import com.aadhaarstrays.entity.RescueCase;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class RescueCaseDto {

    @Data
    public static class CaseRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Area is required")
        private String area;

        @NotNull(message = "Animal type is required")
        private String animalType;

        private String urgency = "moderate";
        private String reportedBy;
    }

    @Data
    public static class CaseResponse {
        private Long id;
        private String caseId;
        private String title;
        private String area;
        private String animalType;
        private String urgency;
        private String reportedBy;
        private Integer currentStep;
        private List<String> steps;
        private LocalDateTime createdAt;
        private String timeAgo;

        public static CaseResponse from(RescueCase c) {
            CaseResponse r = new CaseResponse();
            r.id = c.getId();
            r.caseId = c.getCaseId();
            r.title = c.getTitle();
            r.area = c.getArea();
            r.animalType = c.getAnimalType().name();
            r.urgency = c.getUrgency().name();
            r.reportedBy = c.getReportedBy();
            r.currentStep = c.getCurrentStep();
            r.steps = List.of("Reported", "Assigned", "Rescued", "Care", "Released");
            r.createdAt = c.getCreatedAt();
            r.timeAgo = formatTimeAgo(c.getCreatedAt());
            return r;
        }

        private static String formatTimeAgo(LocalDateTime dt) {
            if (dt == null) return "";
            long minutes = java.time.Duration.between(dt, LocalDateTime.now()).toMinutes();
            if (minutes < 60) return minutes + "m ago";
            long hours = minutes / 60;
            if (hours < 24) return hours + "h ago";
            return (hours / 24) + "d ago";
        }
    }
}
