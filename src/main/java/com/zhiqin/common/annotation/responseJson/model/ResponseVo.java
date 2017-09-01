package com.zhiqin.common.annotation.responseJson.model;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
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

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(int errorCode) {
        this.errorCode = errorCode;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
