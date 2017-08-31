package com.zhiqin.common.annotation.responseJson;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Set;

import org.codehaus.jackson.map.SerializationConfig;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.FileCopyUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class JsonHttpMessageConverter extends MappingJackson2HttpMessageConverter {
    public JsonHttpMessageConverter() {
        super();
        ObjectMapper mapper = getObjectMapper();
        mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true)
                .configure(SerializationConfig.Feature.FAIL_ON_EMPTY_BEANS, false)
                .configure(SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS, false).getSerializationConfig()
                .setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        Set<String> fliterSet = new HashSet<String>();
        FilterProvider filterProvider = new SimpleFilterProvider().addFilter("filter",
                SimpleBeanPropertyFilter.serializeAllExcept(fliterSet));
        mapper.setFilters(filterProvider);
    }

    @Override
    protected void writeInternal(Object object, Type type, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
        try {
            byte[] bytes = getObjectMapper().writeValueAsBytes(object);
            FileCopyUtils.copy(bytes, outputMessage.getBody());
        } catch (JsonProcessingException ex) {
            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
        }
    }
}
