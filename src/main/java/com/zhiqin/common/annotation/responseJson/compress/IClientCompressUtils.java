package com.zhiqin.common.annotation.responseJson.compress;

import java.io.File;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public interface IClientCompressUtils {
    /**
     * 数据压缩
     *
     * @param data
     * @return
     * @throws Exception
     */
    public byte[] compress(byte[] data);

    /**
     * 数据解压缩
     *
     * @param data
     * @return
     * @throws Exception
     */
    public byte[] decompress(byte[] data);

    /**
     * 文件压缩
     *
     * @param file
     * @throws Exception
     */
    public String compress(File file) throws Exception;

    /**
     * 文件压缩
     *
     * @param file
     * @param delete 是否删除原始文件
     * @throws Exception
     */
    public String compress(File file, boolean delete) throws Exception;

    /**
     * 文件压缩
     *
     * @param path
     * @throws Exception
     */
    public String compress(String path) throws Exception;

    /**
     * 文件压缩
     *
     * @param path
     * @param delete 是否删除原始文件
     * @throws Exception
     */
    public String compress(String path, boolean delete) throws Exception;

    /**
     * 文件解压缩
     *
     * @param path
     * @throws Exception
     */
    public String decompress(String path) throws Exception;

    /**
     * 文件解压缩
     *
     * @param path
     * @param delete 是否删除原始文件
     * @throws Exception
     */
    public String decompress(String path, boolean delete) throws Exception;

    /**
     * 文件解压缩
     *
     * @param file
     * @throws Exception
     */
    public String decompress(File file) throws Exception;

    /**
     * 文件解压缩
     *
     * @param file
     * @param delete 是否删除原始文件
     * @throws Exception
     */
    public String decompress(File file, boolean delete) throws Exception;
}
