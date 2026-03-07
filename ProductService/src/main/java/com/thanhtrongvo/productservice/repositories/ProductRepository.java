package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    long countById(Long id);

    Optional<Product> findById(Long id);
    Optional<Product> findBySlug(String slug);
    Optional<Product> findByIdAndName(Long id, String name);

    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByDeletedFalse(Pageable pageable);
}