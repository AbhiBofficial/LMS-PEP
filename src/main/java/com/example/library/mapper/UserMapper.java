package com.example.library.mapper;

import com.example.library.dto.BookSummaryResponse;
import com.example.library.dto.ProfileResponse;
import com.example.library.dto.UserResponse;
import com.example.library.dto.UserSummaryResponse;
import com.example.library.entity.Book;
import com.example.library.entity.BorrowStatus;
import com.example.library.entity.Role;
import com.example.library.entity.User;
import java.util.Comparator;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    default UserSummaryResponse toSummary(User user) {
        if (user == null) {
            return null;
        }
        return new UserSummaryResponse(user.getId(), user.getEmail(), user.getFullName());
    }

    default UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        ProfileResponse profile = user.getProfile() == null
                ? null
                : new ProfileResponse(
                        user.getProfile().getId(),
                        user.getProfile().getPhone(),
                        user.getProfile().getAddress(),
                        user.getProfile().getDateOfBirth(),
                        user.getProfile().getAvatarUrl());
        Set<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toCollection(java.util.TreeSet::new));
        Set<BookSummaryResponse> borrowedBooks = user.getBorrowedBooks().stream()
                .sorted(Comparator.comparing(Book::getTitle))
                .map(book -> new BookSummaryResponse(book.getId(), book.getTitle(), book.getIsbn(), book.getAvailableCopies()))
                .collect(Collectors.toCollection(java.util.LinkedHashSet::new));
        long activeBorrowCount = user.getBorrowHistory().stream()
                .filter(history -> history.getStatus() == BorrowStatus.BORROWED)
                .count();
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.isEnabled(),
                roles,
                profile,
                borrowedBooks,
                activeBorrowCount
        );
    }
}
