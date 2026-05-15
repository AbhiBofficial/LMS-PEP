package com.example.library.mapper;

import com.example.library.dto.ProfileRequest;
import com.example.library.dto.ProfileResponse;
import com.example.library.entity.Profile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {

    ProfileResponse toResponse(Profile profile);

    Profile toEntity(ProfileRequest request);
}
