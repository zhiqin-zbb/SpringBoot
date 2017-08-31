package com.zhiqin.config;

import com.zhiqin.common.annotation.requestJson.JsonArgumentResolver;
import com.zhiqin.common.annotation.responseJson.ResponseJsonProcessor;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.DefaultBeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.PageInfoBeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.ResponseVoWrapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.ArrayList;
import java.util.List;

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
    public ResponseJsonProcessor jsonProcessor() {
        ResponseJsonProcessor responseJsonProcessor = new ResponseJsonProcessor();
        List<BeanWrapper> beanWrapperList = new ArrayList<>();
        beanWrapperList.add(new DefaultBeanWrapper());
        beanWrapperList.add(new ResponseVoWrapper());
        beanWrapperList.add(new PageInfoBeanWrapper());
        responseJsonProcessor.setBeanWrappers(beanWrapperList);
        return responseJsonProcessor;
    }

    @Override
    public void addReturnValueHandlers(List<HandlerMethodReturnValueHandler> returnValueHandlers) {
        returnValueHandlers.add(jsonProcessor());
    }
}
