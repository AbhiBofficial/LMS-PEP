INSERT INTO permissions (name, description) VALUES
('BOOK_READ', 'Read book catalog'),
('BOOK_WRITE', 'Create and update books'),
('USER_READ', 'Read users'),
('USER_WRITE', 'Create and update users'),
('BORROW_WRITE', 'Borrow and return books'),
('AUDIT_READ', 'Read audit logs');

INSERT INTO roles (name, description) VALUES
('ADMIN', 'Full system administrator'),
('LIBRARIAN', 'Library staff member'),
('USER', 'Library patron');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('BOOK_READ', 'BOOK_WRITE', 'USER_READ', 'BORROW_WRITE')
WHERE r.name = 'LIBRARIAN';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('BOOK_READ', 'BORROW_WRITE')
WHERE r.name = 'USER';

INSERT INTO users (email, password_hash, full_name, enabled) VALUES
('admin@library.local', '$2a$12$k94Wev45veZW/VF.5mAcv.4bEyEQIYxtP56O.Po7DB.hllzw3Kzv2', 'System Admin', TRUE),
('librarian@library.local', '$2a$12$k94Wev45veZW/VF.5mAcv.4bEyEQIYxtP56O.Po7DB.hllzw3Kzv2', 'Lead Librarian', TRUE),
('user@library.local', '$2a$12$k94Wev45veZW/VF.5mAcv.4bEyEQIYxtP56O.Po7DB.hllzw3Kzv2', 'Demo User', TRUE);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'ADMIN' WHERE u.email = 'admin@library.local';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'LIBRARIAN' WHERE u.email = 'librarian@library.local';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'USER' WHERE u.email = 'user@library.local';

INSERT INTO profiles (user_id, phone, address, date_of_birth)
SELECT id, '+1 555 0100', 'Library HQ', DATE '1990-01-01' FROM users WHERE email = 'admin@library.local';

INSERT INTO profiles (user_id, phone, address, date_of_birth)
SELECT id, '+1 555 0101', 'Main Branch', DATE '1992-05-12' FROM users WHERE email = 'librarian@library.local';

INSERT INTO profiles (user_id, phone, address, date_of_birth)
SELECT id, '+1 555 0102', 'Reader Street', DATE '1998-09-21' FROM users WHERE email = 'user@library.local';

INSERT INTO authors (name, biography) VALUES
('Joshua Bloch', 'Software engineer and author of Effective Java.'),
('Robert C. Martin', 'Software craftsman known for Clean Code.'),
('Martin Fowler', 'Author and speaker on software architecture and refactoring.'),
('Eric Evans', 'Author of Domain-Driven Design.');

INSERT INTO categories (name, description) VALUES
('Programming', 'Software development and programming books'),
('Architecture', 'Software architecture and system design'),
('Clean Code', 'Code quality and maintainability'),
('Domain Design', 'Domain-driven design and modelling');

INSERT INTO books (title, isbn, description, publication_year, total_copies, available_copies, shelf_location, author_id)
SELECT 'Effective Java', '9780134685991', 'Best practices for the Java platform.', 2018, 6, 6, 'A1-JAVA', id FROM authors WHERE name = 'Joshua Bloch';

INSERT INTO books (title, isbn, description, publication_year, total_copies, available_copies, shelf_location, author_id)
SELECT 'Clean Code', '9780132350884', 'A handbook of agile software craftsmanship.', 2008, 5, 5, 'A2-CLEAN', id FROM authors WHERE name = 'Robert C. Martin';

INSERT INTO books (title, isbn, description, publication_year, total_copies, available_copies, shelf_location, author_id)
SELECT 'Refactoring', '9780134757599', 'Improving the design of existing code.', 2018, 4, 4, 'A3-ARCH', id FROM authors WHERE name = 'Martin Fowler';

INSERT INTO books (title, isbn, description, publication_year, total_copies, available_copies, shelf_location, author_id)
SELECT 'Domain-Driven Design', '9780321125217', 'Tackling complexity in software.', 2003, 3, 3, 'B1-DDD', id FROM authors WHERE name = 'Eric Evans';

INSERT INTO book_categories (book_id, category_id)
SELECT b.id, c.id FROM books b, categories c
WHERE b.title = 'Effective Java' AND c.name IN ('Programming', 'Clean Code');

INSERT INTO book_categories (book_id, category_id)
SELECT b.id, c.id FROM books b, categories c
WHERE b.title = 'Clean Code' AND c.name IN ('Programming', 'Clean Code');

INSERT INTO book_categories (book_id, category_id)
SELECT b.id, c.id FROM books b, categories c
WHERE b.title = 'Refactoring' AND c.name IN ('Programming', 'Architecture');

INSERT INTO book_categories (book_id, category_id)
SELECT b.id, c.id FROM books b, categories c
WHERE b.title = 'Domain-Driven Design' AND c.name IN ('Architecture', 'Domain Design');
