package com.example.library.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.example.library.validation.ValidIsbn;
import java.util.Set;

public record BookCreateRequest(
        @NotBlank @Size(max = 220)
        String title,

        @NotBlank @Size(max = 32) @ValidIsbn
        String isbn,

        @Size(max = 2000)
        String description,

        @Min(1000) @Max(3000)
        Integer publicationYear,

        @NotNull @Min(1)
        Integer totalCopies,

        @Size(max = 80)
        String shelfLocation,

        @NotNull
        Long authorId,

        Set<Long> categoryIds
) {
}
