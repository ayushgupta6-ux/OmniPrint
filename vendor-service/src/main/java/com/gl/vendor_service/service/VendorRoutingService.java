package com.gl.vendor_service.service;

import com.gl.vendor_service.dto.NearestVendorResponse;
import com.gl.vendor_service.entity.VendorDiscountTier;
import com.gl.vendor_service.entity.VendorProduct;
import com.gl.vendor_service.repository.VendorProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class VendorRoutingService {

    private final VendorProductRepository vendorProductRepository;
    private static final int EARTH_RADIUS_KM = 6371;

    public VendorRoutingService(VendorProductRepository vendorProductRepository) {
        this.vendorProductRepository = vendorProductRepository;
    }

    public NearestVendorResponse findNearestVendor(String productId, double clientLat, double clientLng, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        List<VendorProduct> availableVendors = vendorProductRepository.findActiveVendorsByProductId(productId);

        if (availableVendors.isEmpty()) {
            throw new RuntimeException("No active vendors found for product: " + productId);
        }

        VendorProduct nearestProduct = null;
        double shortestDistance = Double.MAX_VALUE;

        // 1. Find the nearest vendor offering this product
        for (VendorProduct vp : availableVendors) {
            double vendorLat = vp.getVendor().getLatitude();
            double vendorLng = vp.getVendor().getLongitude();

            double distance = calculateHaversineDistance(clientLat, clientLng, vendorLat, vendorLng);

            if (distance < shortestDistance) {
                shortestDistance = distance;
                nearestProduct = vp;
            }
        }

        // 2. Calculate volume discount for the nearest vendor
        BigDecimal baseUnitPrice = nearestProduct.getVendorPrice();
        BigDecimal discountPercentage = calculateDiscountPercentage(nearestProduct, quantity);

        // finalUnitPrice = baseUnitPrice * (1 - discountPercentage / 100)
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                discountPercentage.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
        );
        BigDecimal finalUnitPrice = baseUnitPrice.multiply(discountMultiplier).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = finalUnitPrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);

        // 3. Build and return response
        return NearestVendorResponse.builder()
                .vendorId(nearestProduct.getVendor().getVendorId())
                .agencyName(nearestProduct.getVendor().getAgencyName())
                .address(nearestProduct.getVendor().getAddress())
                .distanceKm(Math.round(shortestDistance * 100.0) / 100.0)
                .quantity(quantity)
                .baseUnitPrice(baseUnitPrice)
                .discountPercentage(discountPercentage)
                .finalUnitPrice(finalUnitPrice)
                .totalAmount(totalAmount)
                .build();
    }

    // Helper: Finds applicable discount percentage based on quantity
    private BigDecimal calculateDiscountPercentage(VendorProduct vp, int quantity) {
        if (vp.getDiscountTiers() == null || vp.getDiscountTiers().isEmpty()) {
            return BigDecimal.ZERO;
        }

        for (VendorDiscountTier tier : vp.getDiscountTiers()) {
            boolean matchesMin = quantity >= tier.getMinQuantity();
            boolean matchesMax = (tier.getMaxQuantity() == null) || (quantity <= tier.getMaxQuantity());

            if (matchesMin && matchesMax) {
                return tier.getDiscountPercentage();
            }
        }

        return BigDecimal.ZERO;
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}