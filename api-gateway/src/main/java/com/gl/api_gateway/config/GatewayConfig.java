package com.gl.api_gateway.config;

import com.gl.api_gateway.filter.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

// You need this new import for the LoadBalancer filter
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
                // 1. Auth route: Empty http() method + lb() filter
                .route(req -> req.path().startsWith("/api/v1/auth"), http())
                .filter(lb("AUTH-SERVICE"))
                .build()

                .and(route("pricing-service")
                        // 2. Pricing route: Empty http() + lb() filter + your JWT filter
                        .route(req -> req.path().startsWith("/api/v1/pricing") || req.path().startsWith("/api/v1/designs"), http())
                        .filter(lb("PRICING-SERVICE"))
                        .filter(jwtFilter.applyFilter()) // Attach custom JWT validation
                        .build());
    }
}