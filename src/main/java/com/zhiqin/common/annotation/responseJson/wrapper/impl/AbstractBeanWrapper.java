package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import com.zhiqin.common.annotation.responseJson.ResponseData;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;
import org.springframework.core.MethodParameter;

public abstract class AbstractBeanWrapper implements BeanWrapper {
    public boolean supportsType(MethodParameter returnType) {
        if (ResponseData.class.isAssignableFrom(returnType.getParameterType())) {
            return false;
        }
        return supports(returnType);
    }

    public abstract boolean supports(MethodParameter returnType);
}
