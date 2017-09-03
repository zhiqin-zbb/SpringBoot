package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.zhiqin.common.annotation.responseJson.model.ResponseVo;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class ResponseVoWrapper implements BeanWrapper {
    @Override
    public boolean supportsType(MethodParameter returnType) {
        return ResponseVo.class.isAssignableFrom(returnType.getParameterType());
    }

    public Object wrap(Object bean) {
        return (ResponseVo) bean;
    }
}