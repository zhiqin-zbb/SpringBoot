package com.zhiqin.controller.profile;

import java.util.Locale;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.druid.support.json.JSONUtils;
import com.zhiqin.common.date.LocalDateFormatter;
import com.zhiqin.common.util.json.JsonUtil;
import com.zhiqin.model.profile.ProfileForm;

/**
 * Created by zhangbinbin on 2017/9/16.
 */
@Controller
public class ProfileController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @ModelAttribute("dateFormat")
    public String localeFormat(Locale locale) {
        return LocalDateFormatter.getPattern(locale);
    }

    @RequestMapping("/profile")
    public ModelAndView displayProfile() {
        ModelAndView result = new ModelAndView("profile/profilePage");
        result.addObject("profileForm", new ProfileForm());
        return result;
    }

    @RequestMapping(value = "/profile", method = RequestMethod.POST)
    public String saveProfile(@Valid ProfileForm profileForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "profile/profilePage";
        }

        logger.info("save ok:[{}]", JsonUtil.toString(profileForm));
        return "redirect:/profile";
    }
}
