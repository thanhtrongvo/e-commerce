package com.thanhtrongvo.productservice.mappers;

import com.thanhtrongvo.productservice.dtos.requests.SignInDto;
import com.thanhtrongvo.productservice.entities.User;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    User toEntity(SignInDto signInDto);

    SignInDto toDto(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User partialUpdate(SignInDto signInDto, @MappingTarget User user);
}