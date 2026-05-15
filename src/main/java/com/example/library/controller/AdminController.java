package com.example.library.controller;

import com.example.library.repository.RoleRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final RoleRepository roleRepository;

    @GetMapping("/roles")
    public List<String> roles() {
        return roleRepository.findAll().stream()
                .map(role -> role.getName())
                .sorted()
                .toList();
    }
}
