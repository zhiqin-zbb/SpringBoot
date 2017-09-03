package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import org.springframework.core.MethodParameter;

import com.zhiqin.common.annotation.responseJson.model.SuccessData;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class DefaultBeanWrapper implements BeanWrapper {
    @Override
    public boolean supportsType(MethodParameter returnType) {
        return true;
    }

    public Object wrap(Object bean) {
        return new SuccessData(bean);
    }
}
