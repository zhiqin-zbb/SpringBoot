package com.zhiqin.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageInfo;
import com.zhiqin.model.UserInfo;
import com.zhiqin.service.UserInfoService;
import com.zhiqin.common.annotation.Json;

@RestController
@RequestMapping("/users")
public class UserInfoController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private UserInfoService userInfoService;

    @RequestMapping
    public PageInfo<UserInfo> getAll(UserInfo userInfo) {
        logger.info("get all user info");
        List<UserInfo> userInfoList = userInfoService.getAll(userInfo);
        return new PageInfo<>(userInfoList);
    }

    @RequestMapping(value = "/add")
    public UserInfo add() {
        return new UserInfo();
    }

    @RequestMapping(value = "/view/{id}")
    public UserInfo view(@PathVariable Integer id) {
        UserInfo userInfo = userInfoService.getById(id);
        return userInfo;
    }

    @RequestMapping(value = "/delete/{id}")
    public ModelMap delete(@PathVariable Integer id) {
        ModelMap result = new ModelMap();
        userInfoService.deleteById(id);
        result.put("msg", "删除成功!");
        return result;
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public ModelMap save(UserInfo userInfo) {
        ModelMap result = new ModelMap();
        String msg = userInfo.getId() == null ? "新增成功!" : "更新成功!";
        userInfoService.save(userInfo);
        result.put("userInfo", userInfo);
        result.put("msg", msg);
        return result;
    }

    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public ModelMap test(@Json UserInfo user) {
        ModelMap result = new ModelMap();
        result.put("msg", user.getId());
        return result;
    }
}
