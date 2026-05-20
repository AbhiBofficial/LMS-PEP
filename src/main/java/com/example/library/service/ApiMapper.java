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

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.isEnabled(),
                user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toCollection(java.util.TreeSet::new)),
                toProfileResponse(user.getProfile()),
                borrowedBooks,
                user.getBorrowHistory().stream().filter(history -> history.getStatus() == com.example.library.entity.BorrowStatus.BORROWED).count()
        );
    }

    public static UserSummaryResponse toUserSummary(User user) {
        if (user == null) {
            return null;
        }

        return new UserSummaryResponse(user.getId(), user.getEmail(), user.getFullName());
    }

    public static ProfileResponse toProfileResponse(Profile profile) {
        if (profile == null) {
            return null;
        }

        return new ProfileResponse(
                profile.getId(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getDateOfBirth(),
                profile.getAvatarUrl()
        );
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
                book.getDescription(),
                book.getPublicationYear(),
                book.getTotalCopies(),
                book.getAvailableCopies(),
                book.getShelfLocation(),
                toAuthorResponse(book.getAuthor()),
                categories,
                toUserSummary(book.getBorrowedBy())
        );
    }

    public static BookSummaryResponse toBookSummary(Book book) {
        return new BookSummaryResponse(book.getId(), book.getTitle(), book.getIsbn(), book.getAvailableCopies() == null ? 0 : book.getAvailableCopies());
    }

    public static AuthorResponse toAuthorResponse(Author author) {
        return new AuthorResponse(author.getId(), author.getName(), author.getBiography(), author.getBooks().size());
    }

    public static CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription(), category.getBooks().size());
    }
}
