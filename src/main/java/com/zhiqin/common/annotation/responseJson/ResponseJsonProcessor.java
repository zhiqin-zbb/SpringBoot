package com.zhiqin.common.annotation.responseJson;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class ResponseJsonProcessor implements HandlerMethodReturnValueHandler, InitializingBean {
    private HttpMessageConverter messageConverter;

    private List<BeanWrapper> beanWrappers;

    public HttpMessageConverter getMessageConverter() {
        return messageConverter;
    }

    public void setMessageConverter(HttpMessageConverter messageConverter) {
        this.messageConverter = messageConverter;
    }

    public List<BeanWrapper> getBeanWrappers() {
        return beanWrappers;
    }

    public void setBeanWrappers(List<BeanWrapper> beanWrappers) {
        this.beanWrappers = beanWrappers;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        if (beanWrappers == null || beanWrappers.size() == 0) {
            throw new Exception("beanWrappers undefined");
        }
    }

    @Override
    public boolean supportsReturnType(MethodParameter returnType) {
        return returnType.getMethodAnnotation(ResponseJson.class) != null;
    }

    @Override
    public void handleReturnValue(Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
        Object result = returnValue;
        mavContainer.setRequestHandled(true);
        ResponseJson responseJson = null;
        ServletServerHttpResponse outputMessage = createOutputMessage(webRequest);
        responseJson = returnType.getMethodAnnotation(ResponseJson.class);

        if (returnValue == null) {
            Map<String, Object> message = new HashMap<String, Object>();
            message.put("success", true);
            message.put("data", new HashMap<String, String>());
            result = message;
        } else {
            if ((responseJson.location() == ResponseJson.Location.MESSAGE)
                    || ((returnValue instanceof String) && (responseJson.location() == ResponseJson.Location.UNDEFINED))) {
                Map<String, Object> message = new HashMap<String, Object>();
                message.put("success", true);
                message.put("msg", returnValue);
                result = message;
            } else {
                for (BeanWrapper beanWrapper : beanWrappers) {
                    if (beanWrapper.supportsType(returnType)) {
                        result = beanWrapper.wrap(returnValue);
                        break;
                    }
                }
            }

        }

        if (responseJson.compressType() == ResponseJson.compressType.NOCOMPRESS) {
            if (responseJson.location() == ResponseJson.Location.DATA) {
                //只返回json
                HttpMessageConverter converter= new MappingJackson2HttpMessageConverter();
                converter.write(result,
                        new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                        outputMessage);
            } else if(responseJson.location() == ResponseJson.Location.BYREQUEST) {
                //根据http请求头中的设置阻止返回数据
                int converterType = MessageConverterTpyeUtil.getMessageConverterTypeFromHttpHead(
                        webRequest.getHeader(ResponseDataType.HTTP_HEAD_REQUEST_DATA_TYPE));
                switch (converterType) {
                    case MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON:
                        HttpMessageConverter converter= new JsonHttpMessageConverter();
                        //设置http头
                        outputMessage.getHeaders().set(ResponseDataType.HTTP_HEAD_RESPONSE_DATA_TYPE,
                                ResponseDataType.TUNIU_RESPONSE_DATA_TYPE_JSON);
                        converter.write(result,
                                new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                                outputMessage);
                        break;
                    case MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON_BASE64:
                        //设置http头
                        outputMessage.getHeaders().set(ResponseDataType.HTTP_HEAD_RESPONSE_DATA_TYPE,
                                ResponseDataType.TUNIU_RESPONSE_DATA_TYPE_JSON_BASE64);
                        messageConverter.write(result,
                                new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                                outputMessage);
                        break;
                    default:
                        messageConverter.write(result,
                                new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                                outputMessage);
                }
            } else {
                //返回json+base64
                messageConverter.write(result,
                        new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                        outputMessage);
            }
        } else {
            int converterType = MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_UNDEFINE;
            int compressType = ClientCompressFactory.COMPRESS_UNKNOW;
            if (responseJson.location() == Location.DATA) {
                converterType = MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON;
            } else if(responseJson.location() == Location.BYREQUEST) {
                converterType = MessageConverterTpyeUtil.getMessageConverterTypeFromHttpHead(
                        webRequest.getHeader(ResponseDataType.HTTP_HEAD_REQUEST_DATA_TYPE));
                //设置http头
                switch (converterType) {
                    case MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON:
                        outputMessage.getHeaders().set(ResponseDataType.HTTP_HEAD_RESPONSE_DATA_TYPE,
                                ResponseDataType.TUNIU_RESPONSE_DATA_TYPE_JSON);
                        break;
                    case MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON_BASE64:

                        outputMessage.getHeaders().set(ResponseDataType.HTTP_HEAD_RESPONSE_DATA_TYPE,
                                ResponseDataType.TUNIU_RESPONSE_DATA_TYPE_JSON_BASE64);
                        break;
                    default:
                        messageConverter.write(result,
                                new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                                outputMessage);
                }
            } else {
                converterType = MessageConverterTpyeUtil.MESSAGE_CONVERTER_TYPE_JSON_BASE64;
            }
            if (responseJson.compressType() == ResponseJson.compressType.GZIP) {
                compressType = ClientCompressFactory.COMPRESS_GZIP;
            } else if (responseJson.compressType() == ResponseJson.compressType.SNAPPY) {
                compressType = ClientCompressFactory.COMPRESS_SNAPPY;
            } else if (responseJson.compressType() == ResponseJson.compressType.BYREQUEST) {
                //解析得到请求的压缩方式
                String dataCompressType = webRequest.getHeader(ClientCompressFactory.HTTP_HEAD_REQUEST_COMPRESSTYPE);
                if (null != dataCompressType) {
                    compressType = ClientCompressFactory.getCompressTypeFromHeanderString(dataCompressType);
                }
            }
            CompressHttpMessageConverter compressHttpMessageConverter = new CompressHttpMessageConverter(converterType, compressType);
            compressHttpMessageConverter.write(result,
                    new MediaType(MediaType.APPLICATION_JSON, Collections.singletonMap("charset", "UTF-8")),
                    outputMessage);

        }
    }

    protected ServletServerHttpResponse createOutputMessage(NativeWebRequest webRequest) {
        HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);
        return new ServletServerHttpResponse(response);
    }
}
