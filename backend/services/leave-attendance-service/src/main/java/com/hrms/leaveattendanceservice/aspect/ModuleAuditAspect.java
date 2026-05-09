package com.hrms.leaveattendanceservice.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ModuleAuditAspect {
  private static final Logger log = LoggerFactory.getLogger(ModuleAuditAspect.class);

  @Around("within(com.hrms.leaveattendanceservice..*)")
  public Object audit(ProceedingJoinPoint joinPoint) throws Throwable {
    long start = System.currentTimeMillis();
    try {
      return joinPoint.proceed();
    } finally {
      log.info("leave-attendance-service {} took {} ms", joinPoint.getSignature().toShortString(), System.currentTimeMillis() - start);
    }
  }
}
