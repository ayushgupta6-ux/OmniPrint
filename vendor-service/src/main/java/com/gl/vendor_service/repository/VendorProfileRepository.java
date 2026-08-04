package com.gl.vendor_service.repository;

import com.gl.vendor_service.entity.VendorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorProfileRepository extends JpaRepository<VendorProfile,Long> {
}
