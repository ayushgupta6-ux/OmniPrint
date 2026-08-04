package com.gl.vendor_service.controller;

import com.gl.vendor_service.dto.VendorProductRequestDTO;
import com.gl.vendor_service.entity.VendorProduct;
import com.gl.vendor_service.service.VendorCatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors/{vendorId}/products")
public class VendorCatalogController {

    private final VendorCatalogService catalogService;

    public VendorCatalogController(VendorCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    // GET /api/vendors/{vendorId}/products -> List all products this vendor makes
    @GetMapping
    public ResponseEntity<List<VendorProduct>> getCatalog(@PathVariable Long vendorId) {
        return ResponseEntity.ok(catalogService.getVendorCatalog(vendorId));
    }

    // POST /api/vendors/{vendorId}/products -> Add a master product to vendor's catalog
    @PostMapping
    public ResponseEntity<VendorProduct> addProduct(
            @PathVariable Long vendorId,
            @RequestBody VendorProductRequestDTO request) {
        VendorProduct savedProduct = catalogService.addProductToCatalog(vendorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    // PUT /api/vendors/{vendorId}/products/{productId} -> Update price
    @PutMapping("/{productId}")
    public ResponseEntity<VendorProduct> updatePrice(
            @PathVariable Long vendorId,
            @PathVariable String productId,
            @RequestBody VendorProductRequestDTO request) {
        VendorProduct updatedProduct = catalogService.updateProductPrice(vendorId, productId, request);
        return ResponseEntity.ok(updatedProduct);
    }



    // DELETE /api/vendors/{vendorId}/products/{productId} -> Remove product
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeProduct(
            @PathVariable Long vendorId,
            @PathVariable String productId) {
        catalogService.removeProductFromCatalog(vendorId, productId);
        return ResponseEntity.ok("Product removed from catalog successfully");
    }
}