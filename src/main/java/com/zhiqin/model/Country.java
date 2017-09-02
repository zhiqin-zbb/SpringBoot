package com.zhiqin.model;

import lombok.Data;

@Data
public class Country extends BaseEntity {
    private String countryname;

    private String countrycode;
}