package com.example.library.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email @NotBlank
        String email,

        @NotBlank @Size(min = 8, max = 80)
        String password,

        @NotBlank @Size(max = 160)
        String fullName,

        @Valid
        ProfileRequest profile
) {
}
