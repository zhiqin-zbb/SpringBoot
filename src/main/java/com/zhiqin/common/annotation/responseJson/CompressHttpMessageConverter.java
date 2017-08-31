package com.zhiqin.common.annotation.responseJson;

import org.apache.commons.codec.binary.Base64;
import org.codehaus.jackson.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;

public class CompressHttpMessageConverter extends MappingJackson2HttpMessageConverter {
    //log
    private static final Logger log = LoggerFactory.getLogger(CompressHttpMessageConverter.class);

    //Converter 类型
    private int converterType;
    //
    private int compressType;

    public CompressHttpMessageConverter(int converterType, int compressType) {
        super();
        this.converterType = converterType;
        this.compressType = compressType;
    }

    @Override
    protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException,
            HttpMessageNotWritableException {
        try {
            byte[] bytes = getObjectMapper().writeValueAsBytes(object);
            byte[] lastBytes = null;
            IClientCompressUtils iClientCompressUtils = null;
            switch (converterType) {
                case MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON:
                    //不使用base64
                    break;
                case MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON_BASE64:
                    bytes = Base64.encodeBase64(bytes);
                    break;
                default:
                    bytes = Base64.encodeBase64(bytes);
                    break;
            }
            switch (compressType) {
                case ClientCompressFactory.COMPRESS_GZIP:
                    iClientCompressUtils = ClientCompressFactory.getCompressUtils(ClientCompressFactory.COMPRESS_GZIP);
                    lastBytes = iClientCompressUtils.compress(bytes);
                    outputMessage.getHeaders().set(ClientCompressFactory.HTTP_HEAD_DATA_COMPRESSTYPE, ClientCompressFactory.COMPRESS_NAME_GZIP);
                    break;
                case ClientCompressFactory.COMPRESS_SNAPPY:
                    iClientCompressUtils = ClientCompressFactory.getCompressUtils(ClientCompressFactory.COMPRESS_SNAPPY);
                    lastBytes = iClientCompressUtils.compress(bytes);
                    outputMessage.getHeaders().set(ClientCompressFactory.HTTP_HEAD_DATA_COMPRESSTYPE, ClientCompressFactory.COMPRESS_NAME_SNAPPY);
                    break;
                case ClientCompressFactory.COMPRESS_UNKNOW:
                    lastBytes = bytes;
                    break;
                default:
                    lastBytes = bytes;
                    break;
            }
            FileCopyUtils.copy(lastBytes, outputMessage.getBody());
        } catch (JsonProcessingException ex) {
            log.error("Could not write JSON: " + ex.getMessage(), ex);
            throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
        }
    }
}
