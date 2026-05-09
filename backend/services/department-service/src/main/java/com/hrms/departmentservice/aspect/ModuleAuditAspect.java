package com.hrms.departmentservice.aspect;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ModuleAuditAspect {
  @Before("execution(* com.hrms.departmentservice.controller..*(..))")
  public void logRequest() {}
}
