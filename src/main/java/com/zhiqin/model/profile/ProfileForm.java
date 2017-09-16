package com.zhiqin.model.profile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

/**
 * Created by zhangbinbin on 2017/9/16.
 */
@Data
public class ProfileForm {
    private String twitterHandle;

    private String email;

    private LocalDate birthDate;

    private List<String> tastes = new ArrayList<>();
}
