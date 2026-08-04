package com.gl.vendor_service.dto;

import lombok.Data;

@Data
public class VendorProfileDTO {
    private Long vendorId;
    private String agencyName;
    private String address;
    private Double latitude;
    private Double longitude;
}