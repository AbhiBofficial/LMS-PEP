CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(240),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(40) NOT NULL UNIQUE,
    description VARCHAR(240),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(30),
    address VARCHAR(500),
    date_of_birth DATE,
    avatar_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL UNIQUE,
    biography VARCHAR(1500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(220) NOT NULL,
    isbn VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(2000),
    publication_year INTEGER,
    total_copies INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    shelf_location VARCHAR(80),
    author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE RESTRICT,
    current_borrower_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_book_copies CHECK (total_copies >= 1 AND available_copies >= 0 AND available_copies <= total_copies),
    CONSTRAINT ck_publication_year CHECK (publication_year IS NULL OR publication_year BETWEEN 1000 AND 3000)
);

CREATE TABLE book_categories (
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    PRIMARY KEY (book_id, category_id)
);

CREATE TABLE borrow_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    borrowed_at DATE NOT NULL,
    due_date DATE NOT NULL,
    returned_at DATE,
    fine_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_borrow_status CHECK (status IN ('BORROWED', 'RETURNED', 'LOST')),
    CONSTRAINT ck_due_after_borrow CHECK (due_date >= borrowed_at),
    CONSTRAINT ck_return_after_borrow CHECK (returned_at IS NULL OR returned_at >= borrowed_at)
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(128) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_email VARCHAR(160),
    action VARCHAR(40) NOT NULL,
    entity_type VARCHAR(80),
    entity_id BIGINT,
    message VARCHAR(1000),
    ip_address VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_books_isbn ON books (isbn);
CREATE INDEX idx_books_author ON books (author_id);
CREATE INDEX idx_book_categories_category ON book_categories (category_id);
CREATE INDEX idx_borrow_history_user_status ON borrow_history (user_id, status);
CREATE INDEX idx_borrow_history_book_status ON borrow_history (book_id, status);
CREATE INDEX idx_borrow_history_due_date ON borrow_history (due_date);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens (user_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_email);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
