package com.aadhaarstrays.controller;

import com.aadhaarstrays.dto.AnimalDto;
import com.aadhaarstrays.dto.ApiResponse;
import com.aadhaarstrays.dto.MedicalHistoryDto;
import com.aadhaarstrays.service.AnimalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    // GET all animals
    @GetMapping
    public ResponseEntity<ApiResponse<List<AnimalDto.AnimalResponse>>> getAllAnimals(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {

        List<AnimalDto.AnimalResponse> result;
        if (search != null && !search.isBlank()) {
            result = animalService.search(search);
        } else if (type != null && !type.equals("All")) {
            result = animalService.getByType(type);
        } else {
            result = animalService.getAllAnimals();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    // GET by AASA ID
    @GetMapping("/{animalId}")
    public ResponseEntity<ApiResponse<AnimalDto.AnimalResponse>> getAnimal(
            @PathVariable String animalId) {
        return ResponseEntity.ok(ApiResponse.ok(animalService.getByAnimalId(animalId)));
    }

    // POST - register new animal (public: guest can register)
    @PostMapping
    public ResponseEntity<ApiResponse<AnimalDto.AnimalResponse>> createAnimal(
            @Valid @RequestBody AnimalDto.AnimalRequest req) {
        AnimalDto.AnimalResponse res = animalService.createAnimal(req);
        return ResponseEntity.status(201).body(ApiResponse.ok("Animal registered successfully", res));
    }

    // PUT - update animal record
    @PutMapping("/{animalId}")
    public ResponseEntity<ApiResponse<AnimalDto.AnimalResponse>> updateAnimal(
            @PathVariable String animalId,
            @RequestBody AnimalDto.AnimalRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Animal updated", animalService.updateAnimal(animalId, req)));
    }

    // POST - add medical history entry
    @PostMapping("/{animalId}/history")
    public ResponseEntity<ApiResponse<AnimalDto.AnimalResponse>> addHistory(
            @PathVariable String animalId,
            @Valid @RequestBody MedicalHistoryDto.HistoryRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("History added", animalService.addMedicalHistory(animalId, req)));
    }

    // POST - upload photo
    @PostMapping("/{animalId}/photo")
    public ResponseEntity<ApiResponse<String>> uploadPhoto(
            @PathVariable String animalId,
            @RequestParam("file") MultipartFile file) throws IOException {

        // Create upload directory if it doesn't exist
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        // Save file with unique name
        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf("."));
        }
        String filename = animalId + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path path = Paths.get(uploadDir, filename);
        Files.write(path, file.getBytes());

        String photoUrl = "/uploads/" + filename;
        animalService.updatePhotoUrl(animalId, photoUrl);

        return ResponseEntity.ok(ApiResponse.ok("Photo uploaded", photoUrl));
    }

    // DELETE
    @DeleteMapping("/{animalId}")
    public ResponseEntity<ApiResponse<Void>> deleteAnimal(@PathVariable String animalId) {
        animalService.deleteAnimal(animalId);
        return ResponseEntity.ok(ApiResponse.ok("Animal record deleted", null));
    }
}
