package com.example.library.dto;

public record AuthorResponse(
        Long id,
        String name,
        String bio,
        int bookCount
) {
}
