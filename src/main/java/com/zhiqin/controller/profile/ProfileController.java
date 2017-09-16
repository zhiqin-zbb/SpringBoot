package com.zhiqin.controller.profile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.zhiqin.model.profile.ProfileForm;

/**
 * Created by zhangbinbin on 2017/9/16.
 */
@Controller
public class ProfileController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @RequestMapping("/profile")
    public String displayProfile() {
        return "profile/profilePage";
    }

    @RequestMapping(value = "/profile", method = RequestMethod.POST)
    public String saveProfile(@ModelAttribute("profileForm") ProfileForm profileForm, BindingResult result) {
        logger.info("save ok" + profileForm);
        return "redirect:/profile";
    }
}
