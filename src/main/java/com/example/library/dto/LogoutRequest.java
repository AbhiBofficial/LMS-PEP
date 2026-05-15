package com.example.library.dto;

import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(
        @NotBlank
        String refreshToken
) {
}
