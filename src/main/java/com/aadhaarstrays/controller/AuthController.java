package com.aadhaarstrays.controller;

import com.aadhaarstrays.dto.ApiResponse;
import com.aadhaarstrays.dto.AuthDto;
import com.aadhaarstrays.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> login(
            @Valid @RequestBody AuthDto.LoginRequest req) {
        AuthDto.AuthResponse res = authService.login(req);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", res));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponse>> register(
            @Valid @RequestBody AuthDto.RegisterRequest req) {
        AuthDto.AuthResponse res = authService.register(req);
        return ResponseEntity.status(201).body(ApiResponse.ok("Registration successful", res));
    }
}
