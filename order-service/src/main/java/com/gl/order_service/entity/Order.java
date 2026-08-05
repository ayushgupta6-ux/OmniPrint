package com.gl.order_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clientId;
    private Long vendorId;
    private String productId;
    private Integer quantity;

    private BigDecimal totalAmount;

    private Double deliveryLat;
    private Double deliveryLng;
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    // --- NEW FIELDS ---
    private Boolean needsInstallation;
    private String designPath;

    @ElementCollection
    @CollectionTable(name = "order_filters", joinColumns = @JoinColumn(name = "order_id"))
    @MapKeyColumn(name = "filter_name")
    @Column(name = "filter_value")
    private Map<String, String> selectedFilters;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}