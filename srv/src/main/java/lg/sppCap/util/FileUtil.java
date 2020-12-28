package lg.sppCap.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.net.URL;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.io.FileUtils;

public class FileUtil {

    private static final String DEFAULT_ENCODING = "euc-kr";

    public static void copyFile(File srcFile, File destFile) throws IOException {
        FileUtils.copyFile(srcFile, destFile);
    }

    public static void copyFileToDirectory(File srcFile, File destDir) throws IOException {
        FileUtils.copyFileToDirectory(srcFile, destDir);
    }

    public static void copyURLToFile(URL source, File destination) throws IOException {
        FileUtils.copyURLToFile(source, destination);
    }

    public static boolean createDirectory(String path) {
        File dir = new File(path);
        return createDirectory(dir);
    }

    public static boolean createDirectory(File dir) {
        if (dir.exists() && dir.isDirectory())
            return true;
        if (dir.exists() && !dir.isDirectory())
            return false;
        return dir.mkdirs();
    }

    public static void deleteDirectory(File directory) throws IOException {
        FileUtils.deleteDirectory(directory);
    }

    public static void deleteFile(File file) throws IOException {
        if (file.isDirectory()) {
            throw new IllegalArgumentException("Destination '" + file.getAbsolutePath() + "' is a directory");
        }
        FileUtils.forceDelete(file);
    }

    public static void moveFile(File srcFile, File destFile) throws IOException {
        File destDir = destFile.getParentFile();

        if (!destDir.exists()) {
            createDirectory(destDir);
        }

        if (srcFile.renameTo(destFile)) {
            return;
        }

        copyFileToDirectory(srcFile, destDir);
        deleteFile(srcFile);
    }

    public static void moveFileToDirectory(File srcFile, File destDir) throws IOException {
        File destFile = new File(destDir, srcFile.getName());

        if (!destDir.exists()) {
            createDirectory(destDir);
        }

        if (srcFile.renameTo(destFile)) {
            return;
        }

        copyFileToDirectory(srcFile, destDir);
        deleteFile(srcFile);
    }

    public static void forceDelete(File file) throws IOException {
        FileUtils.forceDelete(file);
    }

    public static FileInputStream openInputStream(File file) throws IOException {
        return new FileInputStream(file);
    }

    public static byte[] readFileToByteArray(File file) throws IOException {
        return FileUtils.readFileToByteArray(file);
    }

    public static String readFileToString(File file) throws IOException {
        return FileUtils.readFileToString(file, DEFAULT_ENCODING);
    }

    public static String readFileToString(File file, String encoding) throws IOException {
        return FileUtils.readFileToString(file, encoding);
    }

    public static List readLines(File file) throws IOException {
        return FileUtils.readLines(file, DEFAULT_ENCODING);
    }

    public static List readLines(File file, String encoding) throws IOException {
        return FileUtils.readLines(file, encoding);
    }

    public static void touch(java.io.File file) throws IOException {
        FileUtils.touch(file);
    }

    public static void writeByteArrayToFile(File file, byte[] data) throws IOException {
        FileUtils.writeByteArrayToFile(file, data);
    }

    public static void writeLines(java.io.File file, Collection lines) throws IOException {
        FileUtils.writeLines(file, DEFAULT_ENCODING, lines);
    }

    public static void writeLines(java.io.File file, Collection lines, String lineEnding) throws IOException {
        FileUtils.writeLines(file, DEFAULT_ENCODING, lines, lineEnding);
    }

    public static void writeLines(java.io.File file, String encoding, Collection lines) throws IOException {
        FileUtils.writeLines(file, encoding, lines);
    }

    public static void writeLines(java.io.File file, String encoding, Collection lines, String lineEnding)
            throws IOException {
        FileUtils.writeLines(file, encoding, lines, lineEnding);
    }

    public static void writeStringToFile(File file, String data) throws IOException {
        FileUtils.writeStringToFile(file, data, DEFAULT_ENCODING);
    }

    public static void writeStringToFile(File file, String data, String encoding) throws IOException {
        FileUtils.writeStringToFile(file, data, encoding);
    }

    public static File newFile(String filePath) throws IOException {
        File file = createFile(filePath);
        file.createNewFile();

        return file;
    }

    public static boolean remove(String filePath) throws IOException {
        return removeFile(new File(filePath));
    }

    public static boolean removeQuietly(String filePath) {
        boolean result = false;

        try {
            result = remove(filePath);
        } catch (IOException ie) {
            // LOG.warn( "file remove failed", ie );
        }

        return result;
    }

    public static boolean exists(String filePath) {
        return new File(filePath).exists();
    }

    public static File createFile(String filePath) {
        File file = new File(filePath);
        File parentFile = file.getParentFile();

        if (parentFile != null && !parentFile.exists()) {
            parentFile.mkdirs();
        }

        return file;
    }

    public static boolean mkDirs(String dirPath) {
        return new File(dirPath).mkdirs();
    }

    public static boolean removeFile(File file) {
        boolean result = false;

        if (file.exists()) {
            if (file.isDirectory()) {
                result = removeDirs(file);
            } else {
                result = file.delete();
            }
        }

        return result;
    }

    private static boolean removeDirs(File file) {
        boolean result = false;

        if (file.exists() && file.isDirectory()) {
            cleanDirs(file);
            result = file.delete();
        }

        return result;
    }

    public static boolean cleanDirs(File file) {
        boolean result = false;
        List fileList = Arrays.asList(file.listFiles());

        if (fileList != null && fileList.size() > 0) {
            for (Iterator it = fileList.iterator(); it.hasNext();) {
                File listFile = (File) it.next();
                removeFile(listFile);
            }

            result = true;
        }

        return result;
    }

    public static void close(Reader reader) {
        try {
            reader.close();
        } catch (Exception e) {
        }
    }

    public static void close(Writer writer) {
        try {
            writer.close();
        } catch (Exception e) {
        }
    }

    public static void close(InputStream is) {
        try {
            is.close();
        } catch (Exception e) {
        }
    }

    public static void close(OutputStream os) {
        try {
            os.close();
        } catch (Exception e) {
        }
    }

    public static String findFile(String directory) {
        String textFile = "";
        File dir = new File(directory);
        for (File file : dir.listFiles()) {
            if (file.getName().endsWith((".html"))) {
                textFile = file.getName();
            }
        }
        return textFile;
    }
}
