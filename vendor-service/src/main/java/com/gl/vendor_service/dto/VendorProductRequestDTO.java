package com.gl.vendor_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class VendorProductRequestDTO {
    private String productId;
    private BigDecimal vendorPrice;
    private List<TierDTO> discountTiers;

    @Data
    public static class TierDTO {
        private Integer minQuantity;
        private Integer maxQuantity;
        private BigDecimal discountPercentage;
    }
}