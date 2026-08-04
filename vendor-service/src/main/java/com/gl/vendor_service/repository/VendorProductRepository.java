package com.gl.vendor_service.repository;

import com.gl.vendor_service.entity.VendorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VendorProductRepository extends JpaRepository<VendorProduct, Long> {

    // Added LEFT JOIN FETCH vp.discountTiers to load tiers eagerly
    @Query("SELECT DISTINCT vp FROM VendorProduct vp " +
            "JOIN FETCH vp.vendor v " +
            "LEFT JOIN FETCH vp.discountTiers " +
            "WHERE vp.productId = :productId AND v.isAcceptingOrders = true")
    List<VendorProduct> findActiveVendorsByProductId(@Param("productId") String productId);

    List<VendorProduct> findByVendor_VendorId(Long vendorId);

    Optional<VendorProduct> findByVendor_VendorIdAndProductId(Long vendorId, String productId);

}