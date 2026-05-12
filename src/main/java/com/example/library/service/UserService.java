package com.example.library.service;

import com.example.library.dto.ProfileRequest;
import com.example.library.dto.UserRequest;
import com.example.library.dto.UserResponse;
import com.example.library.entity.Book;
import com.example.library.entity.Profile;
import com.example.library.entity.User;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.repository.BookRepository;
import com.example.library.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public UserService(UserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public UserResponse create(UserRequest request) {
        User user = new User();
        user.setName(request.name());
        user.setProfile(toProfile(request.profile()));

        return ApiMapper.toUserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(ApiMapper::toUserResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return ApiMapper.toUserResponse(getUser(id));
    }

    public UserResponse update(Long id, UserRequest request) {
        User user = getUser(id);
        user.setName(request.name());

        Profile profile = user.getProfile();
        ProfileRequest profileRequest = request.profile();
        profile.setEmail(profileRequest.email());
        profile.setPhone(profileRequest.phone());
        profile.setAddress(profileRequest.address());

        return ApiMapper.toUserResponse(user);
    }

    public void delete(Long id) {
        User user = getUser(id);
        for (Book book : bookRepository.findByBorrowedById(id)) {
            book.setBorrowedBy(null);
        }
        userRepository.delete(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    private Profile toProfile(ProfileRequest request) {
        Profile profile = new Profile();
        profile.setEmail(request.email());
        profile.setPhone(request.phone());
        profile.setAddress(request.address());

        return profile;
    }
}
