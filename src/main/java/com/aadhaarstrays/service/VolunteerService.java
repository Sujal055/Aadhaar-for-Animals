package com.aadhaarstrays.service;

import com.aadhaarstrays.dto.VolunteerDto;
import com.aadhaarstrays.entity.Volunteer;
import com.aadhaarstrays.exception.ResourceNotFoundException;
import com.aadhaarstrays.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    @Transactional
    public VolunteerDto.VolunteerResponse createVolunteer(VolunteerDto.VolunteerRequest req) {
        Volunteer v = Volunteer.builder()
                .name(req.getName())
                .role(req.getRole())
                .avatar(req.getAvatar() != null ? req.getAvatar() : "🐾")
                .active(req.getActive() != null ? req.getActive() : true)
                .area(req.getArea())
                .email(req.getEmail())
                .phone(req.getPhone())
                .rescueCount(0)
                .build();
        return VolunteerDto.VolunteerResponse.from(volunteerRepository.save(v));
    }

    public List<VolunteerDto.VolunteerResponse> getAllVolunteers() {
        return volunteerRepository.findAll().stream()
                .map(VolunteerDto.VolunteerResponse::from)
                .collect(Collectors.toList());
    }

    public List<VolunteerDto.VolunteerResponse> getActiveVolunteers() {
        return volunteerRepository.findByActive(true).stream()
                .map(VolunteerDto.VolunteerResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public VolunteerDto.VolunteerResponse updateVolunteer(Long id, VolunteerDto.VolunteerRequest req) {
        Volunteer v = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found: " + id));
        if (req.getName() != null) v.setName(req.getName());
        if (req.getRole() != null) v.setRole(req.getRole());
        if (req.getAvatar() != null) v.setAvatar(req.getAvatar());
        if (req.getActive() != null) v.setActive(req.getActive());
        if (req.getArea() != null) v.setArea(req.getArea());
        if (req.getEmail() != null) v.setEmail(req.getEmail());
        if (req.getPhone() != null) v.setPhone(req.getPhone());
        return VolunteerDto.VolunteerResponse.from(volunteerRepository.save(v));
    }

    @Transactional
    public VolunteerDto.VolunteerResponse incrementRescueCount(Long id) {
        Volunteer v = volunteerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Volunteer not found: " + id));
        v.setRescueCount(v.getRescueCount() + 1);
        return VolunteerDto.VolunteerResponse.from(volunteerRepository.save(v));
    }

    @Transactional
    public void deleteVolunteer(Long id) {
        if (!volunteerRepository.existsById(id))
            throw new ResourceNotFoundException("Volunteer not found: " + id);
        volunteerRepository.deleteById(id);
    }
}
