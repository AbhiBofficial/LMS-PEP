package com.example.library.service;

import com.example.library.dto.CategoryStatResponse;
import com.example.library.dto.DashboardStatsResponse;
import com.example.library.entity.BorrowStatus;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowHistoryRepository;
import com.example.library.repository.CategoryRepository;
import com.example.library.repository.UserRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowHistoryRepository borrowHistoryRepository;
    private final CategoryRepository categoryRepository;

    @Cacheable("dashboardStats")
    @Transactional(readOnly = true)
    public DashboardStatsResponse stats() {
        return new DashboardStatsResponse(
                bookRepository.count(),
                userRepository.count(),
                borrowHistoryRepository.countByStatus(BorrowStatus.BORROWED),
                borrowHistoryRepository.countByStatusAndDueDateBefore(BorrowStatus.BORROWED, LocalDate.now()),
                categoryRepository.countBooksByCategory().stream()
                        .limit(6)
                        .map(row -> new CategoryStatResponse((String) row[0], (Long) row[1]))
                        .toList()
        );
    }
}
