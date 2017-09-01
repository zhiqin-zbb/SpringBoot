package com.zhiqin.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.zhiqin.common.annotation.requestJson.Json;
import com.zhiqin.common.annotation.responseJson.model.ResponseJson;
import com.zhiqin.common.annotation.responseJson.model.ResponseVo;
import com.zhiqin.model.UserInfo;

/**
 * Created by zhangbinbin on 2017/9/1.
 */
@Controller
@RequestMapping("/test")
public class TestController {
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
