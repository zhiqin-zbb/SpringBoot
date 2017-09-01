package com.zhiqin.common.annotation.responseJson.model;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class ResponseDataType {
    /**
     * http头字段名 请求的数据组织类型
     */
    public static final String HTTP_HEAD_REQUEST_DATA_TYPE = "TN-REQ-DATA-TYPE";

    /**
     * http头字段名 返回的数据组织类型
     */
    public static final String HTTP_HEAD_RESPONSE_DATA_TYPE = "TN-RES-DATA-TYPE";

    /**
     * 返回的数据为json字符串
     */
    public static final String RESPONSE_DATA_TYPE_JSON = "json/text";

    /**
     * 返回的数据位json格式并base64加密后字符串
     */
    public static final String RESPONSE_DATA_TYPE_JSON_BASE64 = "json/base64";
}
