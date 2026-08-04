package com.gl.product_service.controller;

import com.gl.product_service.entity.Product;
import com.gl.product_service.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductCatalogController {

    private final ProductCatalogService productService;

    @Autowired
    public ProductCatalogController(ProductCatalogService productService) {
        this.productService = productService;
    }

    // GET /api/products -> Fetch all active products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllActiveProducts();
        return ResponseEntity.ok(products);
    }

    // GET /api/products/{slug} -> Fetch single product details
    @GetMapping("/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(product);
    }


}