package com.gl.order_service.service;

import com.gl.order_service.client.VendorServiceClient;
import com.gl.order_service.dto.NearestVendorResponse;
import com.gl.order_service.dto.OrderRequestDTO;
import com.gl.order_service.dto.QuoteRequestDTO;
import com.gl.order_service.dto.QuoteResponseDTO;
import com.gl.order_service.entity.Order;
import com.gl.order_service.entity.OrderStatus;
import com.gl.order_service.repository.OrderRepository;
import feign.FeignException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderProcessingService {

    private final OrderRepository orderRepository;
    private final VendorServiceClient vendorClient;

    public OrderProcessingService(OrderRepository orderRepository, VendorServiceClient vendorClient) {
        this.orderRepository = orderRepository;
        this.vendorClient = vendorClient;
    }

    @Transactional
    public Order placeOrder(Long clientId, OrderRequestDTO request) {
        QuoteResponseDTO routingData;

        try {
            // 1. Build the Quote Request with all the new filters and flags
            QuoteRequestDTO quoteRequest = QuoteRequestDTO.builder()
                    .productId(request.getProductId())
                    .quantity(request.getQuantity())
                    .lat(request.getDeliveryLat())
                    .lng(request.getDeliveryLng())
                    .selectedFilters(request.getSelectedFilters())
                    .needsInstallation(request.getNeedsInstallation())
                    .build();

            // 2. Call Vendor Service via Feign (POST /quote)
            routingData = vendorClient.getVendorQuote(quoteRequest);

        } catch (FeignException e) {
            throw new RuntimeException("Could not process order: No nearby vendors available for this configuration.");
        }

        // 3. Build the order with the securely calculated vendor data
        Order newOrder = Order.builder()
                .clientId(clientId)
                .vendorId(routingData.getVendorId())
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .totalAmount(routingData.getTotalAmount()) // SECURE: Calculated by backend!
                .deliveryLat(request.getDeliveryLat())
                .deliveryLng(request.getDeliveryLng())
                .deliveryAddress(request.getDeliveryAddress())
                .status(OrderStatus.PLACED)
                // --- NEW: Map the user's design choices ---
                .selectedFilters(request.getSelectedFilters())
                .needsInstallation(request.getNeedsInstallation())
                .designPath(request.getDesignPath())
                .build();

        // 4. Save and return
        return orderRepository.save(newOrder);
    }

    // Allow vendors to update the status of the order
    @Transactional
    public Order updateOrderStatus(Long orderId, Long vendorId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Security check: Only the assigned vendor can update this order
        if (!order.getVendorId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized: You are not assigned to this order.");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // Fetch orders for a specific client
    public List<Order> getClientOrders(Long clientId) {
        return orderRepository.findByClientId(clientId);
    }

    // Fetch orders assigned to a specific vendor
    public List<Order> getVendorOrders(Long vendorId) {
        return orderRepository.findByVendorId(vendorId);
    }
}