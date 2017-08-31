package com.zhiqin.common.annotation.responseJson;

import org.xerial.snappy.Snappy;
import org.xerial.snappy.SnappyInputStream;
import org.xerial.snappy.SnappyOutputStream;

import java.io.*;

public class SnappyUtils implements IClientCompressUtils {
    public static final String EXT = ".snappy";
    public static final int BUFFER = 1024;

    /**
     * 数据压缩
     */
    public byte[] compress(byte[] data) {
        byte[] output = null;
        try {
            byte[] testput = new byte[Snappy.maxCompressedLength(data.length)];
            int javaCompressedSize = Snappy.compress(data, 0, data.length, testput, 0);
            if (javaCompressedSize > 0) {
                output = new byte[javaCompressedSize];
                System.arraycopy(testput, 0, output, 0, javaCompressedSize);
            }
        } catch (IOException ioException) {

        }
        return output;
    }

    /**
     * 数据解压缩
     */
    public byte[] decompress(byte[] data) {
        byte[] output = null;
        try {
            int size = data.length * 3;
            output = new byte[size];
            int lastSize = Snappy.uncompress(data, 0, data.length, output, 0);
        } catch (IOException ioException) {

        }
        return output;
    }

    /**
     * 文件压缩
     */
    public String compress(File file) throws Exception {
        return compress(file, true);
    }

    /**
     * 文件压缩
     */
    public String compress(String path) throws Exception {
        return compress(path, false);
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
    public String decompress(File file) throws Exception {
        return decompress(file, false);
    }

    /**
     * 文件压缩
     */
    public String compress(String path, boolean delete) throws Exception {
        File file = new File(path);
        return compress(file, delete);
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
        SnappyOutputStream gos = new SnappyOutputStream(os);
        int count;
        byte data[] = new byte[BUFFER];
        while ((count = is.read(data, 0, BUFFER)) != -1) {
            gos.write(data, 0, count);
        }
        gos.flush();
        gos.close();
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
        SnappyInputStream gis = new SnappyInputStream(is);
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
    public String decompress(String path, boolean delete) throws Exception {
        File file = new File(path);
        return decompress(file, delete);
    }
}
