package com.example.library.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.Category;
import java.time.Instant;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BookRepositoryTest {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void searchFiltersByTextCategoryAndAvailability() {
        Instant now = Instant.now();
        Author author = Author.builder().name("Joshua Bloch").biography("Java author").build();
        author.setCreatedAt(now);
        author.setUpdatedAt(now);
        author = authorRepository.save(author);

        Category category = Category.builder().name("Programming").description("Code").build();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        category = categoryRepository.save(category);

        Book book = Book.builder()
                .title("Effective Java")
                .isbn("9780134685991")
                .description("Java practices")
                .publicationYear(2018)
                .totalCopies(2)
                .availableCopies(1)
                .author(author)
                .categories(Set.of(category))
                .build();
        book.setCreatedAt(now);
        book.setUpdatedAt(now);
        bookRepository.saveAndFlush(book);

        var result = bookRepository.search("java", author.getId(), category.getId(), true, PageRequest.of(0, 10));

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Effective Java");
    }
}
