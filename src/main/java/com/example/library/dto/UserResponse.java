package com.example.library.dto;

import java.util.List;
import java.util.Set;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        boolean enabled,
        Set<String> roles,
        ProfileResponse profile,
        List<BookSummaryResponse> borrowedBooks,
        long activeBorrowCount
) {
}
