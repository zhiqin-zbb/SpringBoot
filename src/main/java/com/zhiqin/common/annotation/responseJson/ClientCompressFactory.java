package com.zhiqin.common.annotation.responseJson;

public class ClientCompressFactory {
    public static final int COMPRESS_GZIP = 1;

    public static final int COMPRESS_SNAPPY = 2;

    public static final int COMPRESS_UNKNOW = 0;

    public static final int COMPRESS_DEFAULT = COMPRESS_SNAPPY;

    /**
     * http 请求头 请求的数据压缩方式
     */
    public static  final String HTTP_HEAD_REQUEST_COMPRESSTYPE = "TN-REQ-COMPRESS-TYPE";

    /**
     * http 传入数据的压缩方式
     */
    public static  final String HTTP_HEAD_DATA_COMPRESSTYPE = "TN-DATA-COMPRESS-TYPE";

    //压缩方式填充字符串
    public static final String COMPRESS_NAME_SNAPPY = "T-SNAPPY";
    public static final String COMPRESS_NAME_GZIP = "T-GZIP";

    public static IClientCompressUtils getCompressUtils(int compressType) {
        IClientCompressUtils iClientCompressUtils = null;
        switch (compressType) {
            case COMPRESS_GZIP:
                iClientCompressUtils = new GZipUtils();
                break;
            case COMPRESS_SNAPPY:
                iClientCompressUtils = new SnappyUtils();
                break;
            default:
                iClientCompressUtils = new SnappyUtils();
                break;
        }
        return iClientCompressUtils;
    }

    public static IClientCompressUtils getCompressUtils() {
        return getCompressUtils(COMPRESS_DEFAULT);
    }

    /**
     * 判断压缩方式
     */
    public static int getCompressTypeFromHeanderString(String header) {
        int type = ClientCompressFactory.COMPRESS_UNKNOW;
        if (header != null || header.isEmpty()) {
            if (header.compareToIgnoreCase(ClientCompressFactory.COMPRESS_NAME_SNAPPY) == 0) {
                type = ClientCompressFactory.COMPRESS_SNAPPY;
            } else if (header.compareToIgnoreCase(ClientCompressFactory.COMPRESS_NAME_GZIP) == 0) {
                type = ClientCompressFactory.COMPRESS_GZIP;
            }
        }
        return type;
    }
}
