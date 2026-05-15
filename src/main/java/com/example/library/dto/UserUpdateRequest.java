package com.example.library.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record UserUpdateRequest(
        @NotBlank @Size(max = 160)
        String fullName,

        Boolean enabled,

        Set<String> roles,

        @Valid
        ProfileRequest profile
) {
}
