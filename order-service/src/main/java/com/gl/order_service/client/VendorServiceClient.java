package com.gl.order_service.client;

import com.gl.order_service.dto.NearestVendorResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "VENDOR-SERVICE")
public interface VendorServiceClient {

    // This perfectly matches the GET endpoint you just tested in the Vendor Service
    @GetMapping("/api/vendors/nearest")
    NearestVendorResponse getNearestVendor(
            @RequestParam("productId") String productId,
            @RequestParam("lat") double lat,
            @RequestParam("lng") double lng,
            @RequestParam("quantity") int quantity
    );
}