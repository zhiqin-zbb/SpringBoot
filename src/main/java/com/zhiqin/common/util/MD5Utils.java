package com.zhiqin.common.util;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SignatureException;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author zhangbinbin
 * @version 2017/11/17
 */
public class MD5Utils {
    private final static Logger logger = LoggerFactory.getLogger(MD5Utils.class);

    /**
     * 获取签名字符串
     *
     * @param text 需要签名的字符串
     * @return 签名结果
     */
    public static String sign(String text) {
        return sign(text, "", "UTF-8");
    }

    /**
     * 获取签名字符串
     *
     * @param text    需要签名的字符串
     * @param charset 编码格式
     * @return 签名结果
     */
    public static String sign(String text, String charset) {
        return sign(text, "", charset);
    }

    /**
     * 获取签名字符串
     *
     * @param text    需要签名的字符串
     * @param key     密钥
     * @param charset 编码格式
     * @return 签名结果
     */
    public static String sign(String text, String key, String charset) {
        return DigestUtils.md5Hex(getContentBytes(text + key, charset));
    }

    /**
     * 验证签名字符串
     *
     * @param text 需要签名的字符串
     * @param sign 签名结果
     * @return 签名结果
     */
    public static boolean verify(String text, String sign) {
        return verify(text, "", sign, "UTF-8");
    }

    /**
     * 验证签名字符串
     *
     * @param text    需要签名的字符串
     * @param sign    签名结果
     * @param charset 编码格式
     * @return 签名结果
     */
    public static boolean verify(String text, String sign, String charset) {
        return verify(text, "", sign, charset);
    }

    /**
     * 验证签名字符串
     *
     * @param text    需要签名的字符串
     * @param key     密钥
     * @param sign    签名结果
     * @param charset 编码格式
     * @return 签名结果
     */
    public static boolean verify(String text, String key, String sign, String charset) {
        String mySign = DigestUtils.md5Hex(getContentBytes(text + key, charset));
        return mySign.equals(sign);
    }

    /**
     * @param content 字符串
     * @param charset 编码格式
     * @return
     * @throws SignatureException
     * @throws UnsupportedEncodingException
     */
    private static byte[] getContentBytes(String content, String charset) {
        if (charset == null || "".equals(charset)) {
            return content.getBytes();
        }
        try {
            return content.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("MD5签名过程中出现错误,指定的编码集不对,您目前指定的编码集是:" + charset);
        }
    }

    /**
     * MD5加密字符串
     *
     * @param strObj 初始字符串
     * @return 加密后字符串
     */
    public static String getMD5Code(String strObj) {
        String resultString = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            resultString = bytesToHexString(md.digest(strObj.getBytes("UTF-8")));
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            logger.error("get MD5 code error, str: " + strObj, e);
        }
        return resultString;
    }

    /**
     * 转换字节数组为16进制小写字符串
     *
     * @param bByte 字节数组
     * @return 16进制小写字符串
     */
    private static String bytesToHexString(byte[] bByte) {
        StringBuilder stringBuilder = new StringBuilder();
        for (int i = 0; i < bByte.length; i++) {
            int num = bByte[i];
            if (num < 0) {
                num += 256;
            }
            stringBuilder.append(Integer.toHexString(num));
        }
        return stringBuilder.toString().toLowerCase();
    }
}
