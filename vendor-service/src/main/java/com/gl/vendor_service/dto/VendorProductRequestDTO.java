package com.gl.vendor_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class VendorProductRequestDTO {
    private String productId;
    private BigDecimal vendorPrice;

    // --- NEW: Installation Charges ---
    private Boolean offersInstallation;
    private BigDecimal installationFee;

    // --- LISTS ---
    private List<TierDTO> discountTiers;
    private List<FilterPricingDTO> filterPricings; // NEW

    // ==========================================
    // --- NESTED DTO CLASSES ---
    // ==========================================

    @Data
    public static class TierDTO {
        private Integer minQuantity;
        private Integer maxQuantity;
        private BigDecimal discountPercentage;
    }

    // NEW: Nested DTO for Filter Surcharges
    @Data
    public static class FilterPricingDTO {
        private String filterLabel;      // e.g., "Material"
        private String optionName;       // e.g., "Laminated"
        private BigDecimal additionalPrice; // e.g., 50.00
    }
}