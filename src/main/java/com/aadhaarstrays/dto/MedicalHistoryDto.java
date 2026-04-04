package com.aadhaarstrays.dto;

import com.aadhaarstrays.entity.MedicalHistory;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

public class MedicalHistoryDto {

    @Data
    public static class HistoryRequest {
        @NotBlank(message = "Event description is required")
        private String event;

        private LocalDate eventDate;

        private String performedBy;
    }

    @Data
    public static class HistoryResponse {
        private Long id;
        private String event;
        private LocalDate eventDate;
        private String performedBy;

        public static HistoryResponse from(MedicalHistory h) {
            HistoryResponse r = new HistoryResponse();
            r.id = h.getId();
            r.event = h.getEvent();
            r.eventDate = h.getEventDate();
            r.performedBy = h.getPerformedBy();
            return r;
        }
    }
}
