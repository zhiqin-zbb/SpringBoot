package com.zhiqin.util.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;

import com.zhiqin.util.wrapper.Base64HttpServletRequestWrapper;

/**
 * Created by zhangbinbin on 2017/8/28.
 */
public class Base64DecodingFilter implements Filter {
    private PathMatcher matcher = new AntPathMatcher();
    private List<String> noDecodeList = new ArrayList<>();

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        String noDecodeStr = filterConfig.getInitParameter("noDecode");
        if (null != noDecodeStr) {
            StringTokenizer st = new StringTokenizer(noDecodeStr, ",");
            noDecodeList.clear();
            while (st.hasMoreTokens()) {
                noDecodeList.add(st.nextToken());
            }
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;
        if (ifContainsInNoDecodeList(req.getServletPath())) {
            chain.doFilter(req, resp);
        } else {
            Base64HttpServletRequestWrapper decodedRequest = new Base64HttpServletRequestWrapper(req);
            chain.doFilter(decodedRequest, resp);
        }
    }

    @Override
    public void destroy() {
        // TODO Auto-generated method stub
    }

    /**
     * 判断一个url是否在排除列表内
     *
     * @param servletPath
     * @return true在排除列表中； false不在排除列表中
     */
    private boolean ifContainsInNoDecodeList(String servletPath) {
        boolean ret = false;
        if (noDecodeList.contains(servletPath)) {
            ret = true;
        } else if (!noDecodeList.isEmpty()) {
            for (String filtermapping : noDecodeList) {
                if (matcher.match(filtermapping, servletPath)) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }
}
