package com.zhiqin.common.annotation.responseJson.model;

import lombok.Data;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
@Data
public class SuccessData implements ResponseData {
    private boolean success = true;

    private Object data;

    public SuccessData(Object data) {
        this.data = data;
    }
}
