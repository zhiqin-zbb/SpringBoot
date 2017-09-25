package com.zhiqin.config;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.HandlerMethodReturnValueHandler;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.util.UrlPathHelper;

import com.zhiqin.common.annotation.requestJson.JsonArgumentResolver;
import com.zhiqin.common.annotation.responseJson.ResponseJsonMethodProcessor;
import com.zhiqin.common.annotation.responseJson.converter.Base64JsonHttpMessageConverter;
import com.zhiqin.common.annotation.responseJson.wrapper.BeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.DefaultBeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.PageInfoBeanWrapper;
import com.zhiqin.common.annotation.responseJson.wrapper.impl.ResponseVoWrapper;
import com.zhiqin.common.date.LocalDateFormatter;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {
    /**
     * 使用webjars
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

    /**
     * 处理@Json注解
     */
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add(new JsonArgumentResolver());
    }

    /**
     * 处理@ResponseJson注解
     */
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

    /**
     * 处理LocalDate格式
     */
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addFormatterForFieldType(LocalDate.class, new LocalDateFormatter());
    }

    /**
     * 不再移除URL中分号之后的字符
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        UrlPathHelper urlPathHelper = new UrlPathHelper();
        urlPathHelper.setRemoveSemicolonContent(false);
        configurer.setUrlPathHelper(urlPathHelper);
    }
}
