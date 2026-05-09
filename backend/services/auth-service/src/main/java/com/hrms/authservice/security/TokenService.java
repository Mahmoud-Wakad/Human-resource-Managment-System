package com.hrms.authservice.security;

import com.hrms.authservice.entity.UserAccount;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
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

  public TokenService(
    @Value("${app.jwt.secret:hrms-dev-secret}") String secret,
    @Value("${app.jwt.ttl-minutes:1440}") long ttlMinutes
  ) {
    this.secret = secret;
    this.ttlMinutes = ttlMinutes;
  }

  public String generate(UserAccount user) {
    long issuedAt = Instant.now().getEpochSecond();
    long expiresAt = Instant.now().plusSeconds(ttlMinutes * 60).getEpochSecond();
    String payload = String.join("|", user.getEmail(), user.getRole(), user.getFullName(), user.getDepartmentId() == null ? "" : user.getDepartmentId(), user.getEmployeeId() == null ? "" : user.getEmployeeId(), String.valueOf(issuedAt), String.valueOf(expiresAt));
    String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    return encodedPayload + "." + sign(encodedPayload);
  }

  public TokenClaims verify(String token) {
    String[] parts = token.split("\\.");
    if (parts.length != 2) {
      throw new IllegalArgumentException("Invalid token format");
    }
    String payload = parts[0];
    String signature = parts[1];
    if (!sign(payload).equals(signature)) {
      throw new IllegalArgumentException("Invalid token signature");
    }
    String decoded = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
    String[] fields = decoded.split("\\|", -1);
    if (fields.length < 7) {
      throw new IllegalArgumentException("Invalid token payload");
    }
    long expiresAt = Long.parseLong(fields[6]);
    if (Instant.now().getEpochSecond() > expiresAt) {
      throw new IllegalArgumentException("Token expired");
    }
    return new TokenClaims(fields[0], fields[1], fields[2], fields[3], fields[4]);
  }

  private String sign(String payload) {
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      byte[] digest = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
      return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
    } catch (Exception exception) {
      throw new IllegalStateException("Unable to sign token", exception);
    }
  }

  public record TokenClaims(String email, String role, String fullName, String departmentId, String employeeId) {}
}

