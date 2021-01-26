package lg.sppCap.test;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FilenameUtils;
import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileItemStream;
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItemFactory;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;
import org.apache.tomcat.util.http.fileupload.util.Streams;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller
public class FileUploadController {

    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss", Locale.getDefault());
    
    @RequestMapping("/test/upload")
    public @ResponseBody String upload(MultipartHttpServletRequest request){ // @RequestPart List<MultipartFile> files
        System.out.println(">>> Enter upload");

        JSONObject retunObj = new JSONObject();

        String fileRootPath = File.separator + "tmp" + File.separator + "fileTemp" + File.separator; //폴더 경로
        File folder = new File(fileRootPath);

        System.out.println(fileRootPath);
        
        if (!folder.exists()){
            try{
                folder.mkdir();
                System.out.println("Create folder.");
            } catch(Exception e){
                e.getStackTrace();
            }        
        }

        List<MultipartFile> files = request.getFiles("uploadCollection");

        for (MultipartFile file : files) {
            String originalfileName = file.getOriginalFilename();

            System.out.println("originalfileName : " + originalfileName);

            File dest = new File(fileRootPath + originalfileName);
            try{
                file.transferTo(dest);
            } catch(Exception e){
                e.getStackTrace();
            }       
            // TODO
        }

        Enumeration<String> en = request.getParameterNames();
		while ( en.hasMoreElements() ){
			String name = en.nextElement();
			String[] values = request.getParameterValues(name);		
			for (String value : values) {
				System.out.println("name=" + name + ",value=" + value);
			}   
		}

        // String targetDir = null;
		// String targetFullPath = null;
		// String docId = null;
        
        // boolean isMultipart = ServletFileUpload.isMultipartContent(request);

        // try {			
		// 	long maxFileSize = 1024 * 1024 * 50; // default 50M			
        //     // maxFileSize = 1024 * 1024 * Integer.parseInt(FILE_UPLOAD_MAX_FILE_SIZE));
        //     maxFileSize = 1024 * 1024 * 100;
			
		// 	if (isMultipart) {	
		// 		DiskFileItemFactory factory = new DiskFileItemFactory();
	
		// 		factory.setSizeThreshold(10240);
		// 		factory.setRepository(folder);
	
		// 		ServletFileUpload upload = new ServletFileUpload(factory);	
		// 		upload.setSizeMax(maxFileSize);
	
        //         FileItemIterator itemIter = upload.getItemIterator(request);
				
		// 		JSONArray  files = new JSONArray();
		// 		JSONObject fileInfo = null;
		// 		BufferedInputStream bis = null;
				
		// 		String fieldName, fieldValue, prefix, randomFileName, itemName, contentType, sMtype, sExtensionType = null, sUploadTarget = null, sUploadSystem, extension;
		// 		byte[] data = null;
				
		// 		// while(itemIter.hasNext()){
		// 		// 	FileItemStream item = itemIter.next();
	
		// 		// 	if (item.isFormField()) {
        //         //         fieldName = item.getFieldName();                      

        //         //         InputStream stream = item.openStream();                        
        //         //         fieldValue = Streams.asString(stream);
        //         //         stream.close();
                        
        //         //         System.out.println("fieldName : " + fieldName);
        //         //         System.out.println("fieldValue : " + fieldValue);
                        
                        
												
		// 		// 		// if("extensionType".equalsIgnoreCase(fieldName)){
		// 		// 		// 	sExtensionType = fieldValue;	
		// 		// 		// }else if("uploadTarget".equalsIgnoreCase(fieldName)){
		// 		// 		// 	sUploadTarget = fieldValue;
							
		// 		// 		// 	if("editor".equalsIgnoreCase(sUploadTarget)) {	// Editor inner contents
		// 		// 		// 		//fileRootDir = dynamicConfig.getValue("namo.image.temp.dir");
		// 		// 		// 		fileRootDir = sResourcePath + NEPProperties.IMAGE_TEMP_DIR;
        //         //         //     }else if("FS".equalsIgnoreCase(sUploadTarget)) {
		// 		// 		// 		//fileRootDir = dynamicConfig.getValue("file.upload.publishDir");
		// 		// 		// 		fileRootDir = sResourcePath + NEPProperties.IMAGE_PUBLISH;
		// 		// 		// 	}
		// 		// 		// }
		// 		// 	}
		// 		// }
				
		// 		// if(null == fileRootDir) {
		// 		// 	throw new Exception("UploadTarget not exist");
		// 		// }
								
		// 		// List<Map<String, Object>> fileExtensionList;
		// 		// fileExtensionList = selectFileExtension(sExtensionType);
				
		// 		// if(0 >= fileExtensionList.size()){
		// 		// 	throw new Exception("Allow file extension not exist on DB");
		// 		// }
                
        //         System.out.println("Start Create File");
                
        //         itemIter = upload.getItemIterator(request);
				
		// 		while(itemIter.hasNext()){
        //             System.out.println("Start Create File - itemIter.hasNext");

		// 			FileItemStream item = itemIter.next();
					
		// 			if(!item.isFormField()){
        //                 System.out.println("Not FormField");

		// 				fileInfo = new JSONObject();
		// 				itemName = FilenameUtils.getName(item.getName());
		// 				contentType = item.getContentType();
						
		// 				if(itemName != null && contentType != null){	
		// 					if("".equalsIgnoreCase(itemName)) {
		// 						itemName = "pasteImage.png";
		// 					}
							
        //                     // bis = new BufferedInputStream(item.openStream());

		// 					sMtype = item.getContentType();
							
		// 					if(null == sMtype) {	// MIME Type이 없다면 파일명에서 확장자를 추출하여 재확인
		// 						sMtype = FilenameUtils.getExtension(itemName);
		// 					}
							
		// 					if(null == sMtype){
		// 						throw new Exception("Disallowed file type : " + itemName);
		// 					}
																											
		// 					// sMtype = sMtype.substring(sMtype.indexOf("/") + 1, sMtype.length());
			
		// 					// if(0 > fileExtensionList.get(0).toString().indexOf(sMtype.toLowerCase()) && 0 > fileExtensionList.get(0).toString().indexOf(sMtype.toUpperCase())) {
		// 					// 	throw new Exception("Disallowed file type : " + itemName);
		// 					// }
							
		// 					prefix = sdf.format(new Date());						
		// 					docId = prefix + UUID.randomUUID();
		// 					randomFileName = docId;
							
		// 					if(!"blob".equalsIgnoreCase(itemName)) {
		// 						extension = itemName.substring(itemName.lastIndexOf("."));	
		// 					}else {
		// 						extension = ".png";	 // IE DropDown Image일 경우(Editor inner contents)
		// 					}
							
		// 					// if("editor".equalsIgnoreCase(sUploadTarget)) {
		// 					// 	targetDir = fileRootDir;
		// 					// 	targetFullPath = fileRootDir + randomFileName + extension;
		// 					// }else if("FS".equalsIgnoreCase(sUploadTarget)){
		// 					// 	targetDir = fileRootDir;
		// 					// 	targetFullPath = targetDir + File.separator + randomFileName;	
		// 					// }else {
		// 						targetDir = fileRootPath + prefix.substring(0,8);
		// 						targetFullPath = targetDir + File.separator + randomFileName;	
		// 					// }
														
        //                     // item.write(new File(targetFullPath));

        //                     System.out.println("targetFullPath : " + targetFullPath);
                        
        //                     File newFile = new File(targetFullPath);
        //                     FileOutputStream fos = new FileOutputStream(newFile);

        //                     InputStream stream = item.openStream();     
        //                     long fileSize = Streams.copy(stream, fos, true);
        //                     stream.close();
							
		// 					// if("editor".equalsIgnoreCase(sUploadTarget)) {	// editor일 경우 src url을 위한 targetFullPath 변경
		// 					// 	//targetDir = dynamicConfig.getValue("namo.image.temp.url");
		// 					// 	targetDir = NEPProperties.IMAGE_TEMP_DIR;
		// 					// 	targetFullPath = targetDir + randomFileName + extension;
		// 					// }							
							
        //                     // fileSize = bis.available();
        //                     // bis.close();                            
		// 					// data = new byte[fileSize];
		// 					// bis.read(data);
							
		// 					fileInfo.put("DOC_ID", docId);
		// 					fileInfo.put("ORI_NAME", itemName);
		// 					fileInfo.put("EXTENSION", extension.substring(extension.lastIndexOf(".") + 1));
		// 					// fileInfo.addProperty("TARGET_FULL_PATH", targetFullPath);
		// 					fileInfo.put("SIZE", fileSize);
		// 					files.put(fileInfo);
		// 				}
		// 			} else{
        //                 fieldName = item.getFieldName();                      

        //                 InputStream stream = item.openStream();                        
        //                 fieldValue = Streams.asString(stream);
        //                 stream.close();

        //                 System.out.println("fieldName : " + fieldName);
        //                 System.out.println("fieldValue : " + fieldValue);
        //             }
        //         } // while : fileItemIte		
                	
		// 		retunObj.put("FILES", files);
		// 		retunObj.put("RST_CD", "S");
		// 		// isMultiPart
		// 	}else {
		// 		retunObj.put("RST_MSG", "Not a multipart Content");
		// 	}
		// } catch (Exception e) {
		// 	retunObj.put("RST_MSG", e.getLocalizedMessage());
		// 	System.err.println("===>>> FileUpload Error : " + e.getMessage());
		// }

        // // for (MultipartFile file : files) {
        // //     String originalfileName = file.getOriginalFilename();
        // //     System.out.println("/Service/FileUpload : " + originalfileName);

        // //     JsonObject obj = new JsonObject();
        // //     obj.addProperty("originalfileName", originalfileName);
        // //     retunObj.add("fileList", obj);

        // //     // File dest = new File("C:/Image/" + originalfileName);
        // //     // file.transferTo(dest);
        // //     // TODO
        // // }

        return retunObj.toString();
    }
}