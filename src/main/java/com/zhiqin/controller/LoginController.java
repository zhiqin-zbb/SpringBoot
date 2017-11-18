package com.zhiqin.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.zhiqin.model.UserInfo;
import com.zhiqin.service.UserInfoService;

/**
 * @author zhangbinbin
 * @version 2017/11/17
 */
@Controller
@RequestMapping("/login")
public class LoginController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserInfoService userInfoService;

    @RequestMapping(method = RequestMethod.GET)
    public String showLoginPage(Model model) {
        UserInfo userInfo = new UserInfo();
        model.addAttribute("userInfo", userInfo);
        return "login";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String login(UserInfo userInfo) {
        Boolean validate = userInfoService.validate(userInfo);
        if (validate) {
            return "redirect:/result/login/successful";
        } else {
            return "redirect:/result/login/fail";
        }
    }
}
