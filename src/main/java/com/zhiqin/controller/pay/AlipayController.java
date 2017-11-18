package com.zhiqin.controller.pay;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;

import net.guerlab.sdk.alipay.controller.AlipayAbstractController;

/**
 * @author zhangbinbin
 * @version 2017/11/17
 */
@Controller
@RequestMapping("/pay/alipay")
public class AlipayController extends AlipayAbstractController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private AlipayClient alipayClient;

    @RequestMapping("/{orderId}")
    public String alipay(@PathVariable Long orderId, HttpServletResponse httpResponse, ModelMap map) throws ServletException, IOException {
        AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();
        alipayRequest.setReturnUrl("http://localhost:8080/springboot/login");
        alipayRequest.setNotifyUrl("http://domain.com/CallBack/notify_url.jsp");
        alipayRequest.setBizContent("{" +
                "    \"out_trade_no\":\"20150320010101001\"," +
                "    \"product_code\":\"FAST_INSTANT_TRADE_PAY\"," +
                "    \"total_amount\":88.88," +
                "    \"subject\":\"Iphone6 16G\"," +
                "    \"body\":\"Iphone6 16G\"," +
                "    \"passback_params\":\"merchantBizType%3d3C%26merchantBizNo%3d2016010101111\"," +
                "    \"extend_params\":{" +
                "    \"sys_service_provider_id\":\"2088511833207846\"" +
                "    }" +
                "  }");
        String form = "";
        try {
            form = alipayClient.pageExecute(alipayRequest).getBody();
        } catch (AlipayApiException e) {
            e.printStackTrace();
        }
        map.addAttribute("form", form);
        return "pay/alipay";
    }

    @PostMapping("/notify")
    public String notify(HttpServletRequest request) {
        if (!notify0(request.getParameterMap())) {
            return "failure";
        }

        // 获取请求参数中的商户订单号
        String tradeNo = request.getParameter("trade_no");
        String outTradeNo = request.getParameter("out_trade_no");
        String tradeStatus = request.getParameter("trade_status");
        logger.info(outTradeNo + ":" + tradeStatus);
        return "success";
    }
}
