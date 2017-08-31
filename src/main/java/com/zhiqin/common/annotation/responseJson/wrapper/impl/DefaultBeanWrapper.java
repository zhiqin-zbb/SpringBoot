package com.zhiqin.common.annotation.responseJson.wrapper.impl;

import com.zhiqin.common.annotation.responseJson.SuccessData;
import org.springframework.core.MethodParameter;

/**
 * 优先级最低的默认bean包装
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
