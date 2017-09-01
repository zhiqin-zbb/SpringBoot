package com.zhiqin.common.annotation.responseJson.converter;

import com.zhiqin.common.annotation.responseJson.model.ResponseDataType;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class MessageConverterTpyeUtil {
    /**
     * 返回json
     */
    public static final int MESSAGE_CONVERTER_TYPE_JSON = 2;

    /**
     * 返回json包base64之后的数据
     */
    public static final int MESSAGE_CONVERTER_TYPE_JSON_BASE64 = 3;

    /**
     * 默认
     */
    public static final int MESSAGE_CONVERTER_TYPE_UNDEFINE = MESSAGE_CONVERTER_TYPE_JSON_BASE64;

    /**
     * 根据传入的http头中对应的字段获取数据返回的组织类型
     *
     * @return
     */
    public static int getMessageConverterTypeFromHttpHead(String httpRequestDataType) {
        int ret = MESSAGE_CONVERTER_TYPE_UNDEFINE;
        if (httpRequestDataType == null || httpRequestDataType.isEmpty()) {
            ret = MESSAGE_CONVERTER_TYPE_UNDEFINE;
        } else {
            if (httpRequestDataType.equalsIgnoreCase(ResponseDataType.RESPONSE_DATA_TYPE_JSON)) {
                ret = MESSAGE_CONVERTER_TYPE_JSON;
            } else if (httpRequestDataType.equalsIgnoreCase(ResponseDataType.RESPONSE_DATA_TYPE_JSON_BASE64)) {
                ret = MESSAGE_CONVERTER_TYPE_JSON_BASE64;
            }
        }
        return ret;
    }
}
