package com.zhiqin.common.annotation.responseJson;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ResponseJson {
    boolean translate() default false;

    Location location() default Location.BYREQUEST;

    compressType compressType() default compressType.NOCOMPRESS;

    enum Location {
        UNDEFINED, DATA, MESSAGE, BYREQUEST
    }

    enum compressType {
        NOCOMPRESS, SNAPPY, GZIP, BYREQUEST
    }
}
