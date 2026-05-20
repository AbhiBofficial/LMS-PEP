package com.example.library.repository;

import com.example.library.entity.Category;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c.name, COUNT(b) FROM Category c LEFT JOIN c.books b GROUP BY c.name ORDER BY COUNT(b) DESC")
    List<Object[]> countBooksByCategory();
}
