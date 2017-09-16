package com.zhiqin.model;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class City extends BaseEntity {
    @NotNull(message = "name cannot be null")
    private String name;

    private String state;
}
