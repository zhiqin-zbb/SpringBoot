package com.zhiqin.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.github.pagehelper.PageInfo;
import com.zhiqin.common.annotation.requestJson.Json;
import com.zhiqin.common.annotation.responseJson.model.ResponseJson;
import com.zhiqin.common.annotation.responseJson.model.ResponseVo;
import com.zhiqin.model.City;
import com.zhiqin.model.UserInfo;
import com.zhiqin.service.CityService;
import com.zhiqin.service.UserInfoService;

/**
 * Created by zhangbinbin on 2017/9/1.
 */
@Controller
@RequestMapping("/base64/test")
public class TestController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private CityService cityService;

    @Autowired
    private UserInfoService userInfoService;

    @RequestMapping(value = "/query", method = RequestMethod.POST)
    @ResponseJson
    public ResponseVo query(@Json Integer id) {
        City city = cityService.query(id);

        ResponseVo responseVo = new ResponseVo();
        responseVo.setSuccess(true);
        responseVo.setData(city);
        return responseVo;
    }

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    @ResponseJson
    public ResponseVo get(@Json UserInfo user) {
        List<UserInfo> userInfoList = new ArrayList<>();
        for (int i = 0; i < 5; ++i) {
            UserInfo userInfo = new UserInfo();
            userInfo.setId(i);
            userInfo.setUsername(String.valueOf(i));
            userInfoList.add(userInfo);
        }

        ResponseVo responseVo = new ResponseVo();
        responseVo.setData(userInfoList);
        return responseVo;
    }

    @RequestMapping(value = "/queryUser", method = RequestMethod.GET)
    @ResponseJson
    public PageInfo<UserInfo> getAllUser(UserInfo userInfo) {
        List<UserInfo> userInfoList = userInfoService.getAll(userInfo);
        PageInfo<UserInfo> userInfoPageInfo = new PageInfo<>(userInfoList);
        return userInfoPageInfo;
    }

    @RequestMapping(value = "/getUserInfo", method = RequestMethod.GET)
    @ResponseJson
    public UserInfo getString() {
        UserInfo userInfo = new UserInfo();
        userInfo.setId(222);
        userInfo.setUsername(String.valueOf(222));
        return userInfo;
    }

    @RequestMapping(value = "/cities", method = RequestMethod.GET)
    public String getAllCities(@Valid City city, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "index";
        }
        logger.info("city valid!");
        return "index";
    }
}
