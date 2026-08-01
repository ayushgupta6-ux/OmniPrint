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

    public HandlerFilterFunction<ServerResponse, ServerResponse> applyFilter() {
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

                // 3. Mutate Request to add downstream headers
                ServerRequest modifiedRequest = ServerRequest.from(request)
                        .header("X-User-Id", userId)
                        .header("X-User-Role", role)
                        .build();

                // 4. Continue to the next step
                return next.handle(modifiedRequest);

            } catch (Exception e) {
                return ServerResponse.status(HttpStatus.UNAUTHORIZED).build();
            }
        };
    }
}