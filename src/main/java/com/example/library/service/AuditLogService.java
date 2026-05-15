package com.example.library.service;

import com.example.library.dto.AuditLogResponse;
import com.example.library.dto.PageResponse;
import com.example.library.entity.AuditAction;
import com.example.library.entity.AuditLog;
import com.example.library.mapper.AuditLogMapper;
import com.example.library.repository.AuditLogRepository;
import com.example.library.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String actorEmail, AuditAction action, String entityType, Long entityId, String message, String ipAddress) {
        auditLogRepository.save(AuditLog.builder()
                .actorEmail(actorEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .message(message)
                .ipAddress(ipAddress)
                .build());
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> list(String actorEmail, Pageable pageable) {
        if (actorEmail == null || actorEmail.isBlank()) {
            return PageUtils.toResponse(auditLogRepository.findAll(pageable), auditLogMapper::toResponse);
        }
        return PageUtils.toResponse(auditLogRepository.findByActorEmailIgnoreCase(actorEmail, pageable), auditLogMapper::toResponse);
    }
}
