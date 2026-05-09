package com.hrms.authservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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

  public BearerTokenFilter(TokenService tokenService) {
    this.tokenService = tokenService;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/api/auth/") || path.startsWith("/actuator/") || path.equals("/error") || path.contains("/health");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      try {
        TokenService.TokenClaims claims = tokenService.verify(header.substring(7));
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
          claims.email(),
          null,
          List.of(new SimpleGrantedAuthority("ROLE_" + claims.role().toUpperCase().replace(' ', '_')))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (Exception exception) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"Invalid or expired token\"}");
        return;
      }
    }
    filterChain.doFilter(request, response);
  }
}
