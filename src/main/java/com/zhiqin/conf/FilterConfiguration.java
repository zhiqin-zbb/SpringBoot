package com.zhiqin.conf;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zhiqin.util.filter.Base64DecodingFilter;

/**
 * Created by zhangbinbin on 2017/8/28.
 */
@Configuration
public class FilterConfiguration {
    @Bean
    public FilterRegistrationBean filter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        // 注入过滤器
        registration.setFilter(new Base64DecodingFilter());
        // 拦截规则
        registration.addUrlPatterns("/*");
        // 过滤器名称
        registration.setName("base64DecodingFilter");
        // 是否自动注册
        registration.setEnabled(true);
        // 过滤器顺序
        registration.setOrder(1);
        // 初始化参数
        registration.addInitParameter("noDecode", "/users/save");

        return registration;
    }
}
