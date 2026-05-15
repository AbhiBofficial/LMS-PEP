package com.example.library.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BorrowHistoryResponse(
        Long id,
        UserSummaryResponse user,
        BookSummaryResponse book,
        LocalDate borrowedAt,
        LocalDate dueDate,
        LocalDate returnedAt,
        BigDecimal fineAmount,
        String status
) {
}
