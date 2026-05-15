package com.example.library.dto;

import java.time.Instant;

public record AuditLogResponse(
        Long id,
        String actorEmail,
        String action,
        String entityType,
        Long entityId,
        String message,
        String ipAddress,
        Instant createdAt
) {
}
