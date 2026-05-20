package com.example.library.dto;

public record UserSummaryResponse(
        Long id,
        String email,
        String name
) {
}
