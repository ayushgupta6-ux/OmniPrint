package com.gl.vendor_service.controller;

import com.gl.vendor_service.dto.NearestVendorResponse;
import com.gl.vendor_service.service.VendorRoutingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendors")
public class VendorRoutingController {

    private final VendorRoutingService routingService;

    public VendorRoutingController(VendorRoutingService routingService) {
        this.routingService = routingService;
    }

    // GET /api/vendors/nearest?productId=standard-flex-banner&lat=28.53&lng=77.39&quantity=50
    @GetMapping("/nearest")
    public ResponseEntity<NearestVendorResponse> getNearestVendor(
            @RequestParam String productId,
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "1") int quantity) {

        NearestVendorResponse response = routingService.findNearestVendor(productId, lat, lng, quantity);
        return ResponseEntity.ok(response);
    }
}