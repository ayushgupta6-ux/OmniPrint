package com.gl.product_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

public class QuotationDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String productId;
        private Integer quantity;
        private Map<String, String> selectedFilters; // e.g. {"Material": "Star Flex", "Size": "6x3 ft"}
    }

    @Data
    @AllArgsConstructor
    public static class Response {
        private String productId;
        private Integer quantity;
        private BigDecimal baseUnitPrice;
        private BigDecimal discountPercentage;
        private BigDecimal finalUnitPrice;
        private BigDecimal totalPrice;
    }
}