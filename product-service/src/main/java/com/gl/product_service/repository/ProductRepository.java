package com.gl.product_service.repository;

import com.gl.product_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.filters LEFT JOIN FETCH p.discountTiers WHERE p.slug = :slug AND p.isActive = true")
    Optional<Product> findBySlugWithDetails(@Param("slug") String slug);

    // --- UPDATED QUERY ---
    // We now JOIN with p.categories (aliased as 'c') and check c.slug
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.filters JOIN p.categories c WHERE c.slug = :categorySlug AND p.isActive = true")
    List<Product> findByCategorySlug(@Param("categorySlug") String categorySlug);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.filters WHERE p.isActive = true")
    List<Product> findAllActiveProducts();
}