package com.example.library.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record ProfileRequest(
        @NotBlank String phone,
        @NotBlank String address,
        LocalDate dateOfBirth,
        String avatarUrl
) {
}
