package com.hrms.authservice.config;

import com.hrms.authservice.security.BearerTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http, BearerTokenFilter tokenFilter) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**", "/actuator/**", "/h2-console/**", "/error").permitAll()
        .anyRequest().authenticated())
      .httpBasic(Customizer.withDefaults())
      .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class)
      .build();
  }
}
