package com.example.library.service;

import com.example.library.dto.BookRequest;
import com.example.library.dto.BookResponse;
import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.Category;
import com.example.library.entity.User;
import com.example.library.exception.BadRequestException;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.repository.BookRepository;
import com.example.library.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorService authorService;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public BookService(
            BookRepository bookRepository,
            AuthorService authorService,
            CategoryRepository categoryRepository,
            UserService userService
    ) {
        this.bookRepository = bookRepository;
        this.authorService = authorService;
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }

    public BookResponse create(BookRequest request) {
        Author author = authorService.getAuthor(request.authorId());
        Set<Category> categories = getCategories(request.categoryIds());

        Book book = new Book();
        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setAuthor(author);
        book.setCategories(categories);

        return ApiMapper.toBookResponse(bookRepository.save(book));
    }

    @Transactional(readOnly = true)
    public List<BookResponse> findAll() {
        return bookRepository.findAll().stream()
                .map(ApiMapper::toBookResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponse findById(Long id) {
        return ApiMapper.toBookResponse(getBook(id));
    }

    public BookResponse borrow(Long bookId, Long userId) {
        Book book = getBook(bookId);
        if (book.getBorrowedBy() != null) {
            throw new BadRequestException("Book is already borrowed by user " + book.getBorrowedBy().getId());
        }

        User user = userService.getUser(userId);
        book.setBorrowedBy(user);

        return ApiMapper.toBookResponse(book);
    }

    public BookResponse returnBook(Long bookId) {
        Book book = getBook(bookId);
        if (book.getBorrowedBy() == null) {
            throw new BadRequestException("Book is not currently borrowed");
        }

        book.setBorrowedBy(null);

        return ApiMapper.toBookResponse(book);
    }

    public Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
    }

    private Set<Category> getCategories(Set<Long> categoryIds) {
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        if (categories.size() != categoryIds.size()) {
            throw new ResourceNotFoundException("One or more categories were not found");
        }

        return new LinkedHashSet<>(categories);
    }
}
