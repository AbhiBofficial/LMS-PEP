package com.example.library.controller;

import com.example.library.dto.BorrowHistoryResponse;
import com.example.library.dto.PageResponse;
import com.example.library.service.BorrowHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/borrow-history")
public class BorrowHistoryController {

    private final BorrowHistoryService borrowHistoryService;

    @GetMapping
    public PageResponse<BorrowHistoryResponse> list(
            @RequestParam(required = false) Long userId,
            Authentication authentication,
            @PageableDefault(size = 20, sort = "borrowedAt") Pageable pageable
    ) {
        return borrowHistoryService.list(userId, authentication, pageable);
    }
}
