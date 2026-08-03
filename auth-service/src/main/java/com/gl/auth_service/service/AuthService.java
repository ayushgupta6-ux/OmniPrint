package com.gl.auth_service.service;


import com.gl.auth_service.DTO.AuthResponse;
import com.gl.auth_service.DTO.LoginRequestDto;
import com.gl.auth_service.DTO.RegisterRequestDto;
import com.gl.auth_service.entity.Role;
import com.gl.auth_service.entity.User;
import com.gl.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;


    public void register(RegisterRequestDto registerDto){
        // 1. Check if user with this email already exists
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // 2. Map DTO to User Entity
        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setNumber(registerDto.getNumber());

        // Hash the raw password before saving
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        // Default to CLIENT if role is not supplied
        if (registerDto.getRole() == null) {
            user.setRole(Role.CLIENT);
        } else {
            user.setRole(registerDto.getRole());
        }

        // 3. Save user to database
        userRepository.save(user);
    }


    public AuthResponse Login(LoginRequestDto loginDto){
        // 1. Fetch user by email from database
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // 2. Verify password match
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // 3. Generate JWT Token (convert ID to String for JWT claims)
        String token = jwtService.generateToken(
                user.getEmail(),
                String.valueOf(user.getId()),
                user.getRole().name(),
                user.getName()
        );

        return new AuthResponse(token,"Login successfully for "+user.getName());


    }

}
