package com.example.library.dto;

import java.util.List;

public record UserResponse(
        Long id,
        String name,
        ProfileResponse profile,
        List<BookSummaryResponse> borrowedBooks
) {
}
