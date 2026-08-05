package com.gl.vendor_service.controller;

import com.gl.vendor_service.dto.QuoteRequestDTO;
import com.gl.vendor_service.dto.QuoteResponseDTO;
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

    @PostMapping("/quote")
    public ResponseEntity<QuoteResponseDTO> getVendorQuote(@RequestBody QuoteRequestDTO request) {
        QuoteResponseDTO response = routingService.calculateBestQuote(request);
        return ResponseEntity.ok(response);
    }
}