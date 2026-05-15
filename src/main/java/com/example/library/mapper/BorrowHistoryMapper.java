package com.example.library.mapper;

import com.example.library.dto.BookSummaryResponse;
import com.example.library.dto.BorrowHistoryResponse;
import com.example.library.dto.UserSummaryResponse;
import com.example.library.entity.BorrowHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BorrowHistoryMapper {

    default BorrowHistoryResponse toResponse(BorrowHistory history) {
        if (history == null) {
            return null;
        }
        return new BorrowHistoryResponse(
                history.getId(),
                new UserSummaryResponse(
                        history.getUser().getId(),
                        history.getUser().getEmail(),
                        history.getUser().getFullName()),
                new BookSummaryResponse(
                        history.getBook().getId(),
                        history.getBook().getTitle(),
                        history.getBook().getIsbn(),
                        history.getBook().getAvailableCopies()),
                history.getBorrowedAt(),
                history.getDueDate(),
                history.getReturnedAt(),
                history.getFineAmount(),
                history.getStatus().name()
        );
    }
}
