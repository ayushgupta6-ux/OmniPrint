package com.gl.api_gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class JwtAuthenticationFilter {

    @Autowired
    private JwtUtil jwtUtil;

    // Standard filter for any logged-in user
    public HandlerFilterFunction<ServerResponse, ServerResponse> applyFilter() {
        return createFilter(false);
    }

    // Strict filter for ADMIN only
    public HandlerFilterFunction<ServerResponse, ServerResponse> applyAdminFilter() {
        return createFilter(true);
    }

    private HandlerFilterFunction<ServerResponse, ServerResponse> createFilter(boolean requireAdmin) {
        return (request, next) -> {

            // 1. Get Authorization Header
            String authHeader = request.headers().firstHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }

            try {
                // 2. Extract Token & Claims
                String token = authHeader.substring(7);
                String userId = jwtUtil.extractUserId(token);
                String role = jwtUtil.extractRole(token);

                // 3. Check for Admin Role if required
                if (requireAdmin && !"ADMIN".equalsIgnoreCase(role)) {
                    return ServerResponse.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
                }

                // 4. Mutate Request to add downstream headers
                ServerRequest modifiedRequest = ServerRequest.from(request)
                        .header("X-User-Id", userId)
                        .header("X-User-Role", role)
                        .build();

                // 5. Continue to the next step
                return next.handle(modifiedRequest);

            } catch (Exception e) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }
        };
    }
}