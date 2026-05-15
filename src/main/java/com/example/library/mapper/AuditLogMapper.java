package com.example.library.mapper;

import com.example.library.dto.AuditLogResponse;
import com.example.library.entity.AuditLog;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {

    default AuditLogResponse toResponse(AuditLog auditLog) {
        if (auditLog == null) {
            return null;
        }
        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getActorEmail(),
                auditLog.getAction().name(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getMessage(),
                auditLog.getIpAddress(),
                auditLog.getCreatedAt()
        );
    }
}
