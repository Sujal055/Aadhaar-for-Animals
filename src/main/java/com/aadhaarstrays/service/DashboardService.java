package com.aadhaarstrays.service;

import com.aadhaarstrays.dto.DashboardDto;
import com.aadhaarstrays.entity.Animal;
import com.aadhaarstrays.repository.AnimalRepository;
import com.aadhaarstrays.repository.NotificationRepository;
import com.aadhaarstrays.repository.RescueCaseRepository;
import com.aadhaarstrays.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AnimalRepository animalRepository;
    private final RescueCaseRepository rescueCaseRepository;
    private final VolunteerRepository volunteerRepository;
    private final NotificationRepository notificationRepository;

    public DashboardDto getDashboardStats() {
        long total = animalRepository.count();
        long vaccinated = animalRepository.countByVaccinatedTrue();
        long critical = animalRepository.countByStatus(Animal.AnimalStatus.critical);
        long moderate = animalRepository.countByStatus(Animal.AnimalStatus.moderate);
        long stable = animalRepository.countByStatus(Animal.AnimalStatus.stable);
        long dogs = animalRepository.countByType(Animal.AnimalType.Dog);
        long cats = animalRepository.countByType(Animal.AnimalType.Cat);
        long cows = animalRepository.countByType(Animal.AnimalType.Cow);
        long others = animalRepository.countByType(Animal.AnimalType.Other);
        long activeCases = rescueCaseRepository.count();
        long activeVolunteers = volunteerRepository.findByActive(true).size();
        long unread = notificationRepository.countByReadFalse();

        double vaccinationPercent = total > 0
                ? Math.round((vaccinated * 100.0 / total) * 10.0) / 10.0
                : 0.0;

        // Pie chart data
        List<Map<String, Object>> pieData = new ArrayList<>();
        Map<String, Object> p1 = new HashMap<>();
        p1.put("name", "Vaccinated");
        p1.put("value", vaccinated);
        Map<String, Object> p2 = new HashMap<>();
        p2.put("name", "Unvaccinated");
        p2.put("value", total - vaccinated);
        pieData.add(p1);
        pieData.add(p2);

        // Recent activity (last 5 animals registered)
        List<Map<String, String>> recentActivity = new ArrayList<>();
        animalRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .forEach(a -> {
                    Map<String, String> entry = new HashMap<>();
                    entry.put("text", "New registration: " + a.getName() + " (" + a.getAnimalId() + ") in " + a.getArea());
                    entry.put("color", a.getStatus() == Animal.AnimalStatus.critical ? "#c0392b"
                            : a.getStatus() == Animal.AnimalStatus.moderate ? "#d97706" : "#3d6b4a");
                    entry.put("time", "recently");
                    recentActivity.add(entry);
                });

        return DashboardDto.builder()
                .totalAnimals(total)
                .vaccinatedCount(vaccinated)
                .sterilizedCount(animalRepository.findAll().stream().filter(a -> Boolean.TRUE.equals(a.getSterilized())).count())
                .criticalCount(critical)
                .moderateCount(moderate)
                .stableCount(stable)
                .dogCount(dogs)
                .catCount(cats)
                .cowCount(cows)
                .otherCount(others)
                .activeCases(activeCases)
                .activeVolunteers(activeVolunteers)
                .totalRescues(activeCases)
                .unreadNotifications(unread)
                .vaccinationPercent(vaccinationPercent)
                .pieData(pieData)
                .recentActivity(recentActivity)
                .build();
    }
}
