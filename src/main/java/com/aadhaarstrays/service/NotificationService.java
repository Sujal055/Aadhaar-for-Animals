package com.aadhaarstrays.service;

import com.aadhaarstrays.dto.NotificationDto;
import com.aadhaarstrays.entity.Notification;
import com.aadhaarstrays.exception.ResourceNotFoundException;
import com.aadhaarstrays.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<NotificationDto.NotificationResponse> getAllNotifications() {
        return notificationRepository.findByOrderByCreatedAtDesc().stream()
                .map(NotificationDto.NotificationResponse::from)
                .collect(Collectors.toList());
    }

    public long getUnreadCount() {
        return notificationRepository.countByReadFalse();
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByReadFalse();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public NotificationDto.NotificationResponse createNotification(String icon, String text, String type) {
        Notification n = Notification.builder()
                .icon(icon)
                .text(text)
                .type(type)
                .read(false)
                .build();
        return NotificationDto.NotificationResponse.from(notificationRepository.save(n));
    }
}
