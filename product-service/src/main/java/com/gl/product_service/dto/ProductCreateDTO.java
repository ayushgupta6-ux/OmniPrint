package com.gl.product_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateDTO {
    private String id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal basePrice;

    // --- CHANGED: Replaced imageUrl with images ---
    private List<String> images;
    // ----------------------------------------------

    private List<FilterDTO> filters;

    private List<CategoryRequestDTO> categories;

    @Data
    public static class FilterDTO {
        private String label;
        private List<String> options;
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