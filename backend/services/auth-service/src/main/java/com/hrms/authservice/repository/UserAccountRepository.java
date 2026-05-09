package com.hrms.authservice.repository;

import com.hrms.authservice.entity.UserAccount;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountRepository extends JpaRepository<UserAccount, String> {
  Optional<UserAccount> findByEmailIgnoreCase(String email);
  boolean existsByEmailIgnoreCase(String email);
}
