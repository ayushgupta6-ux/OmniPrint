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

                .and(route("pricing-service")
                        .route(req -> req.path().startsWith("/api/v1/pricing") || req.path().startsWith("/api/v1/designs"), http())
                        .filter(lb("PRICING-SERVICE"))
                        .filter(jwtFilter.applyFilter())
                        .build())

                // --- NEW ROUTES FOR PRODUCT SERVICE ---

                // 1. PUBLIC Route: No JWT filter applied
                .and(route("product-service-public")
                        .route(req -> req.path().startsWith("/api/products"), http())
                        .filter(lb("PRODUCT-SERVICE"))
                        .build())

                // 2. ADMIN Route: strict applyAdminFilter() applied
                .and(route("product-service-admin")
                        .route(req -> req.path().startsWith("/api/admin/products"), http())
                        .filter(lb("PRODUCT-SERVICE"))
                        .filter(jwtFilter.applyAdminFilter()) // <-- Blocks non-admins
                        .build());
    }
}