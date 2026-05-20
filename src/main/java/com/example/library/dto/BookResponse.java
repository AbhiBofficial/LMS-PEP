package com.example.library.dto;

import java.util.Set;

public record BookResponse(
        Long id,
        String title,
        String isbn,
        String description,
        Integer publicationYear,
        Integer totalCopies,
        Integer availableCopies,
        String shelfLocation,
        AuthorResponse author,
        Set<CategoryResponse> categories,
        UserSummaryResponse borrowedBy
) {
}
