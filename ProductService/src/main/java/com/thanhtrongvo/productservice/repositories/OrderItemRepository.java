package com.thanhtrongvo.productservice.repositories;

import com.thanhtrongvo.productservice.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    Optional<OrderItem> findByOrder_Id(Long id);

    Optional<OrderItem> findByOrder_OrderNumber(String orderNumber);

    boolean existsByOrder_Id(Long id);


}