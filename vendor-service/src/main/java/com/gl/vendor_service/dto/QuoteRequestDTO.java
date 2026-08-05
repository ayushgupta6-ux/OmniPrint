package com.gl.vendor_service.dto;

import lombok.Data;
import java.util.Map;

@Data
public class QuoteRequestDTO {
    private String productId;
    private Integer quantity;
    private Double lat;
    private Double lng;
    private Map<String, String> selectedFilters;
    private Boolean needsInstallation;
}