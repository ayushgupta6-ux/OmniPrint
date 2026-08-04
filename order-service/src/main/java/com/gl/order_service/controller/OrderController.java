package com.gl.order_service.controller;

import com.gl.order_service.dto.OrderRequestDTO;
import com.gl.order_service.entity.Order;
import com.gl.order_service.entity.OrderStatus;
import com.gl.order_service.service.OrderProcessingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderProcessingService orderService;

    public OrderController(OrderProcessingService orderService) {
        this.orderService = orderService;
    }

    // 1. CLIENT: Place a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestHeader("X-User-Id") Long clientId,
            @RequestBody OrderRequestDTO request) {

        Order savedOrder = orderService.placeOrder(clientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    // 2. CLIENT: Get their order history
    @GetMapping("/client")
    public ResponseEntity<List<Order>> getClientOrders(@RequestHeader("X-User-Id") Long clientId) {
        return ResponseEntity.ok(orderService.getClientOrders(clientId));
    }

    // 3. VENDOR: Get orders assigned to them
    @GetMapping("/vendor")
    public ResponseEntity<List<Order>> getVendorOrders(@RequestHeader("X-User-Id") Long vendorId) {
        return ResponseEntity.ok(orderService.getVendorOrders(vendorId));
    }

    // 4. VENDOR: Update order status (e.g., PLACED -> MANUFACTURING)
    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long orderId,
            @RequestHeader("X-User-Id") Long vendorId,
            @RequestParam OrderStatus status) {

        Order updatedOrder = orderService.updateOrderStatus(orderId, vendorId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}