package com.thanhtrongvo.productservice.dtos;

import com.thanhtrongvo.productservice.entities.User;
import io.github.linpeilie.annotations.AutoMapper;
import jakarta.validation.constraints.*;
import lombok.Value;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.thanhtrongvo.productservice.entities.User}
 */

@AutoMapper(target = User.class)
@Value
public class UserDto implements Serializable {
    @NotNull
    Long id;
    @Size(min = 3, max = 50)
    @NotBlank
    String username;
    @Size(max = 120)
    @NotBlank
    String password;
    @NotNull
    @Size(max = 100)
    @Email
    @NotEmpty
    @NotBlank
    String email;
    @Size(min = 3, max = 50)
    @NotEmpty
    @NotBlank
    String firstName;
    @Size(min = 3, max = 50)
    @NotEmpty
    @NotBlank
    String lastName;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}