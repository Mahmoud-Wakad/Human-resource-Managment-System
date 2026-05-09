package com.hrms.payrollservice.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
  private final String secret;
  private final long ttlMinutes;

  public TokenService(@Value("${app.jwt.secret:hrms-dev-secret}") String secret, @Value("${app.jwt.ttl-minutes:1440}") long ttlMinutes) {
    this.secret = secret;
    this.ttlMinutes = ttlMinutes;
  }

  public TokenClaims verify(String token) {
    String[] parts = token.split("\\.");
    if (parts.length != 2) {
      throw new IllegalArgumentException("Invalid token format");
    }
    if (!sign(parts[0]).equals(parts[1])) {
      throw new IllegalArgumentException("Invalid token signature");
    }
    String[] fields = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8).split("\\|", -1);
    if (fields.length < 7 || Instant.now().getEpochSecond() > Long.parseLong(fields[6])) {
      throw new IllegalArgumentException("Token expired");
    }
    return new TokenClaims(fields[0], fields[1], fields[2], fields[3], fields[4]);
  }

  private String sign(String payload) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception exception) {
      throw new IllegalStateException("Unable to sign token", exception);
    }
  }

  public record TokenClaims(String email, String role, String fullName, String departmentId, String employeeId) {}
}
