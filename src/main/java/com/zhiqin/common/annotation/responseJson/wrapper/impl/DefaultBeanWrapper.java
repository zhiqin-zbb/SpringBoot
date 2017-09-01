package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.zhiqin.common.annotation.responseJson.model.SuccessData;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class DefaultBeanWrapper extends AbstractBeanWrapper {
    public Object wrap(Object bean) {
        return new SuccessData(bean);
    }

    @Override
    public boolean supports(MethodParameter returnType) {
        return true;
    }
}
