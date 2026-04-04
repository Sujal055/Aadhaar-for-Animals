package com.aadhaarstrays.config;

import com.aadhaarstrays.entity.*;
import com.aadhaarstrays.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;
    private final RescueCaseRepository rescueCaseRepository;
    private final VolunteerRepository volunteerRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (animalRepository.count() == 0) {
            seedAnimals();
        }
        if (rescueCaseRepository.count() == 0) {
            seedRescueCases();
        }
        if (volunteerRepository.count() == 0) {
            seedVolunteers();
        }
        if (notificationRepository.count() == 0) {
            seedNotifications();
        }
        log.info("✅ Aadhaar for Strays — database seeded successfully!");
    }

    // ─── USERS ────────────────────────────────────────────────────────────────
    private void seedUsers() {
        List<User> users = List.of(
            User.builder().name("Admin User").email("admin@aadhaarstrays.gov.in")
                .password(passwordEncoder.encode("admin123")).role(User.Role.admin).build(),
            User.builder().name("Dr. Patil").email("vet@aadhaarstrays.gov.in")
                .password(passwordEncoder.encode("vet123")).role(User.Role.vet).build(),
            User.builder().name("PawCare NGO").email("ngo@aadhaarstrays.gov.in")
                .password(passwordEncoder.encode("ngo123")).role(User.Role.ngo).build(),
            User.builder().name("Citizen Reporter").email("citizen@aadhaarstrays.gov.in")
                .password(passwordEncoder.encode("citizen123")).role(User.Role.citizen).build()
        );
        userRepository.saveAll(users);
        log.info("Seeded {} users", users.size());
    }

    // ─── ANIMALS (matches frontend initialAnimals) ────────────────────────────
    private void seedAnimals() {
        // Tommy
        Animal tommy = Animal.builder()
                .animalId("AASA-0001").name("Tommy").type(Animal.AnimalType.Dog)
                .breed("Indie").area("Sangli Ward 3").vaccinated(true).sterilized(true)
                .status(Animal.AnimalStatus.stable).registrationDate(LocalDate.of(2025, 1, 12))
                .contactPerson("Dr. Patil").notes("Friendly, well-behaved. Regular feeder nearby.")
                .latitude(16.8624).longitude(74.5715).registeredBy("Dr. Patil").build();
        tommy = animalRepository.save(tommy);
        medicalHistoryRepository.saveAll(List.of(
            MedicalHistory.builder().animal(tommy).event("Registered").eventDate(LocalDate.of(2025,1,12)).performedBy("Dr. Patil").build(),
            MedicalHistory.builder().animal(tommy).event("Vaccinated (Rabies + 5-in-1)").eventDate(LocalDate.of(2025,1,15)).performedBy("Govt Vet").build(),
            MedicalHistory.builder().animal(tommy).event("Sterilized").eventDate(LocalDate.of(2025,1,20)).performedBy("PawCare NGO").build()
        ));

        // Kaali
        Animal kaali = Animal.builder()
                .animalId("AASA-0002").name("Kaali").type(Animal.AnimalType.Dog)
                .breed("Lab Mix").area("Miraj").vaccinated(false).sterilized(false)
                .status(Animal.AnimalStatus.critical).registrationDate(LocalDate.of(2025, 2, 1))
                .contactPerson("NGO PawCare").notes("Found injured near highway. Leg wound.")
                .latitude(16.8234).longitude(74.6112).registeredBy("PawCare NGO").build();
        kaali = animalRepository.save(kaali);
        medicalHistoryRepository.saveAll(List.of(
            MedicalHistory.builder().animal(kaali).event("Reported by citizen").eventDate(LocalDate.of(2025,2,1)).performedBy("Rahul K.").build(),
            MedicalHistory.builder().animal(kaali).event("Rescue team dispatched").eventDate(LocalDate.of(2025,2,2)).performedBy("PawCare NGO").build()
        ));

        // Nandi
        Animal nandi = Animal.builder()
                .animalId("AASA-0003").name("Nandi").type(Animal.AnimalType.Cow)
                .breed("Desi").area("Kupwad").vaccinated(true).sterilized(false)
                .status(Animal.AnimalStatus.moderate).registrationDate(LocalDate.of(2025, 1, 28))
                .contactPerson("Muni Vet").notes("Malnourished. Being monitored.")
                .latitude(16.9012).longitude(74.5234).registeredBy("Muni Vet").build();
        nandi = animalRepository.save(nandi);
        medicalHistoryRepository.saveAll(List.of(
            MedicalHistory.builder().animal(nandi).event("Registered").eventDate(LocalDate.of(2025,1,28)).performedBy("Muni Vet").build(),
            MedicalHistory.builder().animal(nandi).event("FMD Vaccination done").eventDate(LocalDate.of(2025,2,5)).performedBy("Govt Vet").build()
        ));

        // Bruno
        Animal bruno = Animal.builder()
                .animalId("AASA-0004").name("Bruno").type(Animal.AnimalType.Dog)
                .breed("Shepherd Mix").area("Sangli Ward 7").vaccinated(true).sterilized(true)
                .status(Animal.AnimalStatus.stable).registrationDate(LocalDate.of(2025, 2, 15))
                .contactPerson("Dr. Joshi").notes("Collar with ID tag. Regular monitoring.")
                .latitude(16.8724).longitude(74.5915).registeredBy("Dr. Joshi").build();
        bruno = animalRepository.save(bruno);
        medicalHistoryRepository.saveAll(List.of(
            MedicalHistory.builder().animal(bruno).event("Registered").eventDate(LocalDate.of(2025,2,15)).performedBy("Dr. Joshi").build(),
            MedicalHistory.builder().animal(bruno).event("Full vaccination done").eventDate(LocalDate.of(2025,2,16)).performedBy("Dr. Joshi").build()
        ));

        // Ganga
        Animal ganga = Animal.builder()
                .animalId("AASA-0005").name("Ganga").type(Animal.AnimalType.Cow)
                .breed("HF Cross").area("Islampur").vaccinated(false).sterilized(false)
                .status(Animal.AnimalStatus.moderate).registrationDate(LocalDate.of(2025, 2, 20))
                .contactPerson("Animal Seva").notes("Roaming near school area.")
                .latitude(17.0512).longitude(74.5634).registeredBy("Animal Seva").build();
        ganga = animalRepository.save(ganga);
        medicalHistoryRepository.save(
            MedicalHistory.builder().animal(ganga).event("Registered").eventDate(LocalDate.of(2025,2,20)).performedBy("Animal Seva").build()
        );

        // Moti
        Animal moti = Animal.builder()
                .animalId("AASA-0006").name("Moti").type(Animal.AnimalType.Dog)
                .breed("Spitz Mix").area("Sangli Ward 2").vaccinated(true).sterilized(false)
                .status(Animal.AnimalStatus.stable).registrationDate(LocalDate.of(2025, 3, 1))
                .contactPerson("Dr. Patil").notes("Elderly dog, regular feeder cares.")
                .latitude(16.8424).longitude(74.5615).registeredBy("Dr. Patil").build();
        moti = animalRepository.save(moti);
        medicalHistoryRepository.save(
            MedicalHistory.builder().animal(moti).event("Registered").eventDate(LocalDate.of(2025,3,1)).performedBy("Dr. Patil").build()
        );

        log.info("Seeded 6 animals");
    }

    // ─── RESCUE CASES ─────────────────────────────────────────────────────────
    private void seedRescueCases() {
        List<RescueCase> cases = List.of(
            RescueCase.builder().caseId("CASE-2481").title("Injured dog near Railway Station")
                .area("Sangli Jn").animalType(Animal.AnimalType.Dog).urgency(RescueCase.Urgency.critical)
                .reportedBy("Priya M.").currentStep(1).build(),
            RescueCase.builder().caseId("CASE-2482").title("Limping cow on NH-48")
                .area("Kupwad Road").animalType(Animal.AnimalType.Cow).urgency(RescueCase.Urgency.moderate)
                .reportedBy("Suresh K.").currentStep(0).build(),
            RescueCase.builder().caseId("CASE-2483").title("Stray pups, 4 weeks old")
                .area("Miraj Market").animalType(Animal.AnimalType.Dog).urgency(RescueCase.Urgency.stable)
                .reportedBy("Anjali V.").currentStep(2).build(),
            RescueCase.builder().caseId("CASE-2484").title("Sick cat near hospital")
                .area("Civil Hospital").animalType(Animal.AnimalType.Cat).urgency(RescueCase.Urgency.moderate)
                .reportedBy("Dr. Rao").currentStep(1).build()
        );
        rescueCaseRepository.saveAll(cases);
        log.info("Seeded {} rescue cases", cases.size());
    }

    // ─── VOLUNTEERS ───────────────────────────────────────────────────────────
    private void seedVolunteers() {
        List<Volunteer> volunteers = List.of(
            Volunteer.builder().name("PawCare NGO").role("Rescue Team Lead").avatar("🐾")
                .rescueCount(142).active(true).area("Sangli Central").build(),
            Volunteer.builder().name("Animal Seva Trust").role("Shelter Coordinator").avatar("🏠")
                .rescueCount(98).active(true).area("Miraj").build(),
            Volunteer.builder().name("Dr. Suresh Patil").role("Veterinarian").avatar("🩺")
                .rescueCount(76).active(false).area("Ward 3–7").build(),
            Volunteer.builder().name("Green Paws Society").role("Field Volunteer").avatar("🌿")
                .rescueCount(54).active(true).area("Kupwad").build(),
            Volunteer.builder().name("Dr. Anita Joshi").role("Veterinarian").avatar("🩺")
                .rescueCount(43).active(true).area("Ward 1–5").build(),
            Volunteer.builder().name("Stray Warriors").role("Rescue Volunteer").avatar("⚔️")
                .rescueCount(31).active(false).area("Islampur").build()
        );
        volunteerRepository.saveAll(volunteers);
        log.info("Seeded {} volunteers", volunteers.size());
    }

    // ─── NOTIFICATIONS ────────────────────────────────────────────────────────
    private void seedNotifications() {
        List<Notification> notifications = List.of(
            Notification.builder().icon("🚨").type("critical").read(false)
                .text("Critical case CASE-2481 needs immediate attention near Railway Station").build(),
            Notification.builder().icon("💉").type("warning").read(false)
                .text("AASA-0002 (Kaali) vaccination is overdue by 3 days").build(),
            Notification.builder().icon("✅").type("success").read(false)
                .text("CASE-2483 successfully rescued. 4 pups safe at PawCare shelter").build(),
            Notification.builder().icon("📍").type("info").read(true)
                .text("New stray sighting reported in Ward 5 — no ID tag").build(),
            Notification.builder().icon("🏥").type("info").read(true)
                .text("Dr. Patil available for field visits tomorrow morning").build()
        );
        notificationRepository.saveAll(notifications);
        log.info("Seeded {} notifications", notifications.size());
    }
}
