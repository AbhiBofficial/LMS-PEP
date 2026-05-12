# Library Management API

Spring Boot + Hibernate/JPA REST API for managing library users, profiles, books, authors, and categories.

## Tech Stack

- Java 17
- Spring Boot 3.5.14
- Spring Web
- Spring Data JPA / Hibernate
- H2 in-memory database
- Jakarta Validation

## JPA Relationships Covered

- One-to-One: `User` <-> `Profile`
- One-to-Many: `User` -> borrowed `Book` records
- Many-to-One: `Book` -> `Author`
- Many-to-Many: `Book` <-> `Category`

## Run

```powershell
.\mvnw.cmd spring-boot:run
```

API base URL:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
```

JDBC URL:

```text
jdbc:h2:mem:librarydb
```

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/users` | Create a user with profile |
| GET | `/users` | Get all users |
| GET | `/users/{id}` | Get one user |
| PUT | `/users/{id}` | Update user and profile |
| DELETE | `/users/{id}` | Delete user |
| POST | `/authors` | Add author |
| GET | `/authors` | Get all authors |
| GET | `/authors/{id}/books` | Get author's books |
| POST | `/categories` | Add category |
| GET | `/categories` | Get all categories |
| POST | `/books` | Add book with existing author and categories |
| GET | `/books` | Get all books |
| GET | `/books/{id}` | Get one book |
| PUT | `/books/{id}/borrow/{userId}` | Borrow a book |
| PUT | `/books/{id}/return` | Return a borrowed book |

## Sample Requests

Create an author:

```json
{
  "name": "Joshua Bloch",
  "bio": "Author of Effective Java"
}
```

Create a category:

```json
{
  "name": "Programming"
}
```

Create a user:

```json
{
  "name": "Abhishek",
  "profile": {
    "email": "abhishek@example.com",
    "phone": "9876543210",
    "address": "Delhi"
  }
}
```

Create a book:

```json
{
  "title": "Effective Java",
  "isbn": "9780134685991",
  "authorId": 1,
  "categoryIds": [1]
}
```

Borrow a book:

```text
PUT /books/1/borrow/1
```

Return a book:

```text
PUT /books/1/return
```
