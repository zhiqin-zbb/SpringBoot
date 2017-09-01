package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.github.pagehelper.PageInfo;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
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
