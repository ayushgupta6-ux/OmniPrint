package com.gl.product_service.service;

import com.gl.product_service.dto.ProductCreateDTO;
import com.gl.product_service.dto.QuotationDTOs;
import com.gl.product_service.entity.Category;
import com.gl.product_service.entity.Product;
import com.gl.product_service.entity.ProductFilter;
import com.gl.product_service.entity.QuantityDiscountTier;
import com.gl.product_service.repository.CategoryRepository;
import com.gl.product_service.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductCatalogService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductCatalogService(ProductRepository productRepository,
                                 CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> getAllActiveProducts() {
        return productRepository.findAllActiveProducts();
    }

    @Transactional(readOnly = true)
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> new RuntimeException("Product not found with slug: " + slug));
    }

    // Dynamic Quotation Engine
    @Transactional(readOnly = true)
    public QuotationDTOs.Response calculateQuote(QuotationDTOs.Request request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + request.getProductId()));

        int qty = request.getQuantity();
        BigDecimal basePrice = product.getBasePrice();
        BigDecimal discountPercent = BigDecimal.ZERO;

        // Find applicable quantity tier
        for (QuantityDiscountTier tier : product.getDiscountTiers()) {
            if (qty >= tier.getMinQuantity() && (tier.getMaxQuantity() == null || qty <= tier.getMaxQuantity())) {
                discountPercent = tier.getDiscountPercentage();
                break;
            }
        }

        BigDecimal discountFactor = BigDecimal.ONE.subtract(discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        BigDecimal finalUnitPrice = basePrice.multiply(discountFactor).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = finalUnitPrice.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);

        return new QuotationDTOs.Response(
                product.getId(),
                qty,
                basePrice,
                discountPercent,
                finalUnitPrice,
                totalPrice
        );
    }

    @Transactional
    public Product createProduct(ProductCreateDTO dto) {

        // 1. Initialize the Product with List<String> images
        Product product = Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .basePrice(dto.getBasePrice())
                .images(dto.getImages() != null ? dto.getImages() : List.of()) // Set image URLs list
                .isActive(true)
                .build();

        // 2. Handle Multiple Categories & On-the-fly Creation
        if (dto.getCategories() != null && !dto.getCategories().isEmpty()) {
            List<Category> productCategories = dto.getCategories().stream().map(catDto -> {
                return categoryRepository.findById(catDto.getId())
                        .orElseGet(() -> {
                            Category newCategory = Category.builder()
                                    .id(catDto.getId())
                                    .name(catDto.getName())
                                    .slug(catDto.getSlug())
                                    .description(catDto.getDescription())
                                    .imageUrl(catDto.getImageUrl())
                                    .build();
                            return categoryRepository.save(newCategory);
                        });
            }).toList();

            product.setCategories(productCategories);
        } else {
            throw new RuntimeException("A product must have at least one category.");
        }

        // 3. Map Filters
        if (dto.getFilters() != null) {
            Set<ProductFilter> filterEntities = dto.getFilters().stream().map(f ->
                    ProductFilter.builder()
                            .product(product)
                            .label(f.getLabel())
                            .options(f.getOptions())
                            .build()
            ).collect(Collectors.toSet());
            product.setFilters(filterEntities);
        }

        // 4. Map Discount Tiers
        if (dto.getDiscountTiers() != null) {
            Set<QuantityDiscountTier> tierEntities = dto.getDiscountTiers().stream().map(t ->
                    QuantityDiscountTier.builder()
                            .product(product)
                            .minQuantity(t.getMinQuantity())
                            .maxQuantity(t.getMaxQuantity())
                            .discountPercentage(t.getDiscountPercentage())
                            .build()
            ).collect(Collectors.toSet());
            product.setDiscountTiers(tierEntities);
        }

        // 5. Save product
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(String id, ProductCreateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // 1. Update basic fields
        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setDescription(dto.getDescription());
        product.setBasePrice(dto.getBasePrice());

        // 2. Update Images safely (Wrap in ArrayList to ensure it is mutable)
        if (dto.getImages() != null) {
            product.getImages().clear();
            product.getImages().addAll(new ArrayList<>(dto.getImages()));
        }

        // 3. Update Categories (Many-to-Many)
        if (dto.getCategories() != null && !dto.getCategories().isEmpty()) {
            List<Category> productCategories = dto.getCategories().stream().map(catDto -> {
                return categoryRepository.findById(catDto.getId())
                        .orElseGet(() -> {
                            Category newCategory = Category.builder()
                                    .id(catDto.getId())
                                    .name(catDto.getName())
                                    .slug(catDto.getSlug())
                                    .description(catDto.getDescription())
                                    .imageUrl(catDto.getImageUrl())
                                    .build();
                            return categoryRepository.save(newCategory);
                        });
            }).collect(Collectors.toList()); // <--- FIX: Changed from .toList() to ensure it's MUTABLE

            product.setCategories(productCategories);
        } else {
            throw new RuntimeException("A product must have at least one category.");
        }

        // 4. Update Filters (One-to-Many)
        if (dto.getFilters() != null) {
            product.getFilters().clear();

            Set<ProductFilter> filterEntities = dto.getFilters().stream().map(f ->
                    ProductFilter.builder()
                            .product(product)
                            .label(f.getLabel())
                            .options(new ArrayList<>(f.getOptions())) // Ensure options list is mutable
                            .build()
            ).collect(Collectors.toSet());

            product.getFilters().addAll(filterEntities);
        }

        // 5. Update Discount Tiers (One-to-Many)
        if (dto.getDiscountTiers() != null) {
            product.getDiscountTiers().clear();

            Set<QuantityDiscountTier> tierEntities = dto.getDiscountTiers().stream().map(t ->
                    QuantityDiscountTier.builder()
                            .product(product)
                            .minQuantity(t.getMinQuantity())
                            .maxQuantity(t.getMaxQuantity())
                            .discountPercentage(t.getDiscountPercentage())
                            .build()
            ).collect(Collectors.toSet());

            product.getDiscountTiers().addAll(tierEntities);
        }

        // 6. Save the updated product
        return productRepository.save(product);
    }
    @Transactional
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
}