package com.gl.vendor_service.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class QuoteResponseDTO {
    private Long vendorId;
    private String agencyName;
    private Integer quantity;
    private BigDecimal baseUnitPrice;
    private BigDecimal discountPercentage;
    private BigDecimal finalUnitPrice;
    private BigDecimal installationFee;
    private BigDecimal totalAmount;
    private Double distanceKm;
}