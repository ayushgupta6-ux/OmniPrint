package com.gl.vendor_service.controller;

import com.gl.vendor_service.dto.VendorProfileDTO;
import com.gl.vendor_service.entity.VendorProfile;
import com.gl.vendor_service.repository.VendorProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/vendors")
public class VendorProfileController {

    private final VendorProfileRepository profileRepository;

    public VendorProfileController(VendorProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @PostMapping("/profile")
    public ResponseEntity<VendorProfile> createProfile(
            @RequestHeader("X-User-Id") Long tokenId, // <-- SECURE: Get ID from Gateway Token
            @RequestBody VendorProfileDTO request) {

        VendorProfile profile = VendorProfile.builder()
                .vendorId(tokenId) // <-- Force it to use the token's ID
                .agencyName(request.getAgencyName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isAcceptingOrders(true)
                .build();

        VendorProfile savedProfile = profileRepository.save(profile);
        return ResponseEntity.ok(savedProfile);
    }

    // --- SECURE GET VENDOR PROFILE ---
    @GetMapping("/profile")
    public ResponseEntity<VendorProfile> getVendorProfile(@RequestHeader("X-User-Id") Long vendorId) {
        Optional<VendorProfile> profile = profileRepository.findByVendorId(vendorId);

        return profile.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}