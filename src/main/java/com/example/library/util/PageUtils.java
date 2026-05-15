package com.example.library.util;

import com.example.library.dto.PageResponse;
import java.util.function.Function;
import org.springframework.data.domain.Page;

public final class PageUtils {

    private PageUtils() {
    }

    public static <T, R> PageResponse<R> toResponse(Page<T> page, Function<T, R> mapper) {
        return new PageResponse<>(
                page.getContent().stream().map(mapper).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
