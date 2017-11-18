package com.zhiqin.controller.register;

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
@RequestMapping("/register")
public class RegisterController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserInfoService userInfoService;

    @RequestMapping(method = RequestMethod.GET)
    public String showRegisterPage(Model model) {
        UserInfo userInfo = new UserInfo();
        model.addAttribute("userInfo", userInfo);
        return "register";
    }

    @RequestMapping(method = RequestMethod.POST)
    public String register(UserInfo userInfo) {
        userInfoService.save(userInfo);
        return "redirect:/result/register/successful";
    }
}
