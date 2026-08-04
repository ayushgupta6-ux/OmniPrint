package com.gl.vendor_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vendor_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfile {

    @Id
    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "agency_name", nullable = false)
    private String agencyName;

    // --- NEW FIELD: The physical address they type in ---
    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    // The coordinates for your geo-routing logic
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "is_accepting_orders")
    @Builder.Default
    private Boolean isAcceptingOrders = true;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VendorProduct> products = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}