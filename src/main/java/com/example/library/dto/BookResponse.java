package com.example.library.dto;

import java.util.Set;

public record BookResponse(
        Long id,
        String title,
        String isbn,
        AuthorResponse author,
        Set<CategoryResponse> categories,
        UserSummaryResponse borrowedBy
) {
}
