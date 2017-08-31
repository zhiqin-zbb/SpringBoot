package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import com.zhiqin.common.annotation.responseJson.ResponseVo;
import org.springframework.core.MethodParameter;

public class ResponseVoWrapper extends AbstractBeanWrapper {
    public Object wrap(Object bean) {
        return (ResponseVo) bean;
    }

    @Override
    public boolean supports(MethodParameter returnType) {
        return ResponseVo.class.isAssignableFrom(returnType.getParameterType());
    }
}