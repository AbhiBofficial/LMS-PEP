# Library Management System ER Diagram

```mermaid
erDiagram
    USER ||--|| PROFILE : owns
    USER ||--o{ BOOK : currently_borrows
    USER ||--o{ BORROW_HISTORY : has
    USER }o--o{ ROLE : assigned
    ROLE }o--o{ PERMISSION : grants
    BOOK }o--|| AUTHOR : written_by
    BOOK }o--o{ CATEGORY : categorized_as
    BOOK ||--o{ BORROW_HISTORY : appears_in
    USER ||--o{ REFRESH_TOKEN : owns
    USER ||--o{ AUDIT_LOG : actor
```

## Relationship Requirements

- One-to-One: `users` to `profiles`
- One-to-Many: `users` to borrowed `books` through `books.current_borrower_id`
- Many-to-One: `books` to `authors`
- Many-to-Many: `books` to `categories`

Operational borrowing uses `borrow_history` so multiple copies of the same title can be borrowed while keeping accurate due dates, returns, and fines.
