package com.zhiqin;

import java.util.List;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import com.zhiqin.util.annotation.JsonArgumentResolver;

@Controller
@EnableWebMvc
@SpringBootApplication
@MapperScan(basePackages = "com.zhiqin.mapper")
public class Application extends WebMvcConfigurationSupport {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    protected void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        // 注册JsonPathArgumentResolver的参数分解器
        argumentResolvers.add(new JsonArgumentResolver());
    }

    @RequestMapping("/")
    String home() {
        return "redirect:countries";
    }
}
