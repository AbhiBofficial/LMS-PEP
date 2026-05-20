package com.example.library.mapper;

import com.example.library.dto.CategoryRequest;
import com.example.library.dto.CategoryResponse;
import com.example.library.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "bookCount", expression = "java(category.getBooks() == null ? 0 : category.getBooks().size())")
    CategoryResponse toResponse(Category category);

    @Mapping(target = "description", ignore = true)
    @Mapping(target = "books", ignore = true)
    Category toEntity(CategoryRequest request);
}
