package com.thanhtrongvo.productservice.services;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.thanhtrongvo.productservice.configs.StripeConfig;
import com.thanhtrongvo.productservice.dtos.requests.OrderRequest;
import com.thanhtrongvo.productservice.dtos.responses.CheckoutSessionResponse;
import com.thanhtrongvo.productservice.entities.Order;
import com.thanhtrongvo.productservice.entities.OrderItem;
import com.thanhtrongvo.productservice.entities.OrderStatus;
import com.thanhtrongvo.productservice.entities.Product;
import com.thanhtrongvo.productservice.entities.User;
import com.thanhtrongvo.productservice.exceptions.BadRequestException;
import com.thanhtrongvo.productservice.exceptions.ResourceNotFoundException;
import com.thanhtrongvo.productservice.repositories.OrderRepository;
import com.thanhtrongvo.productservice.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final StripeConfig stripeConfig;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    /**
     * Creates an order, then creates a Stripe Checkout Session for payment.
     */
    @Transactional
    public CheckoutSessionResponse createCheckoutSession(OrderRequest request, User user) {
        // 1. Create the order (PENDING)
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .paymentMethod("STRIPE")
                .user(user)
                .orderItems(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (var itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal itemPrice = product.getPrice();
            BigDecimal subtotal = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(itemPrice)
                    .build();

            order.getOrderItems().add(orderItem);
            totalAmount = totalAmount.add(subtotal);

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            // Build Stripe line item (amount in smallest currency unit — VND has no decimals)
            lineItems.add(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity((long) itemReq.getQuantity())
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("vnd")
                                            .setUnitAmount(itemPrice.longValue())
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(product.getName())
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // 2. Create Stripe Checkout Session
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(stripeConfig.getSuccessUrl())
                    .setCancelUrl(stripeConfig.getCancelUrl())
                    .addAllLineItem(lineItems)
                    .putMetadata("orderId", savedOrder.getId().toString())
                    .build();

            Session session = Session.create(params);

            // Save session ID to order
            savedOrder.setStripeSessionId(session.getId());
            orderRepository.save(savedOrder);

            return CheckoutSessionResponse.builder()
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();

        } catch (StripeException e) {
            log.error("Failed to create Stripe checkout session", e);
            throw new BadRequestException("Payment session creation failed: " + e.getMessage());
        }
    }

    /**
     * Handles incoming Stripe webhook events.
     */
    @Transactional
    public void handleWebhookEvent(String payload, String sigHeader) {
        com.stripe.model.Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeConfig.getWebhookSecret());
        } catch (SignatureVerificationException e) {
            log.error("Stripe webhook signature verification failed", e);
            throw new BadRequestException("Invalid webhook signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new BadRequestException("Failed to deserialize Stripe event data"));

            String orderId = session.getMetadata().get("orderId");
            if (orderId != null) {
                Order order = orderRepository.findById(Long.parseLong(orderId))
                        .orElseThrow(() -> new ResourceNotFoundException("Order", "id", Long.parseLong(orderId)));

                order.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);
                log.info("Order {} confirmed via Stripe payment", order.getOrderNumber());
            }
        }
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
