package com.example.library.mapper;

import com.example.library.dto.ProfileRequest;
import com.example.library.dto.ProfileResponse;
import com.example.library.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileResponse toResponse(Profile profile);

    @Mapping(target = "user", ignore = true)
    Profile toEntity(ProfileRequest request);
}
