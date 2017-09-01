package com.zhiqin.common.annotation.responseJson.compress;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

/**
 * Created by zhangbinbin on 2017/8/31.
 */
public class GZipUtils implements IClientCompressUtils {
    public static final int BUFFER = 1024;
    public static final String EXT = ".gz";

    /**
     * 数据压缩
     */
    public byte[] compress(byte[] data) {
        byte[] output = null;
        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(data);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            // 压缩
            compress(bais, baos);
            output = baos.toByteArray();
            baos.flush();
            baos.close();
            bais.close();
        } catch (Exception e) {

        }
        return output;
    }

    /**
     * 文件压缩
     */
    public String compress(File file) throws Exception {
        return compress(file, false);
    }

    /**
     * 文件压缩
     */
    public String compress(File file, boolean delete) throws Exception {
        FileInputStream fis = new FileInputStream(file);
        FileOutputStream fos = new FileOutputStream(file.getPath() + EXT);
        compress(fis, fos);
        fis.close();
        fos.flush();
        fos.close();

        if (delete) {
            file.delete();
        }
        return file.getPath() + EXT;
    }

    /**
     * 数据压缩
     */
    public static void compress(InputStream is, OutputStream os)
            throws Exception {
        GZIPOutputStream gos = new GZIPOutputStream(os);
        int count;
        byte data[] = new byte[BUFFER];
        while ((count = is.read(data, 0, BUFFER)) != -1) {
            gos.write(data, 0, count);
        }
        gos.finish();
        gos.flush();
        gos.close();
    }

    /**
     * 文件压缩
     */
    public String compress(String path) throws Exception {
        return compress(path, false);
    }

    /**
     * 文件压缩
     */
    public String compress(String path, boolean delete) throws Exception {
        File file = new File(path);
        return compress(file, delete);
    }

    /**
     * 数据解压缩
     */
    public byte[] decompress(byte[] data) {
        byte[] out = null;
        try {
            ByteArrayInputStream bais = new ByteArrayInputStream(data);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            // 解压缩
            decompress(bais, baos);
            out = baos.toByteArray();
            baos.flush();
            baos.close();
            bais.close();
        } catch (Exception e) {

        }
        return out;
    }

    /**
     * 文件解压缩
     */
    public String decompress(File file) throws Exception {
        return decompress(file, false);
    }

    /**
     * 文件解压缩
     */
    public String decompress(File file, boolean delete) throws Exception {
        FileInputStream fis = new FileInputStream(file);
        FileOutputStream fos = new FileOutputStream(file.getPath().replace(EXT, ""));
        decompress(fis, fos);
        fis.close();
        fos.flush();
        fos.close();
        if (delete) {
            file.delete();
        }
        return file.getPath().replace(EXT, "");
    }

    /**
     * 数据解压缩
     */
    public static void decompress(InputStream is, OutputStream os)
            throws Exception {
        GZIPInputStream gis = new GZIPInputStream(is);
        int count;
        byte data[] = new byte[BUFFER];
        while ((count = gis.read(data, 0, BUFFER)) != -1) {
            os.write(data, 0, count);
        }
        gis.close();
    }

    /**
     * 文件解压缩
     */
    public String decompress(String path) throws Exception {
        return decompress(path, false);
    }

    /**
     * 文件解压缩
     */
    public String decompress(String path, boolean delete) throws Exception {
        File file = new File(path);
        return decompress(file, delete);
    }
}
