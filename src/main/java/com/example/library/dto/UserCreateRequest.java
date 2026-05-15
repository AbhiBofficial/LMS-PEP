package com.example.library.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record UserCreateRequest(
        @Email @NotBlank
        String email,

        @NotBlank @Size(min = 8, max = 80)
        String password,

        @NotBlank @Size(max = 160)
        String fullName,

        @NotEmpty
        Set<String> roles,

        @Valid
        ProfileRequest profile
) {
}
