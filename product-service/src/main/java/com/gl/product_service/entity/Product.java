package com.gl.product_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String id;

    // --- CHANGED: Replaced Single Category with a List of Categories ---
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories = new ArrayList<>();
    // -------------------------------------------------------------------

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    // REMOVED: categoryName and categorySlug (since there are now multiple)

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "product_images",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductFilter> filters = new HashSet<>();



    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}