package com.example.library.controller;

import com.example.library.dto.ProfileUpdateRequest;
import com.example.library.dto.UserResponse;
import com.example.library.mapper.UserMapper;
import com.example.library.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return userMapper.toResponse(userService.findByEmail(authentication.getName()));
    }

    @PutMapping("/me")
    public UserResponse update(@Valid @RequestBody ProfileUpdateRequest request, Authentication authentication) {
        return userService.updateOwnProfile(authentication.getName(), request);
    }
}
