package com.example.library.dto;

import java.time.LocalDate;

public record ProfileResponse(
        Long id,
        String phone,
        String address,
        LocalDate dateOfBirth,
        String avatarUrl
) {
}
