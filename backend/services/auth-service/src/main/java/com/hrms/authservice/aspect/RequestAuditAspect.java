package com.hrms.authservice.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RequestAuditAspect {
  private static final Logger log = LoggerFactory.getLogger(RequestAuditAspect.class);

  @Before("execution(* com.hrms.authservice.controller..*(..))")
  public void logBefore(JoinPoint joinPoint) {
    log.info("Auth request: {}", joinPoint.getSignature().toShortString());
  }

  @AfterReturning("execution(* com.hrms.authservice.controller..*(..))")
  public void logAfter(JoinPoint joinPoint) {
    log.info("Auth request completed: {}", joinPoint.getSignature().toShortString());
  }
}
