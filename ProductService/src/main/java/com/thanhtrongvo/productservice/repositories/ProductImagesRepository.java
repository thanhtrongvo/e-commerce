package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.ProductImages;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImagesRepository extends JpaRepository<ProductImages, Long> {
}