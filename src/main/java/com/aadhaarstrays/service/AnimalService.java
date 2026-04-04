package com.aadhaarstrays.service;

import com.aadhaarstrays.dto.AnimalDto;
import com.aadhaarstrays.dto.MedicalHistoryDto;
import com.aadhaarstrays.entity.Animal;
import com.aadhaarstrays.entity.MedicalHistory;
import com.aadhaarstrays.exception.BadRequestException;
import com.aadhaarstrays.exception.ResourceNotFoundException;
import com.aadhaarstrays.repository.AnimalRepository;
import com.aadhaarstrays.repository.MedicalHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;

    // ─── Generate next AASA ID ────────────────────────────────────────────────
    private synchronized String generateAnimalId() {
        String maxId = animalRepository.findMaxAnimalId();
        int next = 1;
        if (maxId != null) {
            try {
                next = Integer.parseInt(maxId.replace("AASA-", "")) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("AASA-%04d", next);
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────
    @Transactional
    public AnimalDto.AnimalResponse createAnimal(AnimalDto.AnimalRequest req) {
        Animal.AnimalType type;
        try {
            type = Animal.AnimalType.valueOf(req.getType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid animal type: " + req.getType());
        }

        Animal.AnimalStatus status;
        try {
            status = Animal.AnimalStatus.valueOf(req.getStatus() != null ? req.getStatus() : "stable");
        } catch (IllegalArgumentException e) {
            status = Animal.AnimalStatus.stable;
        }

        Animal animal = Animal.builder()
                .animalId(generateAnimalId())
                .name(req.getName())
                .type(type)
                .breed(req.getBreed())
                .area(req.getArea())
                .vaccinated(req.getVaccinated() != null ? req.getVaccinated() : false)
                .sterilized(req.getSterilized() != null ? req.getSterilized() : false)
                .status(status)
                .contactPerson(req.getContactPerson())
                .notes(req.getNotes())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .registeredBy(req.getRegisteredBy())
                .build();

        animal = animalRepository.save(animal);

        // Auto-create initial registration history entry
        MedicalHistory history = MedicalHistory.builder()
                .animal(animal)
                .event("Registered via portal")
                .eventDate(LocalDate.now())
                .performedBy(req.getRegisteredBy() != null ? req.getRegisteredBy() : "System")
                .build();
        medicalHistoryRepository.save(history);

        return buildResponse(animal);
    }

    // ─── READ ALL ─────────────────────────────────────────────────────────────
    public List<AnimalDto.AnimalResponse> getAllAnimals() {
        return animalRepository.findAll().stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ─── READ BY ID ───────────────────────────────────────────────────────────
    public AnimalDto.AnimalResponse getByAnimalId(String animalId) {
        Animal animal = animalRepository.findByAnimalId(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));
        return buildResponse(animal);
    }

    // ─── SEARCH ───────────────────────────────────────────────────────────────
    public List<AnimalDto.AnimalResponse> search(String query) {
        return animalRepository
                .findByNameContainingIgnoreCaseOrAnimalIdContainingIgnoreCaseOrAreaContainingIgnoreCase(
                        query, query, query)
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    // ─── FILTER BY TYPE ───────────────────────────────────────────────────────
    public List<AnimalDto.AnimalResponse> getByType(String type) {
        try {
            Animal.AnimalType t = Animal.AnimalType.valueOf(type);
            return animalRepository.findByType(t).stream()
                    .map(this::buildResponse).collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid type: " + type);
        }
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────
    @Transactional
    public AnimalDto.AnimalResponse updateAnimal(String animalId, AnimalDto.AnimalRequest req) {
        Animal animal = animalRepository.findByAnimalId(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));

        if (req.getName() != null) animal.setName(req.getName());
        if (req.getBreed() != null) animal.setBreed(req.getBreed());
        if (req.getArea() != null) animal.setArea(req.getArea());
        if (req.getVaccinated() != null) animal.setVaccinated(req.getVaccinated());
        if (req.getSterilized() != null) animal.setSterilized(req.getSterilized());
        if (req.getContactPerson() != null) animal.setContactPerson(req.getContactPerson());
        if (req.getNotes() != null) animal.setNotes(req.getNotes());
        if (req.getLatitude() != null) animal.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) animal.setLongitude(req.getLongitude());

        if (req.getStatus() != null) {
            try { animal.setStatus(Animal.AnimalStatus.valueOf(req.getStatus())); }
            catch (IllegalArgumentException ignored) {}
        }
        if (req.getType() != null) {
            try { animal.setType(Animal.AnimalType.valueOf(req.getType())); }
            catch (IllegalArgumentException ignored) {}
        }

        // Log the update in history
        MedicalHistory history = MedicalHistory.builder()
                .animal(animal)
                .event("Record updated")
                .eventDate(LocalDate.now())
                .performedBy(req.getRegisteredBy() != null ? req.getRegisteredBy() : "Staff")
                .build();
        medicalHistoryRepository.save(history);

        return buildResponse(animalRepository.save(animal));
    }

    // ─── ADD MEDICAL HISTORY ──────────────────────────────────────────────────
    @Transactional
    public AnimalDto.AnimalResponse addMedicalHistory(String animalId, MedicalHistoryDto.HistoryRequest req) {
        Animal animal = animalRepository.findByAnimalId(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));

        MedicalHistory history = MedicalHistory.builder()
                .animal(animal)
                .event(req.getEvent())
                .eventDate(req.getEventDate() != null ? req.getEventDate() : LocalDate.now())
                .performedBy(req.getPerformedBy())
                .build();
        medicalHistoryRepository.save(history);

        // Auto-update vaccination flag if event mentions vaccination
        String ev = req.getEvent().toLowerCase();
        if (ev.contains("vaccin")) animal.setVaccinated(true);
        if (ev.contains("steril")) animal.setSterilized(true);
        animalRepository.save(animal);

        return buildResponse(animal);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────
    @Transactional
    public void deleteAnimal(String animalId) {
        Animal animal = animalRepository.findByAnimalId(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));
        animalRepository.delete(animal);
    }

    // ─── UPDATE PHOTO URL ─────────────────────────────────────────────────────
    @Transactional
    public void updatePhotoUrl(String animalId, String photoUrl) {
        Animal animal = animalRepository.findByAnimalId(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found: " + animalId));
        animal.setPhotoUrl(photoUrl);
        animalRepository.save(animal);
    }

    // ─── BUILD RESPONSE ───────────────────────────────────────────────────────
    private AnimalDto.AnimalResponse buildResponse(Animal animal) {
        List<MedicalHistoryDto.HistoryResponse> history =
                medicalHistoryRepository.findByAnimalIdOrderByEventDateDesc(animal.getId())
                        .stream().map(MedicalHistoryDto.HistoryResponse::from)
                        .collect(Collectors.toList());
        return AnimalDto.AnimalResponse.from(animal, history);
    }
}
