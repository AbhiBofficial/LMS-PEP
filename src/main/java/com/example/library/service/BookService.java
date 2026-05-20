package com.example.library.service;

import com.example.library.config.LibraryProperties;
import com.example.library.dto.BookRequest;
import com.example.library.dto.BookResponse;
import com.example.library.dto.BorrowHistoryResponse;
import com.example.library.entity.AuditAction;
import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.BorrowHistory;
import com.example.library.entity.BorrowStatus;
import com.example.library.entity.Category;
import com.example.library.entity.User;
import com.example.library.exception.BadRequestException;
import com.example.library.exception.BusinessRuleException;
import com.example.library.exception.ResourceNotFoundException;
import com.example.library.mapper.BookMapper;
import com.example.library.mapper.BorrowHistoryMapper;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@SuppressWarnings("null")
@Service
@Transactional
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowHistoryRepository borrowHistoryRepository;
    private final AuthorService authorService;
    private final CategoryService categoryService;
    private final UserService userService;
    private final BookMapper bookMapper;
    private final BorrowHistoryMapper borrowHistoryMapper;
    private final LibraryProperties libraryProperties;
    private final AuditLogService auditLogService;

    public BookService(
            BookRepository bookRepository,
            BorrowHistoryRepository borrowHistoryRepository,
            AuthorService authorService,
            CategoryService categoryService,
            UserService userService,
            BookMapper bookMapper,
            BorrowHistoryMapper borrowHistoryMapper,
            LibraryProperties libraryProperties,
            AuditLogService auditLogService
    ) {
        this.bookRepository = bookRepository;
        this.borrowHistoryRepository = borrowHistoryRepository;
        this.authorService = authorService;
        this.categoryService = categoryService;
        this.userService = userService;
        this.bookMapper = bookMapper;
        this.borrowHistoryMapper = borrowHistoryMapper;
        this.libraryProperties = libraryProperties;
        this.auditLogService = auditLogService;
    }

    public BookResponse create(BookRequest request) {
        Author author = authorService.getAuthor(request.authorId());
        Set<Category> categories = getCategories(request.categoryIds());

        Book book = new Book();
        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setAuthor(author);
        book.setCategories(categories);

        return bookMapper.toResponse(bookRepository.save(book));
    }

    @Transactional(readOnly = true)
    public List<BookResponse> findAll() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponse findById(Long id) {
        return bookMapper.toResponse(getBook(id));
    }

    public BorrowHistoryResponse borrow(Long bookId, Long userId, String actorEmail) {
        Book book = getBook(bookId);
        User user = userService.findUser(userId);

        long currentBorrowed = borrowHistoryRepository.countByUserIdAndStatus(userId, BorrowStatus.BORROWED);
        if (currentBorrowed >= libraryProperties.maxBorrowedBooks()) {
            throw new BusinessRuleException(
                    "User cannot borrow more than " + libraryProperties.maxBorrowedBooks() + " books");
        }

        if (borrowHistoryRepository.existsByUserIdAndBookIdAndStatus(userId, bookId, BorrowStatus.BORROWED)) {
            throw new BusinessRuleException("User already has an active borrow for this book");
        }

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No available copies of this book");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        book.setCurrentBorrower(user);

        BorrowHistory history = BorrowHistory.builder()
                .user(user)
                .book(book)
                .borrowedAt(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(libraryProperties.loanDays()))
                .status(BorrowStatus.BORROWED)
                .build();

        history = borrowHistoryRepository.save(history);

        auditLogService.record(actorEmail, AuditAction.BOOK_BORROWED, "Book", bookId,
                "User " + userId + " borrowed book " + bookId, null);

        return borrowHistoryMapper.toResponse(history);
    }

    public BookResponse returnBook(Long bookId) {
        Book book = getBook(bookId);
        if (book.getBorrowedBy() == null) {
            throw new BadRequestException("Book is not currently borrowed");
        }

        book.setAvailableCopies(book.getAvailableCopies() + 1);
        book.setBorrowedBy(null);

        return bookMapper.toResponse(book);
    }

    public Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + id));
    }

    private Set<Category> getCategories(Set<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new LinkedHashSet<>();
        }
        List<Category> categories = new java.util.ArrayList<>(categoryIds.stream()
                .map(categoryService::getCategory)
                .toList());
        return new LinkedHashSet<>(categories);
    }
}
