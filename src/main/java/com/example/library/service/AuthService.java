package com.example.library.service;

import com.example.library.config.LibraryProperties;
import com.example.library.dto.AuthResponse;
import com.example.library.dto.LoginRequest;
import com.example.library.dto.LogoutRequest;
import com.example.library.dto.ProfileRequest;
import com.example.library.dto.RefreshRequest;
import com.example.library.dto.RegisterRequest;
import com.example.library.dto.UserSummaryResponse;
import com.example.library.entity.AuditAction;
import com.example.library.entity.Profile;
import com.example.library.entity.RefreshToken;
import com.example.library.entity.Role;
import com.example.library.entity.User;
import com.example.library.exception.BadRequestException;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.exception.UnauthorizedException;
import com.example.library.repository.RefreshTokenRepository;
import com.example.library.repository.RoleRepository;
import com.example.library.repository.UserRepository;
import com.example.library.security.JwtService;
import com.example.library.util.HashingUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final LibraryProperties properties;
    private final AuditLogService auditLogService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest servletRequest) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("Email is already registered");
        }
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default USER role is missing"));

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName().trim())
                .enabled(true)
                .roles(Set.of(userRole))
                .build();
        user.attachProfile(toProfile(request.profile()));
        User saved = userRepository.save(user);

        log.info("Registered user {}", saved.getEmail());
        auditLogService.record(saved.getEmail(), AuditAction.AUTH_REGISTER, "User", saved.getId(), "User registered", clientIp(servletRequest));
        return issueTokens(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest servletRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        log.info("User {} logged in", user.getEmail());
        auditLogService.record(user.getEmail(), AuditAction.AUTH_LOGIN, "User", user.getId(), "User logged in", clientIp(servletRequest));
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request, HttpServletRequest servletRequest) {
        String hash = HashingUtils.sha256(request.refreshToken());
        RefreshToken existing = refreshTokenRepository.findByTokenHashAndRevokedFalse(hash)
                .orElseThrow(() -> new UnauthorizedException("Refresh token is invalid"));
        if (existing.getExpiresAt().isBefore(Instant.now())) {
            existing.setRevoked(true);
            throw new UnauthorizedException("Refresh token has expired");
        }
        existing.setRevoked(true);
        User user = existing.getUser();
        auditLogService.record(user.getEmail(), AuditAction.TOKEN_REFRESH, "User", user.getId(), "Refresh token rotated", clientIp(servletRequest));
        return issueTokens(user);
    }

    @Transactional
    public void logout(LogoutRequest request, HttpServletRequest servletRequest) {
        refreshTokenRepository.findByTokenHashAndRevokedFalse(HashingUtils.sha256(request.refreshToken()))
                .ifPresent(token -> {
                    token.setRevoked(true);
                    auditLogService.record(token.getUser().getEmail(), AuditAction.AUTH_LOGOUT, "User", token.getUser().getId(), "User logged out", clientIp(servletRequest));
                    log.info("User {} logged out", token.getUser().getEmail());
                });
    }

    private AuthResponse issueTokens(User user) {
        UserDetails details = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtService.generateAccessToken(details);
        String refreshToken = newRefreshToken();
        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .tokenHash(HashingUtils.sha256(refreshToken))
                .expiresAt(Instant.now().plus(properties.jwt().refreshTokenTtl()))
                .revoked(false)
                .build());
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtService.accessTokenExpiresAt(),
                new UserSummaryResponse(user.getId(), user.getEmail(), user.getFullName()),
                roles
        );
    }

    private String newRefreshToken() {
        byte[] bytes = new byte[64];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private Profile toProfile(ProfileRequest request) {
        Profile profile = new Profile();
        if (request != null) {
            profile.setPhone(request.phone());
            profile.setAddress(request.address());
            profile.setDateOfBirth(request.dateOfBirth());
            profile.setAvatarUrl(request.avatarUrl());
        }
        return profile;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
