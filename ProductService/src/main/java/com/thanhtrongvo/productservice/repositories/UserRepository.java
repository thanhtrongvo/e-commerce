package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    long countById(Long id);

    boolean existsByIdAndIsActive(Long id, Boolean isActive);

}