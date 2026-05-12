package com.example.library.service;

import com.example.library.dto.AuthorResponse;
import com.example.library.dto.BookResponse;
import com.example.library.dto.BookSummaryResponse;
import com.example.library.dto.CategoryResponse;
import com.example.library.dto.ProfileResponse;
import com.example.library.dto.UserResponse;
import com.example.library.dto.UserSummaryResponse;
import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.Category;
import com.example.library.entity.Profile;
import com.example.library.entity.User;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class ApiMapper {

    private ApiMapper() {
    }

    public static UserResponse toUserResponse(User user) {
        List<BookSummaryResponse> borrowedBooks = user.getBorrowedBooks().stream()
                .sorted(Comparator.comparing(Book::getId))
                .map(ApiMapper::toBookSummary)
                .toList();

        return new UserResponse(user.getId(), user.getName(), toProfileResponse(user.getProfile()), borrowedBooks);
    }

    public static UserSummaryResponse toUserSummary(User user) {
        if (user == null) {
            return null;
        }

        return new UserSummaryResponse(user.getId(), user.getName());
    }

    public static ProfileResponse toProfileResponse(Profile profile) {
        if (profile == null) {
            return null;
        }

        return new ProfileResponse(profile.getId(), profile.getEmail(), profile.getPhone(), profile.getAddress());
    }

    public static BookResponse toBookResponse(Book book) {
        Set<CategoryResponse> categories = book.getCategories().stream()
                .sorted(Comparator.comparing(Category::getId))
                .map(ApiMapper::toCategoryResponse)
                .collect(Collectors.toCollection(java.util.LinkedHashSet::new));

        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getIsbn(),
                toAuthorResponse(book.getAuthor()),
                categories,
                toUserSummary(book.getBorrowedBy())
        );
    }

    public static BookSummaryResponse toBookSummary(Book book) {
        return new BookSummaryResponse(book.getId(), book.getTitle(), book.getIsbn());
    }

    public static AuthorResponse toAuthorResponse(Author author) {
        return new AuthorResponse(author.getId(), author.getName(), author.getBio());
    }

    public static CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
