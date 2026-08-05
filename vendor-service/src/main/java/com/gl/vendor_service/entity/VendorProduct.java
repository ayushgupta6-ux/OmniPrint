package com.gl.vendor_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "vendor_products",
        uniqueConstraints = {
                // A vendor can only have ONE price entry per master product
                @UniqueConstraint(columnNames = {"vendor_id", "product_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore // Prevents infinite JSON recursion when sending responses
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private VendorProfile vendor;

    // This is the String ID from your Product Service (e.g., "standard-flex-banner")
    @Column(name = "product_id", nullable = false)
    private String productId;

    // The specific price this vendor charges for this product
    @Column(name = "vendor_price", nullable = false)
    private BigDecimal vendorPrice;

    // ==========================================
    // --- NEW: Installation Charges ---
    // ==========================================
    @Column(name = "offers_installation")
    private Boolean offersInstallation;

    @Column(name = "installation_fee", precision = 10, scale = 2)
    private BigDecimal installationFee;


    // ==========================================
    // --- LISTS & MAPPINGS ---
    // ==========================================

    @OneToMany(mappedBy = "vendorProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VendorDiscountTier> discountTiers = new ArrayList<>();

    // --- NEW: Filter Option Surcharges ---
    @OneToMany(mappedBy = "vendorProduct", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VendorFilterPricing> filterPricings = new ArrayList<>();


    // ==========================================
    // --- TIMESTAMPS ---
    // ==========================================

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}