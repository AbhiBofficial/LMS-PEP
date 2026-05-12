package com.example.library.dto;

public record ProfileResponse(
        Long id,
        String email,
        String phone,
        String address
) {
}
