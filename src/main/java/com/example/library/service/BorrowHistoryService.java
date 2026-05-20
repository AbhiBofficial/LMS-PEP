package com.example.library.service;

import com.example.library.dto.BorrowHistoryResponse;
import com.example.library.dto.PageResponse;
import com.example.library.entity.User;
import com.example.library.mapper.BorrowHistoryMapper;
import com.example.library.repository.BorrowHistoryRepository;
import com.example.library.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@SuppressWarnings("null")
@Service
@RequiredArgsConstructor
public class BorrowHistoryService {

    private final BorrowHistoryRepository borrowHistoryRepository;
    private final BorrowHistoryMapper borrowHistoryMapper;
    private final UserService userService;

    @Transactional(readOnly = true)
    public PageResponse<BorrowHistoryResponse> list(Long userId, Authentication authentication, Pageable pageable) {
        boolean staff = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN") || authority.getAuthority().equals("ROLE_LIBRARIAN"));
        Long effectiveUserId = userId;
        if (!staff) {
            User current = userService.findByEmail(authentication.getName());
            effectiveUserId = current.getId();
        }
        if (effectiveUserId == null) {
            return PageUtils.toResponse(borrowHistoryRepository.findAll(pageable), borrowHistoryMapper::toResponse);
        }
        return PageUtils.toResponse(borrowHistoryRepository.findByUserId(effectiveUserId, pageable), borrowHistoryMapper::toResponse);
    }
}
