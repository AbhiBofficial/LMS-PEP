package com.example.library.dto;

import java.time.Instant;
import java.util.Set;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Instant accessTokenExpiresAt,
        UserSummaryResponse user,
        Set<String> roles
) {
}
