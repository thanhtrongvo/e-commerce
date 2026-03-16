package com.thanhtrongvo.productservice.controllers;

import com.thanhtrongvo.productservice.dtos.requests.OrderRequest;
import com.thanhtrongvo.productservice.dtos.responses.ApiResponse;
import com.thanhtrongvo.productservice.dtos.responses.CheckoutSessionResponse;
import com.thanhtrongvo.productservice.entities.User;
import com.thanhtrongvo.productservice.services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payment", description = "Stripe Payment APIs")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-checkout-session")
    @Operation(summary = "Create a Stripe Checkout Session")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> createCheckoutSession(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal User currentUser) {
        CheckoutSessionResponse response = paymentService.createCheckoutSession(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Checkout session created", response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Handle Stripe webhook events")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            paymentService.handleWebhookEvent(payload, sigHeader);
            return ResponseEntity.ok("Webhook handled");
        } catch (Exception e) {
            log.error("Webhook processing failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }
    }
}
