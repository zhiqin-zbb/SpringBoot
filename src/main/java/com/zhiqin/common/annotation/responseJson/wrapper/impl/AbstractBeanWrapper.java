package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.zhiqin.common.annotation.responseJson.model.ResponseData;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public abstract class AbstractBeanWrapper implements BeanWrapper {
    public boolean supportsType(MethodParameter returnType) {
        if (ResponseData.class.isAssignableFrom(returnType.getParameterType())) {
            return false;
        }
        return supports(returnType);
    }

    public abstract boolean supports(MethodParameter returnType);
}
