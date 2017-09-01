package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.zhiqin.common.annotation.responseJson.model.ResponseVo;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class ResponseVoWrapper extends AbstractBeanWrapper {
    public Object wrap(Object bean) {
        return (ResponseVo) bean;
    }

    @Override
    public boolean supports(MethodParameter returnType) {
        return ResponseVo.class.isAssignableFrom(returnType.getParameterType());
    }
}