package com.aadhaarstrays.repository;

import com.aadhaarstrays.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    Optional<Animal> findByAnimalId(String animalId);

    boolean existsByAnimalId(String animalId);

    List<Animal> findByType(Animal.AnimalType type);

    List<Animal> findByStatus(Animal.AnimalStatus status);

    List<Animal> findByAreaContainingIgnoreCase(String area);

    List<Animal> findByNameContainingIgnoreCaseOrAnimalIdContainingIgnoreCaseOrAreaContainingIgnoreCase(
            String name, String animalId, String area);

    long countByVaccinatedTrue();

    long countByStatus(Animal.AnimalStatus status);

    long countByType(Animal.AnimalType type);

    @Query("SELECT MAX(a.animalId) FROM Animal a WHERE a.animalId LIKE 'AASA-%'")
    String findMaxAnimalId();
}
