package com.example.library.dto;

import java.util.List;

public record DashboardStatsResponse(
        long bookCount,
        long userCount,
        long activeBorrowCount,
        long overdueBorrowCount,
        List<CategoryStatResponse> popularCategories
) {
}
