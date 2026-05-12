package com.example.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record BookRequest(
        @NotBlank String title,
        @NotBlank String isbn,
        @NotNull Long authorId,
        @NotEmpty Set<Long> categoryIds
) {
}
