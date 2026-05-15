package com.example.library.mapper;

import com.example.library.dto.AuthorResponse;
import com.example.library.dto.BookResponse;
import com.example.library.dto.BookSummaryResponse;
import com.example.library.dto.CategoryResponse;
import com.example.library.dto.UserSummaryResponse;
import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.Category;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookMapper {

    default BookSummaryResponse toSummary(Book book) {
        if (book == null) {
            return null;
        }
        return new BookSummaryResponse(book.getId(), book.getTitle(), book.getIsbn(), book.getAvailableCopies());
    }

    default BookResponse toResponse(Book book) {
        if (book == null) {
            return null;
        }
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getIsbn(),
                book.getDescription(),
                book.getPublicationYear(),
                book.getTotalCopies(),
                book.getAvailableCopies(),
                book.getShelfLocation(),
                toAuthor(book.getAuthor()),
                toCategories(book.getCategories()),
                book.getCurrentBorrower() == null
                        ? null
                        : new UserSummaryResponse(
                                book.getCurrentBorrower().getId(),
                                book.getCurrentBorrower().getEmail(),
                                book.getCurrentBorrower().getFullName())
        );
    }

    default AuthorResponse toAuthor(Author author) {
        if (author == null) {
            return null;
        }
        int bookCount = author.getBooks() == null ? 0 : author.getBooks().size();
        return new AuthorResponse(author.getId(), author.getName(), author.getBiography(), bookCount);
    }

    default Set<CategoryResponse> toCategories(Set<Category> categories) {
        if (categories == null) {
            return Set.of();
        }
        return categories.stream()
                .sorted(Comparator.comparing(Category::getName))
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getDescription(),
                        category.getBooks() == null ? 0 : category.getBooks().size()))
                .collect(Collectors.toCollection(java.util.LinkedHashSet::new));
    }
}
