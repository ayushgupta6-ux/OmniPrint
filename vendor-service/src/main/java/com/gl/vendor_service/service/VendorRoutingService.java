package com.gl.vendor_service.service;

import com.gl.vendor_service.dto.NearestVendorResponse;
import com.gl.vendor_service.dto.QuoteRequestDTO;
import com.gl.vendor_service.dto.QuoteResponseDTO;
import com.gl.vendor_service.entity.VendorDiscountTier;
import com.gl.vendor_service.entity.VendorFilterPricing;
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
    private static final double MAX_RADIUS_KM = 1000.0; // Vendors must be within 30km

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

    public QuoteResponseDTO calculateBestQuote(QuoteRequestDTO request) {
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        List<VendorProduct> availableVendors = vendorProductRepository.findActiveVendorsByProductId(request.getProductId());

        if (availableVendors.isEmpty()) {
            throw new RuntimeException("No active vendors found for product: " + request.getProductId());
        }

        QuoteResponseDTO bestQuote = null;

        for (VendorProduct vp : availableVendors) {
            // 1. Calculate Distance
            double distance = calculateHaversineDistance(
                    request.getLat(), request.getLng(),
                    vp.getVendor().getLatitude(), vp.getVendor().getLongitude()
            );

            System.out.println("DEBUG: Vendor ID = " + vp.getVendor().getVendorId());
            System.out.println("DEBUG: Distance = " + distance + " km");
            System.out.println("DEBUG: Vendor Offers Install? = " + vp.getOffersInstallation());
            System.out.println("DEBUG: Client Needs Install? = " + request.getNeedsInstallation());

            if (distance > MAX_RADIUS_KM) {
                System.out.println("DEBUG: Failed Distance Check");
                continue;
            }

            // 2. Check Installation Capability
            BigDecimal installFee = BigDecimal.ZERO;
            if (Boolean.TRUE.equals(request.getNeedsInstallation())) {
                if (!Boolean.TRUE.equals(vp.getOffersInstallation())) {
                    continue; // Skip this vendor, they don't offer installation
                }
                installFee = vp.getInstallationFee() != null ? vp.getInstallationFee() : BigDecimal.ZERO;
            }

            // 3. Calculate Base Price + Filter Surcharges
            BigDecimal adjustedBasePrice = vp.getVendorPrice();
            if (request.getSelectedFilters() != null && vp.getFilterPricings() != null) {
                for (VendorFilterPricing filterPrice : vp.getFilterPricings()) {
                    String clientSelectedOption = request.getSelectedFilters().get(filterPrice.getFilterLabel());
                    if (clientSelectedOption != null && clientSelectedOption.equalsIgnoreCase(filterPrice.getOptionName())) {
                        adjustedBasePrice = adjustedBasePrice.add(filterPrice.getAdditionalPrice());
                    }
                }
            }

            // 4. Calculate Volume Discount
            BigDecimal discountPercentage = calculateDiscountPercentage(vp, request.getQuantity());
            BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
                    discountPercentage.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
            );

            // 5. Finalize Math
            BigDecimal finalUnitPrice = adjustedBasePrice.multiply(discountMultiplier).setScale(2, RoundingMode.HALF_UP);
            BigDecimal itemsTotal = finalUnitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));
            BigDecimal grandTotal = itemsTotal.add(installFee).setScale(2, RoundingMode.HALF_UP);

            // 6. Compare to find the CHEAPEST vendor (If tied, nearest wins)
            if (bestQuote == null ||
                    grandTotal.compareTo(bestQuote.getTotalAmount()) < 0 ||
                    (grandTotal.compareTo(bestQuote.getTotalAmount()) == 0 && distance < bestQuote.getDistanceKm())) {

                bestQuote = QuoteResponseDTO.builder()
                        .vendorId(vp.getVendor().getVendorId())
                        .agencyName(vp.getVendor().getAgencyName())
                        .quantity(request.getQuantity())
                        .baseUnitPrice(adjustedBasePrice)
                        .discountPercentage(discountPercentage)
                        .finalUnitPrice(finalUnitPrice)
                        .installationFee(installFee)
                        .totalAmount(grandTotal)
                        .distanceKm(Math.round(distance * 100.0) / 100.0)
                        .build();
            }
        }

        if (bestQuote == null) {
            throw new RuntimeException("No vendors found within " + MAX_RADIUS_KM + "km that meet your configuration.");
        }

        return bestQuote;
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