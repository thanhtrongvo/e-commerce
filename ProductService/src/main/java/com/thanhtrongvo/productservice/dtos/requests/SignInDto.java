package com.thanhtrongvo.productservice.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link com.thanhtrongvo.productservice.entities.User}
 */
@Value
public class SignInDto implements Serializable {
    @Size(min = 3, max = 50)
    @NotBlank
    String username;
    @Size(max = 120)
    @NotBlank
    String password;
}