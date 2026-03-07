package com.thanhtrongvo.productservice.services;

import com.thanhtrongvo.productservice.dtos.requests.OrderItemRequest;
import com.thanhtrongvo.productservice.dtos.requests.OrderRequest;
import com.thanhtrongvo.productservice.dtos.responses.OrderItemResponse;
import com.thanhtrongvo.productservice.dtos.responses.OrderResponse;
import com.thanhtrongvo.productservice.entities.Order;
import com.thanhtrongvo.productservice.entities.OrderItem;
import com.thanhtrongvo.productservice.entities.Product;
import com.thanhtrongvo.productservice.entities.User;
import com.thanhtrongvo.productservice.exceptions.BadRequestException;
import com.thanhtrongvo.productservice.exceptions.ResourceNotFoundException;
import com.thanhtrongvo.productservice.repositories.OrderRepository;
import com.thanhtrongvo.productservice.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderResponse createOrder(OrderRequest request, User user) {
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .status("PENDING")
                .shippingAddress(request.getShippingAddress())
                .user(user)
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal itemPrice = product.getPrice();
            BigDecimal subtotal = itemPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(itemPrice)
                    .build();

            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(subtotal);

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUser(Long userId, Pageable pageable) {
        return orderRepository.findByUser_Id(userId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        return mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
        order.setStatus(status);
        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }

    // --- Mapping helpers ---

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> items = order.getOrderItems() != null
                ? order.getOrderItems().stream().map(this::mapItemToResponse).collect(Collectors.toList())
                : List.of();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .userId(order.getUser().getId())
                .username(order.getUser().getUsername())
                .items(items)
                .build();
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

