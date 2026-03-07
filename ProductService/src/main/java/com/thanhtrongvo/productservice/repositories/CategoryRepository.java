package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}