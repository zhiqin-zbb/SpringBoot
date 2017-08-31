package com.zhiqin.common.annotation.responseJson;

import org.springframework.core.MethodParameter;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public interface BeanWrapper {
    /**
     * 支持性判断
     */
    boolean supportsType(MethodParameter returnType);

    /**
     * 对象包装
     */
    Object wrap(Object bean);
}
