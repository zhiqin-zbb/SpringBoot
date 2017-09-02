package com.zhiqin.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.zhiqin.common.annotation.requestJson.Json;
import com.zhiqin.common.annotation.responseJson.model.ResponseJson;
import com.zhiqin.common.annotation.responseJson.model.ResponseVo;
import com.zhiqin.model.City;
import com.zhiqin.model.UserInfo;
import com.zhiqin.service.CityService;

/**
 * Created by zhangbinbin on 2017/9/1.
 */
@Controller
@RequestMapping("/test")
public class TestController {
    @Autowired
    private CityService cityService;

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
}
