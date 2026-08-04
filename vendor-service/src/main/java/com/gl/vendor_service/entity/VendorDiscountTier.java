package com.gl.vendor_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vendor_discount_tiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorDiscountTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_product_id", nullable = false)
    private VendorProduct vendorProduct;

    @Column(name = "min_quantity", nullable = false)
    private Integer minQuantity;

    // Can be null if it's "100+ items" (no upper limit)
    @Column(name = "max_quantity")
    private Integer maxQuantity;

    @Column(name = "discount_percentage", nullable = false)
    private BigDecimal discountPercentage;
}