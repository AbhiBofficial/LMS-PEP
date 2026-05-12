package com.example.library.dto;

public record BookSummaryResponse(
        Long id,
        String title,
        String isbn
) {
}
