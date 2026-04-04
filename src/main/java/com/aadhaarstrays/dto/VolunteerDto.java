package com.aadhaarstrays.dto;

import com.aadhaarstrays.entity.Volunteer;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

public class VolunteerDto {

    @Data
    public static class VolunteerRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Role is required")
        private String role;

        private String avatar = "🐾";
        private Boolean active = true;

        @NotBlank(message = "Area is required")
        private String area;

        private String email;
        private String phone;
    }

    @Data
    public static class VolunteerResponse {
        private Long id;
        private String name;
        private String role;
        private String avatar;
        private Integer rescueCount;
        private Boolean active;
        private String area;
        private String email;
        private String phone;
        private LocalDateTime createdAt;

        public static VolunteerResponse from(Volunteer v) {
            VolunteerResponse r = new VolunteerResponse();
            r.id = v.getId();
            r.name = v.getName();
            r.role = v.getRole();
            r.avatar = v.getAvatar();
            r.rescueCount = v.getRescueCount();
            r.active = v.getActive();
            r.area = v.getArea();
            r.email = v.getEmail();
            r.phone = v.getPhone();
            r.createdAt = v.getCreatedAt();
            return r;
        }
    }
}
