package com.zhiqin.common.annotation.responseJson.converter;

import java.io.IOException;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.FileCopyUtils;

/**
 * Created by zhangbinbin on 2017/9/1.
 */
public class Base64JsonHttpMessageConverter extends MappingJackson2HttpMessageConverter {
    private static final Logger log = LoggerFactory.getLogger(Base64JsonHttpMessageConverter.class);

    protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        try {
            byte[] bytes = this.getObjectMapper().writeValueAsBytes(object);
            FileCopyUtils.copy(Base64.encodeBase64(bytes), outputMessage.getBody());
        } catch (com.fasterxml.jackson.core.JsonProcessingException ex) {
            log.error("Could not write JSON: " + ex.getMessage(), ex);
            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
        }
    }
}
