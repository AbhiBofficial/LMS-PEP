package com.example.library.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class IsbnValidator implements ConstraintValidator<ValidIsbn, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        String normalized = value.replace("-", "").replace(" ", "");
        return normalized.matches("\\d{13}") || normalized.matches("\\d{9}[0-9Xx]");
    }
}
