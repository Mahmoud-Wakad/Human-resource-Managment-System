package com.hrms.employeeservice.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ModuleAuditAspect {
  @Before("execution(* com.hrms.employeeservice.controller..*(..))")
  public void logRequest() {}
}
