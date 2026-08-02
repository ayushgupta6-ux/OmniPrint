package com.gl.product_service.controller;

import com.gl.product_service.dto.ProductCreateDTO;
import com.gl.product_service.entity.Product;
import com.gl.product_service.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductCatalogService productService;

    @Autowired
    public AdminProductController(ProductCatalogService productService) {
        this.productService = productService;
    }

    // POST /api/admin/products -> Create a new product with categories & tiers
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductCreateDTO productDto) {
        Product createdProduct = productService.createProduct(productDto);

        // Return 201 Created status code along with the saved product
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
}