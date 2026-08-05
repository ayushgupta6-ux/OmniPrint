package com.gl.vendor_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vendor_filter_pricing")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorFilterPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filterLabel; // e.g., "Material", "Size"
    private String optionName;  // e.g., "Laminated", "A3"

    @Column(precision = 10, scale = 2)
    private BigDecimal additionalPrice; // Surcharge amount added to base price

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_product_id")
    @JsonIgnore
    private VendorProduct vendorProduct;
}