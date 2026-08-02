package com.gl.product_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateDTO {
    private String id;
    private String name;
    private String slug;

    // REMOVED: private String categoryId; <-- You don't need this anymore

    private String description;
    private BigDecimal basePrice;
    private String imageUrl;

    private List<FilterDTO> filters;
    private List<TierDTO> discountTiers;
    private List<CategoryRequestDTO> categories; // <-- This handles your categories now

    @Data
    public static class FilterDTO {
        private String label;
        private List<String> options;
    }

    @Data
    public static class TierDTO {
        private Integer minQuantity;
        private Integer maxQuantity;
        private BigDecimal discountPercentage;
    }

    @Data
    public static class CategoryRequestDTO {
        private String id;
        private String name;
        private String slug;
        private String description;
        private String imageUrl;
    }
}