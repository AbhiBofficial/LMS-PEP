package com.example.library.repository;

import com.example.library.entity.BorrowHistory;
import com.example.library.entity.BorrowStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface BorrowHistoryRepository extends JpaRepository<BorrowHistory, Long> {

    long countByUserIdAndStatus(Long userId, BorrowStatus status);

    long countByStatus(BorrowStatus status);

    long countByStatusAndDueDateBefore(BorrowStatus status, LocalDate date);

    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, BorrowStatus status);

    @EntityGraph(attributePaths = {"user", "book", "book.author", "book.categories"})
    Optional<BorrowHistory> findFirstByUserIdAndBookIdAndStatusOrderByBorrowedAtDesc(Long userId, Long bookId, BorrowStatus status);

    @EntityGraph(attributePaths = {"user", "book", "book.author", "book.categories"})
    List<BorrowHistory> findByBookIdAndStatus(Long bookId, BorrowStatus status);

    @EntityGraph(attributePaths = {"user", "book", "book.author", "book.categories"})
    Page<BorrowHistory> findByUserId(Long userId, Pageable pageable);

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"user", "book", "book.author", "book.categories"})
    Page<BorrowHistory> findAll(@NonNull Pageable pageable);
}

