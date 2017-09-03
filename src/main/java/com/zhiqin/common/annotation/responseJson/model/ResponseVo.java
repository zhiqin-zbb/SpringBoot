package com.zhiqin.common.annotation.responseJson.model;

import lombok.Data;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
@Data
public class ResponseVo {
    /**
     * 成功标记
     */
    private boolean success;

    /**
     * 提示信息
     */
    private String msg;

    /**
     * 错误码
     */
    private int errorCode;

    /**
     * 返回的具体数据
     */
    private Object data;
}
