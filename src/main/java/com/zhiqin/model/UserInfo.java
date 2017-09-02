package com.zhiqin.model;

import lombok.Data;

@Data
public class UserInfo extends BaseEntity {
    private String username;

    private String password;

    private String usertype;

    private Integer enabled;

    private String qq;

    private String email;

    private String tel;
}
