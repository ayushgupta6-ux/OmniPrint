package com.gl.order_service.dto;

import lombok.Data;

@Data
public class OrderRequestDTO {
    private String productId;
    private Integer quantity;
    private Double deliveryLat;
    private Double deliveryLng;
    private String deliveryAddress;
}