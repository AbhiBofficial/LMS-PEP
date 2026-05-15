package com.example.library.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @NotBlank @Size(max = 160)
        String fullName,

        @Valid
        ProfileRequest profile
) {
}
