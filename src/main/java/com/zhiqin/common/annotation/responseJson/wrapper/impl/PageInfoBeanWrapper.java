package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.github.pagehelper.PageInfo;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class PageInfoBeanWrapper implements BeanWrapper {
    @Override
    public boolean supportsType(MethodParameter returnType) {
        return PageInfo.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object wrap(Object bean) {
        return (PageInfo) bean;
    }
}
