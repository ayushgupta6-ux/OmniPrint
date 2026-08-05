package com.gl.vendor_service.repository;

import com.gl.vendor_service.entity.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile,Long> {
    Optional<VendorProfile> findByVendorId(Long vendorId);
}
