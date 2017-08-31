package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import com.github.pagehelper.PageInfo;
import org.springframework.core.MethodParameter;

public class PageInfoBeanWrapper extends AbstractBeanWrapper {
    @Override
    public boolean supports(MethodParameter returnType) {
        return PageInfo.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object wrap(Object bean) {
        return (PageInfo) bean;
    }
}
