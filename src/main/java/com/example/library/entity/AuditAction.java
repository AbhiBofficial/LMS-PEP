package com.example.library.entity;

public enum AuditAction {
    AUTH_REGISTER,
    AUTH_LOGIN,
    AUTH_LOGOUT,
    TOKEN_REFRESH,
    BOOK_BORROWED,
    BOOK_RETURNED,
    CREATE,
    UPDATE,
    DELETE
}
