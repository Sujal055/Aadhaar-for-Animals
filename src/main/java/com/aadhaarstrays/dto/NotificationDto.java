package com.aadhaarstrays.dto;

import com.aadhaarstrays.entity.Notification;
import lombok.Data;
import java.time.LocalDateTime;

public class NotificationDto {

    @Data
    public static class NotificationResponse {
        private Long id;
        private String icon;
        private String text;
        private String type;
        private Boolean read;
        private String timeAgo;
        private LocalDateTime createdAt;

        public static NotificationResponse from(Notification n) {
            NotificationResponse r = new NotificationResponse();
            r.id = n.getId();
            r.icon = n.getIcon();
            r.text = n.getText();
            r.type = n.getType();
            r.read = n.getRead();
            r.createdAt = n.getCreatedAt();
            r.timeAgo = formatTimeAgo(n.getCreatedAt());
            return r;
        }

        private static String formatTimeAgo(LocalDateTime dt) {
            if (dt == null) return "";
            long minutes = java.time.Duration.between(dt, LocalDateTime.now()).toMinutes();
            if (minutes < 1) return "Just now";
            if (minutes < 60) return minutes + " min ago";
            long hours = minutes / 60;
            if (hours < 24) return hours + "h ago";
            return (hours / 24) + "d ago";
        }
    }
}
