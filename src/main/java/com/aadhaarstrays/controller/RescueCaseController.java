package com.aadhaarstrays.controller;

import com.aadhaarstrays.dto.ApiResponse;
import com.aadhaarstrays.dto.RescueCaseDto;
import com.aadhaarstrays.service.RescueCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rescue-cases")
@RequiredArgsConstructor
public class RescueCaseController {

    private final RescueCaseService rescueCaseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RescueCaseDto.CaseResponse>>> getAllCases(
            @RequestParam(required = false) String urgency) {
        List<RescueCaseDto.CaseResponse> result = (urgency != null && !urgency.equals("All"))
                ? rescueCaseService.getCasesByUrgency(urgency)
                : rescueCaseService.getAllCases();
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RescueCaseDto.CaseResponse>> createCase(
            @Valid @RequestBody RescueCaseDto.CaseRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok("Case created", rescueCaseService.createCase(req)));
    }

    // Advance case to next step (matches frontend "Advance" button)
    @PatchMapping("/{caseId}/advance")
    public ResponseEntity<ApiResponse<RescueCaseDto.CaseResponse>> advanceCase(
            @PathVariable String caseId) {
        return ResponseEntity.ok(ApiResponse.ok("Case advanced", rescueCaseService.advanceCase(caseId)));
    }

    @DeleteMapping("/{caseId}")
    public ResponseEntity<ApiResponse<Void>> deleteCase(@PathVariable String caseId) {
        rescueCaseService.deleteCase(caseId);
        return ResponseEntity.ok(ApiResponse.ok("Case deleted", null));
    }
}
