package lg.sppCap.test;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.util.Streams;
import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FileUploadController {

    private final static String BROWSER_INTERNET_EXPLORER	= "IE";
	private final static String BROWSER_CHROME 				= "CR";
	private final static String BROWSER_FIREFOX				= "FF";
	private final static String BROWSER_SAFARI				= "SF";
	private final static String BROWSER_OPERA				= "OP";

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss", Locale.getDefault());

    @RequestMapping("/test/upload")
    public @ResponseBody String upload(HttpServletRequest request, @RequestHeader Map<String, String> headers) {
        System.out.println(">>> Enter upload");

        JSONObject retunObj = new JSONObject();

        String fileRootPath = File.separator + "tmp" + File.separator + "fileTemp" + File.separator; // 폴더 경로
        File folder = new File(fileRootPath);

        System.out.println(fileRootPath);

        if (!folder.exists()) {
            try {
                folder.mkdir();
                System.out.println("Create folder.");
            } catch (Exception e) {
                e.getStackTrace();
            }
        }

        InputStream inputStream = null;
        FileOutputStream fileOutputStream = null;

        try {
            headers.forEach((key, value) -> {
                 System.out.println(String.format("Header '%s' = %s", key, value));
            });

            String originalfileName = headers.get("filename");
            String extention = originalfileName.substring(originalfileName.lastIndexOf(".") + 1, originalfileName.length());
            String groupId = headers.get("groupid");

            inputStream = request.getInputStream();

            File newFile = new File(fileRootPath + originalfileName);
            fileOutputStream = new FileOutputStream(newFile);            
            long fileSize = Streams.copy(inputStream, fileOutputStream, true);

            System.out.println("fileSize : " + fileSize); 

            retunObj.put("result", "success");
            retunObj.put("groupId", groupId);
            retunObj.put("fileId",  java.util.UUID.randomUUID());
            retunObj.put("fileName", originalfileName);
            retunObj.put("fileSize", fileSize);
            retunObj.put("uploadDate", sdf.format(new Date()));
            retunObj.put("fileExt", extention);
            retunObj.put("message", "");            
        } catch (IOException e) {
            e.printStackTrace();
            retunObj.put("result", "fail");
            retunObj.put("message", "Upload Fail");     
        } finally {   
            try {
                if (fileOutputStream != null) { fileOutputStream.close(); }
                if (inputStream != null){ inputStream.close(); }
            }catch(Exception e){
                e.printStackTrace();
            }
        }

        return retunObj.toString();
    }

    @RequestMapping("/test/download")
    public void fileDownload(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setCharacterEncoding("UTF-8");
    	
		FileInputStream inStream = null;			
		OutputStream outStream = null;
		
		JSONObject returnValue = new JSONObject();
		returnValue.put("RST_CD", "F");

		try {			
            String oriFileName = "1.jpg";
            String fileRootPath = File.separator + "tmp" + File.separator + "fileTemp" + File.separator + oriFileName; // 폴더 경로
            
            File file = new File(fileRootPath);			
                    
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/octet-stream;charset=utf-8");
            response.setHeader("Content-Transper-Encoding", "binary");
            response.setHeader("Content-Disposition", getDisposition(oriFileName, checkBrowser(request)));

            inStream = new FileInputStream(file);			
            outStream = response.getOutputStream();
        
            byte[] buffer = new byte[4096];
            int bytesRead = -1;

            while ((bytesRead = inStream.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
		} catch (Exception e) {
			returnValue.put("RST_MSG", e.getLocalizedMessage());
			response.getWriter().println(returnValue.toString());
		} finally {
			try {
				if(null != inStream) {
					inStream.close();
					outStream.close();	
				}					
			} catch (Exception e) {
				e.printStackTrace();
			}			
		}	
    }

	private String getDisposition(String fileName, String browserName) throws UnsupportedEncodingException {
		String prefix = "attachment;filename=";
		String encodedFileName = null;
		
		if ( BROWSER_INTERNET_EXPLORER.equals(browserName) || BROWSER_CHROME.equals(browserName) ) {
			encodedFileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
		} else {
			encodedFileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
		}
		
		return prefix + encodedFileName;
	}

    private String checkBrowser(HttpServletRequest request) {
		String browserName = "";
		String userAgent = request.getHeader("User-Agent");
		
		if ( userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1 ) {
			browserName = BROWSER_INTERNET_EXPLORER;
		} else if ( userAgent.indexOf("Chrome") > -1 ) {
			browserName = BROWSER_CHROME;
		} else if ( userAgent.indexOf("Opera") > -1 ) {
			browserName = BROWSER_OPERA;
		} else if ( userAgent.indexOf("Apple") > -1 ) {
			browserName = BROWSER_SAFARI;
		} else {
			browserName = BROWSER_FIREFOX;
		}
		
		return browserName;
	}
}