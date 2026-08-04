package com.gl.vendor_service.controller;

import com.gl.vendor_service.dto.VendorProfileDTO;
import com.gl.vendor_service.entity.VendorProfile;
import com.gl.vendor_service.repository.VendorProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendors")
public class VendorProfileController {

    private final VendorProfileRepository profileRepository;

    public VendorProfileController(VendorProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // POST /api/vendors/profile -> Used when vendor completes setup
    @PostMapping("/profile")
    public ResponseEntity<VendorProfile> createProfile(@RequestBody VendorProfileDTO request) {

        VendorProfile profile = VendorProfile.builder()
                .vendorId(request.getVendorId())
                .agencyName(request.getAgencyName())
                .address(request.getAddress()) // Now saving the physical address
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isAcceptingOrders(true)
                .build();

        VendorProfile savedProfile = profileRepository.save(profile);
        return ResponseEntity.ok(savedProfile);
    }
}