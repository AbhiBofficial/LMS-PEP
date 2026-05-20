package com.example.library.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.library.entity.Author;
import com.example.library.entity.Book;
import com.example.library.entity.Category;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
    void findByAuthorIdReturnsMatchingBooks() {
        Author author = new Author();
        author.setName("Joshua Bloch");
        author.setBiography("Java author");
        author = authorRepository.save(author);

        Category category = new Category();
        category.setName("Programming");
        category.setDescription("Code");
        category = categoryRepository.save(category);

        Book book = new Book();
        book.setTitle("Effective Java");
        book.setIsbn("9780134685991");
        book.setDescription("Java practices");
        book.setPublicationYear(2018);
        book.setTotalCopies(2);
        book.setAvailableCopies(1);
        book.setAuthor(author);
        book.setCategories(Set.of(category));
        bookRepository.saveAndFlush(book);

        var result = bookRepository.findByAuthorId(author.getId());

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Effective Java");
    }
}
