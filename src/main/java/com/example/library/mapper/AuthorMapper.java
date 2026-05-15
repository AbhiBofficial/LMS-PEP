package com.example.library.mapper;

import com.example.library.dto.AuthorRequest;
import com.example.library.dto.AuthorResponse;
import com.example.library.entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    @Mapping(target = "bookCount", expression = "java(author.getBooks() == null ? 0 : author.getBooks().size())")
    AuthorResponse toResponse(Author author);

    Author toEntity(AuthorRequest request);
}
