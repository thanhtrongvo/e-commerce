package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_Id(Long userId);
    Page<Order> findByUser_Id(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
}