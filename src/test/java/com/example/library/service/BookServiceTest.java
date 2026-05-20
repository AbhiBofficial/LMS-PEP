package com.example.library.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.library.config.LibraryProperties;
import com.example.library.dto.BookSummaryResponse;
import com.example.library.dto.BorrowHistoryResponse;
import com.example.library.dto.UserSummaryResponse;
import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.BorrowHistory;
import com.example.library.entity.BorrowStatus;
import com.example.library.entity.User;
import com.example.library.exception.BusinessRuleException;
import com.example.library.mapper.BookMapper;
import com.example.library.mapper.BorrowHistoryMapper;
import com.example.library.repository.BookRepository;
import com.example.library.repository.BorrowHistoryRepository;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private BorrowHistoryRepository borrowHistoryRepository;
    @Mock
    private AuthorService authorService;
    @Mock
    private CategoryService categoryService;
    @Mock
    private UserService userService;
    @Mock
    private BookMapper bookMapper;
    @Mock
    private BorrowHistoryMapper borrowHistoryMapper;
    @Mock
    private AuditLogService auditLogService;

    @Test
    void borrowDecrementsAvailableCopiesAndCreatesHistory() {
        LibraryProperties properties = properties();
        BookService service = new BookService(
                bookRepository,
                borrowHistoryRepository,
                authorService,
                categoryService,
                userService,
                bookMapper,
                borrowHistoryMapper,
                properties,
                auditLogService);

        Book book = createBook(1L, "Effective Java", "9780134685991", 3, 2);
        Author author = new Author();
        author.setName("Joshua Bloch");

        User user = User.builder().id(9L).email("user@test.local").fullName("User").name("User").enabled(true).build();
        BorrowHistoryResponse response = new BorrowHistoryResponse(
                11L,
                new UserSummaryResponse(9L, "user@test.local", "User"),
                new BookSummaryResponse(1L, "Effective Java", "9780134685991", 1),
                LocalDate.now(),
                LocalDate.now().plusDays(14),
                null,
                BigDecimal.ZERO,
                "BORROWED");

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(userService.findUser(9L)).thenReturn(user);
        when(borrowHistoryRepository.countByUserIdAndStatus(9L, BorrowStatus.BORROWED)).thenReturn(2L);
        when(borrowHistoryRepository.existsByUserIdAndBookIdAndStatus(9L, 1L, BorrowStatus.BORROWED)).thenReturn(false);
        when(borrowHistoryRepository.save(any(BorrowHistory.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(borrowHistoryMapper.toResponse(any(BorrowHistory.class))).thenReturn(response);

        BorrowHistoryResponse actual = service.borrow(1L, 9L, "librarian@test.local");

        assertThat(actual.status()).isEqualTo("BORROWED");
        assertThat(book.getAvailableCopies()).isEqualTo(1);
        assertThat(book.getCurrentBorrower()).isEqualTo(user);
        ArgumentCaptor<BorrowHistory> captor = ArgumentCaptor.forClass(BorrowHistory.class);
        verify(borrowHistoryRepository).save(captor.capture());
        assertThat(captor.getValue().getDueDate()).isEqualTo(LocalDate.now().plusDays(14));
    }

    @Test
    void borrowRejectsWhenMaxBorrowedBooksReached() {
        BookService service = new BookService(
                bookRepository,
                borrowHistoryRepository,
                authorService,
                categoryService,
                userService,
                bookMapper,
                borrowHistoryMapper,
                properties(),
                auditLogService);

        Book book = createBook(1L, "Clean Code", "9780132350884", 1, 1);
        User user = User.builder().id(2L).email("user@test.local").fullName("User").name("User").enabled(true).build();

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(userService.findUser(2L)).thenReturn(user);
        when(borrowHistoryRepository.countByUserIdAndStatus(2L, BorrowStatus.BORROWED)).thenReturn(5L);

        assertThatThrownBy(() -> service.borrow(1L, 2L, "librarian@test.local"))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("cannot borrow more than 5");
    }

    private Book createBook(Long id, String title, String isbn, int totalCopies, int availableCopies) {
        Book book = new Book();
        // Use reflection or setter to set id for testing
        book.setTitle(title);
        book.setIsbn(isbn);
        book.setTotalCopies(totalCopies);
        book.setAvailableCopies(availableCopies);
        // We need an id setter for tests — use the field directly via test utility
        try {
            java.lang.reflect.Field idField = Book.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(book, id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set book id for test", e);
        }
        return book;
    }

    private LibraryProperties properties() {
        return new LibraryProperties(
                5,
                14,
                new BigDecimal("2.00"),
                new LibraryProperties.Jwt(
                        "test-secret-test-secret-test-secret-test-secret-test-secret-test-secret-64",
                        Duration.ofMinutes(15),
                        Duration.ofDays(7)));
    }
}
