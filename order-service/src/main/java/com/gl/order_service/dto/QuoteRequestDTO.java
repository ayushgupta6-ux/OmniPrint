package com.gl.order_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class QuoteRequestDTO {
    private String productId;
    private Integer quantity;
    private Double lat;
    private Double lng;
    private Map<String, String> selectedFilters;
    private Boolean needsInstallation;
}