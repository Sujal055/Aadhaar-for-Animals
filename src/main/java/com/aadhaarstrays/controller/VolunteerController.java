package com.aadhaarstrays.controller;

import com.aadhaarstrays.dto.ApiResponse;
import com.aadhaarstrays.dto.VolunteerDto;
import com.aadhaarstrays.service.VolunteerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VolunteerDto.VolunteerResponse>>> getAll(
            @RequestParam(required = false) Boolean activeOnly) {
        List<VolunteerDto.VolunteerResponse> result = Boolean.TRUE.equals(activeOnly)
                ? volunteerService.getActiveVolunteers()
                : volunteerService.getAllVolunteers();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VolunteerDto.VolunteerResponse>> create(
            @Valid @RequestBody VolunteerDto.VolunteerRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok("Volunteer added", volunteerService.createVolunteer(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VolunteerDto.VolunteerResponse>> update(
            @PathVariable Long id,
            @RequestBody VolunteerDto.VolunteerRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Volunteer updated", volunteerService.updateVolunteer(id, req)));
    }

    @PatchMapping("/{id}/increment-rescue")
    public ResponseEntity<ApiResponse<VolunteerDto.VolunteerResponse>> incrementRescue(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Rescue count updated", volunteerService.incrementRescueCount(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        volunteerService.deleteVolunteer(id);
        return ResponseEntity.ok(ApiResponse.ok("Volunteer deleted", null));
    }
}
