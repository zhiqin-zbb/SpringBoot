package com.zhiqin.common.annotation.responseJson.converter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.FileCopyUtils;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class JsonHttpMessageConverter extends MappingJackson2HttpMessageConverter {
    private static final Logger log = LoggerFactory.getLogger(JsonHttpMessageConverter.class);

    public JsonHttpMessageConverter() {
        super();
    }

    protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException,
            HttpMessageNotWritableException {
        try {
            byte[] bytes = getObjectMapper().writeValueAsBytes(object);
            FileCopyUtils.copy(bytes, outputMessage.getBody());
        } catch (com.fasterxml.jackson.core.JsonProcessingException ex) {
            log.error("Could not write JSON: " + ex.getMessage(), ex);
            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
        }
    }
}
