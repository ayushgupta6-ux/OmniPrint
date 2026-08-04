package com.gl.vendor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearestVendorResponse {
    private Long vendorId;
    private String agencyName;
    private String address;
    private Double distanceKm;

    // Pricing details for the order
    private Integer quantity;
    private BigDecimal baseUnitPrice;      // Base price before discount
    private BigDecimal discountPercentage; // Discount % applied
    private BigDecimal finalUnitPrice;     // Price per unit after discount
    private BigDecimal totalAmount;        // finalUnitPrice * quantity
}