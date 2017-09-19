package com.zhiqin.model.profile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotEmpty;

import com.zhiqin.common.date.PastLocalDate;

import lombok.Data;

/**
 * Created by zhangbinbin on 2017/9/16.
 */
@Data
public class ProfileForm {
    @Size(min = 2)
    private String twitterHandle;

    @Email
    @NotEmpty
    private String email;

    @NotNull
    @PastLocalDate
    private LocalDate birthDate;

    private List<String> tastes = new ArrayList<>();
}
