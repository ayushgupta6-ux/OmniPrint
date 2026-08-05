package com.gl.vendor_service.service;

import com.gl.vendor_service.dto.VendorProductRequestDTO;
import com.gl.vendor_service.entity.VendorDiscountTier;
import com.gl.vendor_service.entity.VendorFilterPricing; // Make sure to import this!
import com.gl.vendor_service.entity.VendorProduct;
import com.gl.vendor_service.entity.VendorProfile;
import com.gl.vendor_service.repository.VendorProductRepository;
import com.gl.vendor_service.repository.VendorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VendorCatalogService {

    private final VendorProductRepository productRepository;
    private final VendorProfileRepository profileRepository;

    public VendorCatalogService(VendorProductRepository productRepository, VendorProfileRepository profileRepository) {
        this.productRepository = productRepository;
        this.profileRepository = profileRepository;
    }

    // 1. Get entire catalog for a vendor
    public List<VendorProduct> getVendorCatalog(Long vendorId) {
        return productRepository.findByVendor_VendorId(vendorId);
    }

    @Transactional
    public VendorProduct addProductToCatalog(Long vendorId, VendorProductRequestDTO request) {
        VendorProfile vendor = profileRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (productRepository.findByVendor_VendorIdAndProductId(vendorId, request.getProductId()).isPresent()) {
            throw new RuntimeException("Product already exists in catalog.");
        }

        VendorProduct newProduct = VendorProduct.builder()
                .vendor(vendor)
                .productId(request.getProductId())
                .vendorPrice(request.getVendorPrice())
                // --- NEW: Map Installation Fields ---
                .offersInstallation(request.getOffersInstallation() != null ? request.getOffersInstallation() : false)
                .installationFee(request.getInstallationFee())
                .build();

        // Map the discount tiers
        if (request.getDiscountTiers() != null) {
            List<VendorDiscountTier> tiers = request.getDiscountTiers().stream().map(t ->
                    VendorDiscountTier.builder()
                            .vendorProduct(newProduct)
                            .minQuantity(t.getMinQuantity())
                            .maxQuantity(t.getMaxQuantity())
                            .discountPercentage(t.getDiscountPercentage())
                            .build()
            ).toList();
            newProduct.getDiscountTiers().addAll(tiers);
        }

        // --- NEW: Map the filter pricings ---
        if (request.getFilterPricings() != null) {
            List<VendorFilterPricing> filterPricings = request.getFilterPricings().stream().map(f ->
                    VendorFilterPricing.builder()
                            .vendorProduct(newProduct)
                            .filterLabel(f.getFilterLabel())
                            .optionName(f.getOptionName())
                            .additionalPrice(f.getAdditionalPrice())
                            .build()
            ).toList();
            newProduct.getFilterPricings().addAll(filterPricings);
        }

        return productRepository.save(newProduct);
    }

    @Transactional
    public VendorProduct updateProductPrice(Long vendorId, String productId, VendorProductRequestDTO request) {
        VendorProduct existingProduct = productRepository.findByVendor_VendorIdAndProductId(vendorId, productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setVendorPrice(request.getVendorPrice());
        // --- NEW: Update Installation Fields ---
        existingProduct.setOffersInstallation(request.getOffersInstallation() != null ? request.getOffersInstallation() : false);
        existingProduct.setInstallationFee(request.getInstallationFee());

        // Update tiers: Clear old ones and add new ones
        existingProduct.getDiscountTiers().clear();
        if (request.getDiscountTiers() != null) {
            List<VendorDiscountTier> tiers = request.getDiscountTiers().stream().map(t ->
                    VendorDiscountTier.builder()
                            .vendorProduct(existingProduct)
                            .minQuantity(t.getMinQuantity())
                            .maxQuantity(t.getMaxQuantity())
                            .discountPercentage(t.getDiscountPercentage())
                            .build()
            ).toList();
            existingProduct.getDiscountTiers().addAll(tiers);
        }

        // --- NEW: Update filter pricings ---
        existingProduct.getFilterPricings().clear();
        if (request.getFilterPricings() != null) {
            List<VendorFilterPricing> filterPricings = request.getFilterPricings().stream().map(f ->
                    VendorFilterPricing.builder()
                            .vendorProduct(existingProduct)
                            .filterLabel(f.getFilterLabel())
                            .optionName(f.getOptionName())
                            .additionalPrice(f.getAdditionalPrice())
                            .build()
            ).toList();
            existingProduct.getFilterPricings().addAll(filterPricings);
        }

        return productRepository.save(existingProduct);
    }

    // 4. Remove a product from the vendor's catalog
    @Transactional
    public void removeProductFromCatalog(Long vendorId, String productId) {
        VendorProduct existingProduct = productRepository.findByVendor_VendorIdAndProductId(vendorId, productId)
                .orElseThrow(() -> new RuntimeException("Product not found in vendor's catalog"));

        productRepository.delete(existingProduct);
    }
}