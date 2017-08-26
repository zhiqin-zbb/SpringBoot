package com.zhiqin.util.annotation;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Created by zhangbinbin on 2017/8/23.
 */
public class JsonArgumentResolver implements HandlerMethodArgumentResolver {
    private static final String JSONBODYATTRIBUTE = "JSON_REQUEST_BODY";

    private ObjectMapper om = new ObjectMapper();

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(Json.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        String jsonBody = getRequestBody(webRequest);

        JsonNode rootNode = om.readTree(jsonBody);
        JsonNode node = rootNode.path(parameter.getParameterName());

        return om.readValue(node.toString(), parameter.getParameterType());
    }

    private String getRequestBody(NativeWebRequest webRequest) {
        HttpServletRequest servletRequest = webRequest.getNativeRequest(HttpServletRequest.class);

        String jsonBody = (String) webRequest.getAttribute(JSONBODYATTRIBUTE, NativeWebRequest.SCOPE_REQUEST);
        if (jsonBody==null){
            try {
                jsonBody = IOUtils.toString(servletRequest.getInputStream());
                webRequest.setAttribute(JSONBODYATTRIBUTE, jsonBody, NativeWebRequest.SCOPE_REQUEST);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return jsonBody;
    }
}
