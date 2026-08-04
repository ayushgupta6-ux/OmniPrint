package com.gl.api_gateway.config;

import com.gl.api_gateway.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;

@Configuration
public class GatewayConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes() {
        return route("auth-service")
                .route(req -> req.path().startsWith("/api/v1/auth"), http())
                .filter(lb("AUTH-SERVICE"))
                .build()


                // 1. PRODUCT PUBLIC Route
                .and(route("product-service-public")
                        .route(req -> req.path().startsWith("/api/products"), http())
                        .filter(lb("PRODUCT-SERVICE"))
                        .build())

                // 2. PRODUCT ADMIN Route
                .and(route("product-service-admin")
                        .route(req -> req.path().startsWith("/api/admin/products"), http())
                        .filter(lb("PRODUCT-SERVICE"))
                        .filter(jwtFilter.applyAdminFilter())
                        .build())

                // --- 3. NEW VENDOR Route ---
                .and(route("vendor-service-nearest")
                        .route(req -> req.path().startsWith("/api/vendors/nearest"), http())
                        .filter(lb("VENDOR-SERVICE"))
                        .filter(jwtFilter.applyFilter()) // Standard filter: Any logged-in user can access this
                        .build())

                .and(route("vendor-service")
                        .route(req -> req.path().startsWith("/api/vendors"), http())
                        .filter(lb("VENDOR-SERVICE"))
                        .filter(jwtFilter.applyVendorFilter()) // <-- Blocks anyone who is not a PRINT_AGENCY
                        .build())

                .and(route("order-service")
                        .route(req -> req.path().startsWith("/api/orders"), http())
                        .filter(lb("ORDER-SERVICE"))
                        .filter(jwtFilter.applyFilter()) // <-- Allows any logged-in user, injects X-User-Id
                        .build());
    }
}