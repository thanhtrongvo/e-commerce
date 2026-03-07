package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.ERole;
import com.thanhtrongvo.productservice.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}