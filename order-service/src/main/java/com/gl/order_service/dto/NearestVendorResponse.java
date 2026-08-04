package com.gl.order_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class NearestVendorResponse {
    private Long vendorId;
    private String agencyName;
    private String address;
    private Double distanceKm;
    private Integer quantity;
    private BigDecimal baseUnitPrice;
    private BigDecimal discountPercentage;
    private BigDecimal finalUnitPrice;
    private BigDecimal totalAmount;
}