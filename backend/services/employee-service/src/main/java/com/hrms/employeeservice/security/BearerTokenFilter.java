package com.hrms.employeeservice.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class BearerTokenFilter extends OncePerRequestFilter {
  private final TokenService tokenService;
  public BearerTokenFilter(TokenService tokenService) { this.tokenService = tokenService; }
  @Override protected boolean shouldNotFilter(HttpServletRequest request) { return request.getRequestURI().contains("/health") || request.getRequestURI().startsWith("/actuator/") || request.getRequestURI().equals("/error") || request.getRequestURI().startsWith("/h2-console/"); }
  @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      try {
        TokenService.TokenClaims claims = tokenService.verify(header.substring(7));
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(claims.email(), null, List.of(new SimpleGrantedAuthority("ROLE_" + claims.role().toUpperCase().replace(' ', '_')))));
      } catch (Exception exception) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return;
      }
    }
    filterChain.doFilter(request, response);
  }
}
