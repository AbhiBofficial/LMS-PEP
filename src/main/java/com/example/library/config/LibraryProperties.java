package com.example.library.config;

import java.math.BigDecimal;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "library")
public record LibraryProperties(
        int maxBorrowedBooks,
        int loanDays,
        BigDecimal finePerLateDay,
        Jwt jwt
) {
    public record Jwt(
            String secret,
            Duration accessTokenTtl,
            Duration refreshTokenTtl
    ) {
    }
}
