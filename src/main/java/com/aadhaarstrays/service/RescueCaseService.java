package com.aadhaarstrays.service;

import com.aadhaarstrays.dto.RescueCaseDto;
import com.aadhaarstrays.entity.Animal;
import com.aadhaarstrays.entity.RescueCase;
import com.aadhaarstrays.exception.BadRequestException;
import com.aadhaarstrays.exception.ResourceNotFoundException;
import com.aadhaarstrays.repository.RescueCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RescueCaseService {

    private final RescueCaseRepository rescueCaseRepository;

    private synchronized String generateCaseId() {
        String maxId = rescueCaseRepository.findMaxCaseId();
        int next = 2481;
        if (maxId != null) {
            try {
                next = Integer.parseInt(maxId.replace("CASE-", "")) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("CASE-%04d", next);
    }

    @Transactional
    public RescueCaseDto.CaseResponse createCase(RescueCaseDto.CaseRequest req) {
        Animal.AnimalType animalType;
        try {
            animalType = Animal.AnimalType.valueOf(req.getAnimalType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid animal type: " + req.getAnimalType());
        }

        RescueCase.Urgency urgency;
        try {
            urgency = RescueCase.Urgency.valueOf(req.getUrgency() != null ? req.getUrgency() : "moderate");
        } catch (IllegalArgumentException e) {
            urgency = RescueCase.Urgency.moderate;
        }

        RescueCase rescueCase = RescueCase.builder()
                .caseId(generateCaseId())
                .title(req.getTitle())
                .area(req.getArea())
                .animalType(animalType)
                .urgency(urgency)
                .reportedBy(req.getReportedBy())
                .currentStep(0)
                .build();

        return RescueCaseDto.CaseResponse.from(rescueCaseRepository.save(rescueCase));
    }

    public List<RescueCaseDto.CaseResponse> getAllCases() {
        return rescueCaseRepository.findByOrderByCreatedAtDesc().stream()
                .map(RescueCaseDto.CaseResponse::from)
                .collect(Collectors.toList());
    }

    public List<RescueCaseDto.CaseResponse> getCasesByUrgency(String urgency) {
        try {
            RescueCase.Urgency u = RescueCase.Urgency.valueOf(urgency);
            return rescueCaseRepository.findByUrgency(u).stream()
                    .map(RescueCaseDto.CaseResponse::from)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid urgency: " + urgency);
        }
    }

    @Transactional
    public RescueCaseDto.CaseResponse advanceCase(String caseId) {
        RescueCase rescueCase = rescueCaseRepository.findByCaseId(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found: " + caseId));

        int maxStep = 4; // 0-4 = 5 steps
        if (rescueCase.getCurrentStep() < maxStep) {
            rescueCase.setCurrentStep(rescueCase.getCurrentStep() + 1);
            rescueCaseRepository.save(rescueCase);
        }
        return RescueCaseDto.CaseResponse.from(rescueCase);
    }

    @Transactional
    public void deleteCase(String caseId) {
        RescueCase rescueCase = rescueCaseRepository.findByCaseId(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found: " + caseId));
        rescueCaseRepository.delete(rescueCase);
    }
}
