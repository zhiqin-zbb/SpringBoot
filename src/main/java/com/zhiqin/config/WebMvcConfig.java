package com.zhiqin.config;

import java.util.ArrayList;
import java.util.List;

import com.zhiqin.common.annotation.responseJson.wrapper.impl.PageInfoBeanWrapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.zhiqin.common.annotation.requestJson.JsonArgumentResolver;
import com.zhiqin.common.annotation.responseJson.ResponseJsonMethodProcessor;
import com.zhiqin.common.annotation.responseJson.converter.Base64JsonHttpMessageConverter;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.DefaultBeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.ResponseVoWrapper;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new JsonArgumentResolver());
    }

    @Bean
    public ResponseJsonMethodProcessor getResponseJsonMethodProcessor() {
        ResponseJsonMethodProcessor responseJsonMethodProcessor = new ResponseJsonMethodProcessor();

        List<BeanWrapper> beanWrapperList = new ArrayList<>();
        beanWrapperList.add(new PageInfoBeanWrapper());
        beanWrapperList.add(new ResponseVoWrapper());
        beanWrapperList.add(new DefaultBeanWrapper());
        responseJsonMethodProcessor.setBeanWrappers(beanWrapperList);

        Base64JsonHttpMessageConverter base64JsonHttpMessageConverter = new Base64JsonHttpMessageConverter();
        responseJsonMethodProcessor.setMessageConverter(base64JsonHttpMessageConverter);

        return responseJsonMethodProcessor;
    }

    @Override
    public void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> returnValueHandlers) {
        returnValueHandlers.add(getResponseJsonMethodProcessor());
    }
}
