package lg.sppCap.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOError;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;
import com.nimbusds.jose.util.StandardCharset;
import com.sap.xsa.core.instancemanager.util.Json;
import com.squareup.okhttp.MediaType;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.RequestBody;
import com.squareup.okhttp.Response;
import com.squareup.okhttp.ResponseBody;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.olingo.odata2.api.commons.HttpContentType;
import org.apache.tomcat.jni.FileInfo;
import org.apache.tomcat.util.http.fileupload.util.Streams;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.RequestEntity.BodyBuilder;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.security.access.method.P;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lg.sppCap.frame.dto.FileResponse;
import lg.sppCap.frame.dto.UploadFile;
import lg.sppCap.frame.dto.cm.FileDtlDto;
import lg.sppCap.frame.dto.cm.FileMstDto;
import lg.sppCap.frame.repository.FileDtlRepository;
import lg.sppCap.frame.repository.FileMstRepository;
import lg.sppCap.solutionized.bizrule.okhttp.OkHttpClientInstance;
import okio.Okio;

@RestController
@RequestMapping("/cm/fileupload/api")
public class FileUploadApiController {

    public static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private final static Logger log = LoggerFactory.getLogger(FileUploadApiController.class);

    // @Autowired
    // OkHttpClient httpClient;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private FileMstRepository fileMStRepository;

    @Autowired
    private FileDtlRepository fileDtlRepository;

    @Value("${app.dms.rootFolderId}") 
    String dmsRootFolderId;

    @Value("${app.dms.endpoint}") 
    String dmsEndpoint;

    @Value("${app.dms.repositoryId}") 
    String dmsRepositoryId;

    @Value("${app.dms.globalPolicy.allowFileExt}")
    String dmsCommonAllowFileExt;

    @Value("${app.dms.globalPolicy.maxFileSize}")
    String dmsMaxFileSize;

    private Map<String, String> getFileInfo(String fileId) throws Exception{
        Map<String, String> result = new HashMap<>();
        OkHttpClient client = getOkHttpClient(60);
        String token = getToken();
        String url = this.getFullEndpoint() + "?objectId=" + fileId + "&cmisSelector=object";

        Request request = new Request.Builder()
        .url(url)
        .addHeader("Authorization", token)
        .method("GET", null)
        .build();

        Response response = client.newCall(request).execute(); 
        String respJson = response.body().string();


        if (response.isSuccessful()){
            result.put("STATUS", "SUCCESS");
            result.put("FILE_ID",JsonParser.parseString(respJson).getAsJsonObject()
                .get("properties").getAsJsonObject()
                .get("cmis:objectId").getAsJsonObject()
                .get("value").getAsString());
            result.put("FILE_NAME",JsonParser.parseString(respJson).getAsJsonObject()
                .get("properties").getAsJsonObject()
                .get("cmis:name").getAsJsonObject()
                .get("value").getAsString());
            result.put("MESSAGE","");


        } else {
            result.put("STATUS", "FAIL");
            result.put("FILE_ID", fileId);
            result.put("FILE_NAME","");
            result.put("MESSAGE",JsonParser.parseString(respJson).getAsJsonObject().get("exception").getAsString());
        }

        return result;

    }


    private String getFullEndpoint() {
        // https://api-sdm-di.cfapps.jp10.hana.ondemand.com/browser/71edc6c7-d9a0-450d-a9ce-9a19d5922bbe/root/
        return dmsEndpoint + "/" + "browser" + "/" + dmsRepositoryId + "/root/";
    }

    private Integer getMaxFileSize(String maxFileSize) {
        return Integer.valueOf(maxFileSize.split("MB")[0]) * 1024 * 1024;
    }

    // SELECT cmis:name, cmis:objectId FROM cmis:document WHERE (cmis:name LIKE '%추가%') and (ANY sap:parentIds IN ('2HbfikpRqzaEUZRAqgPXNh5kwhlPsSO8YXy373Bj5aI') )
    
    public Map<String, String> isExists(String folderId, String filename, String type) throws Exception{
        OkHttpClient client = new OkHttpClient();
        Map<String, String> result = new HashMap<>();
        String token = getToken();

        String url = "https://api-sdm-di.cfapps.jp10.hana.ondemand.com/browser/71edc6c7-d9a0-450d-a9ce-9a19d5922bbe?cmisSelector=query&succinct=true&q=";
        String query = "SELECT cmis:name, cmis:objectId FROM cmis:"+ type +" WHERE (cmis:name = '" + filename + "') and (ANY sap:parentIds IN ('" + folderId + "'))";

        Request request = new Request.Builder()
            .url(url+query)
            .method("GET", null)
            .addHeader("Authorization", token)
            .build();

        Response response = client.newCall(request).execute();

        ResponseBody respBody = response.body();
        String respJson = respBody.string();

        if (response.isSuccessful()) {
            if (respBody != null) {
                JsonElement element = JsonParser.parseString(respJson);
                JsonArray results =  element.getAsJsonObject().get("results").getAsJsonArray();
                String objectId = "-1";
                if (results.size() == 1){
                    JsonElement object = results.get(0);
                    objectId = object.getAsJsonObject().get("succinctProperties").getAsJsonObject().get("cmis:objectId").getAsString();
                    result.put("STATUS", "SUCCESS");
                    result.put("OBJECT_ID", objectId);

                } else {
                    result.put("STATUS", "FAIL");
                    result.put("OBJECT_ID", objectId);
                }
            }
        } else {
            System.out.println("Response Error");
            result.put("STATUS", "FAIL");
            result.put("OBJECT_ID", "Invalid Query");
        }

        return result;
    }
    /**
     * 일별 폴더 생성
     * @return 
     * @throws Exception
     */
    public Map<String, String> createAutoFolder() throws Exception{
        Map<String, String> result = new HashMap<>();

        OkHttpClient client = new OkHttpClient();
        String token = getToken();
        String folderName = LocalDate.now().toString();
        Map<String, String> folderMap = isExists(dmsRootFolderId, folderName, "folder");
        String folderId = dmsRootFolderId;

        if (folderMap.get("STATUS").equals("SUCCESS")) {
            folderId = folderMap.get("OBJECT_ID");
            result.put("STATUS", "SUCCESS");
            result.put("FOLDER_ID", folderId);

            return result;

        }

        RequestBody body = new MultipartBuilder().type(MultipartBuilder.FORM)
            .addFormDataPart("objectId", folderId)
            .addFormDataPart("cmisaction","createFolder")
            .addFormDataPart("propertyId[0]","cmis:name")
            .addFormDataPart("propertyValue[0]",folderName)
            .addFormDataPart("propertyId[1]","cmis:objectTypeId")
            .addFormDataPart("propertyValue[1]","cmis:folder")
            .addFormDataPart("succinct","true")
            .build();

        Request request = new Request.Builder().url(this.getFullEndpoint())
                .addHeader("Authorization", token).addHeader("Content-Type", "multipart/form-data")
                .method("POST", body).build();

        Response response = client.newCall(request).execute();

        ResponseBody respBody = response.body();
        String respJson = respBody.string();
        if (response.isSuccessful()) {
            if (respBody != null) {
                String objectId = JsonParser.parseString(respJson).getAsJsonObject()
                        .get("succinctProperties").getAsJsonObject().get("cmis:objectId").getAsString();
                result.put("STATUS", "SUCCESS");
                result.put("FOLDER_ID", objectId);
            }
        } else {
            result.put("STATUS", "FAIL");            
            result.put("FOLDER_ID",
                    JsonParser.parseString(respJson).getAsJsonObject().get("message").getAsString());
        }
        return result;
    }

    // public Map<String, String> getDocuInfo(String objectId){

    // }

    /**
     * OkHttpClinet 싱글톤 객체
     * @return
     */
    protected OkHttpClient getOkHttpClient(Integer timeout) {
        OkHttpClient instance = OkHttpClientInstance.getInstance();
        instance.setConnectTimeout(timeout, TimeUnit.SECONDS);
        return instance;
    }

    /**
     * DMS 시스템 접근을 위한 Token
     */
    public String getToken() throws Exception {
        OkHttpClient client = getOkHttpClient(60);
        // OkHttpClient instance = OkHttpClientInstance.getInstance();

        RequestBody body = RequestBody.create(JSON, "{}");
        Map<Object, Object> map = new HashMap<Object, Object>();

        Request request = new Request.Builder().addHeader("Authorization",
                "Basic c2ItODk3ZDE4ZTgtODFiZC00ODgyLWIyMGEtZGNiMmUxOWIxOWJlIWI1MjJ8c2RtLWRpLURvY3VtZW50TWFuYWdlbWVudC1zZG1faW50ZWdyYXRpb24hYjMwNzpJaC9GT1JjSkVJYUdzeWFNRklUdThsYmw1V0k9")
                .url("https://lg-common-dev.authentication.jp10.hana.ondemand.com/oauth/token?grant_type=client_credentials")
                .post(body).build();

        Response response = client.newCall(request).execute();

        if (response.isSuccessful()) {
            ResponseBody respBody = response.body();
            if (respBody != null) {
                map = mapper.readValue(respBody.string(), new TypeReference<Map<Object, Object>>() {
                });
                // log.info("Response " + map.get("access_token"));
            }
        } else {
            System.out.println("Response Error");
        }

        return "Bearer " + map.get("access_token").toString();

    }

    private String rename(String originFileName) {
        return FilenameUtils.getBaseName(originFileName)+"_"+ System.currentTimeMillis() + "." + FilenameUtils.getExtension(originFileName); 
    }

    private boolean isDenyFileExt(String originFileName) {
        String ext = FilenameUtils.getExtension(originFileName);
        if (dmsCommonAllowFileExt != null && Arrays.asList(dmsCommonAllowFileExt.split(",")).contains(ext)){
            return false;
        }
        return true;
    }

    @PostMapping(value= "/v2/singleUpload", produces="application/json;charset=utf8")
    public String singleUupload(String groupId, @RequestPart MultipartFile file) throws Exception {
        OkHttpClient client = getOkHttpClient(60);         
        String token = getToken();
        Map<String, String> mapFolder =  createAutoFolder();
        String originFileName = file.getOriginalFilename();
        String fileName = originFileName;
        FileResponse resp = null;
        int fileSize = (int)file.getSize();    

        if (this.isDenyFileExt(originFileName)){
            resp = new FileResponse(
                 "fail"
                ,groupId
                ,null
                ,originFileName
                ,String.valueOf(file.getSize())
                ,null
                ,FilenameUtils.getExtension(originFileName)
                ,"해당 확장자는 Upload할 수 없습니다."
            );
            
            return mapper.writeValueAsString(resp);
        }

        if (this.getMaxFileSize(dmsMaxFileSize) < fileSize) {
            resp = new FileResponse("fail", groupId, null, originFileName, String.valueOf(fileSize), null, FilenameUtils.getExtension(originFileName), "최대 " + dmsMaxFileSize + " 이하만 upload할 수 있습니다.");
            
        
            return mapper.writeValueAsString(resp);
        }

        if (mapFolder.get("STATUS").equals("SUCCESS")){
            String folderId = mapFolder.get("FOLDER_ID");
            // File tfile = new File(originFileName);
            Map<String, String> checkFile = isExists(folderId, originFileName, "document");
            if (checkFile.get("STATUS").equals("SUCCESS")){
                fileName = this.rename(originFileName);
            }
            // FileUtils.copyInputStreamToFile(file.getInputStream(), tfile);

            RequestBody body = new MultipartBuilder().type(MultipartBuilder.FORM)
                .addFormDataPart("objectId", folderId)
                .addFormDataPart("cmisaction", "createDocument").addFormDataPart("propertyId[0]", "cmis:name")
                .addFormDataPart("propertyValue[0]", fileName)
                .addFormDataPart("propertyId[1]", "cmis:objectTypeId")
                .addFormDataPart("propertyValue[1]", "cmis:document").addFormDataPart("succinct", "true")
                .addFormDataPart("X-EcmUserEnc", "Sukhil").addFormDataPart("_charset_", "UTF-8")
                .addFormDataPart("filename", fileName,
                        // RequestBody.create(MediaType.parse("application/octet-stream"), tfile))
                        RequestBody.create(MediaType.parse("multipart/form-data"), file.getBytes()))
                .addFormDataPart("media", "binary").build();

            Request request = new Request.Builder().url(this.getFullEndpoint())
                    .addHeader("Authorization", token)
                    .addHeader("Content-Type", "multipart/form-data")
                    .method("POST", body).build();
            Response response = client.newCall(request).execute();
            ResponseBody respBody = response.body();
            String respJson = respBody.string();

            if (response.isSuccessful()) {
                if (respBody != null) {
                    String objectId = JsonParser.parseString(respJson).getAsJsonObject()
                        .get("succinctProperties").getAsJsonObject()
                        .get("cmis:objectId").getAsString();                   

                    resp = new FileResponse("success", groupId, objectId, originFileName, String.valueOf(file.getSize()), LocalDate.from(LocalDateTime.now()).toString(), FilenameUtils.getExtension(originFileName), "");
                    
                    FileMstDto findFileMst = fileMStRepository.findById("L2100", groupId);
                    
                    if (findFileMst == null){
                        FileMstDto fileMst = new FileMstDto(
                            "L2100"
                            ,groupId
                            ,Timestamp.valueOf(LocalDateTime.now())
                            ,Timestamp.valueOf(LocalDateTime.now())
                            ,"admin"
                            ,"admin"
                            ,Timestamp.valueOf(LocalDateTime.now())
                            ,Timestamp.valueOf(LocalDateTime.now())
                        );
    
                        fileMStRepository.insertFileMst(fileMst);                        
                    }    

                    FileDtlDto fileDtl = new FileDtlDto("L2100" 
                        ,groupId
                        ,objectId
                        ,1
                        ,originFileName
                        ,fileName
                        ,fileSize
                        ,"AA"
                        ,true
                        ,Timestamp.valueOf(LocalDateTime.now())
                        ,"admin"
                        ,Timestamp.valueOf(LocalDateTime.now())
                        );

                    fileDtlRepository.insert(fileDtl);
                    
                    
                }
            } else {

                resp = new FileResponse(
                    "fail"
                    ,groupId
                    , null
                    ,file.getName()
                    ,String.valueOf(file.getSize())
                    , null
                    ,FilenameUtils.getExtension(file.getName())
                    ,JsonParser.parseString(respJson).getAsJsonObject().get("message").getAsString()
                );
            }
        } 

        return mapper.writeValueAsString(resp);
    }

    @PostMapping(value= "/v1/singleUpload", produces="application/json;charset=utf8")
    public String singleUuploadV1(HttpServletRequest httpRequest, @RequestHeader Map<String, String> headers) throws Exception {
        OkHttpClient client = getOkHttpClient(60);         
        String token = getToken();
        String originFileName = headers.get("filename");
        String groupId = headers.get("groupid");

        Map<String, String> mapFolder =  createAutoFolder();
        // String originFileName = file.getOriginalFilename();
        String fileName = originFileName;
        FileResponse resp = null;
        File file = null;
        int fileSize=0;
      


        // String fileRootPath = File.separator + "tmp" + File.separator + "fileTemp" + File.separator; // 폴더 경로
        // File folder = new File();

        // System.out.println(fileRootPath);

        // if (!folder.exists()) {
        //     try {
        //         folder.mkdir();
        //         System.out.println("Create folder.");
        //     } catch (Exception e) {
        //         e.getStackTrace();
        //     }
        // }

        InputStream inputStream = null;
        FileOutputStream fileOutputStream = null;

        try {
            // headers.forEach((key, value) -> {
            //      System.out.println(String.format("Header '%s' = %s", key, value));
            // });

            String originalfileName = headers.get("filename");
            inputStream = httpRequest.getInputStream();

            file = new File(originalfileName);

            FileUtils.copyInputStreamToFile(inputStream, file);

            // file = new File(originalfileName);
            fileSize = (int)file.length();
            
        } catch (IOException e) {
             e.printStackTrace();
        } finally {   
            try {
                if (fileOutputStream != null) { fileOutputStream.close(); }
                if (inputStream != null){ inputStream.close(); }
                
            }catch(Exception e){
                if (file != null){file.delete();}
            }
        }

        
        // int fileSize = (int)file.getSize();
        if (this.isDenyFileExt(originFileName)){
            resp = new FileResponse(
                 "fail"
                ,groupId
                ,null
                ,originFileName
                ,String.valueOf(fileSize)
                ,null
                ,FilenameUtils.getExtension(originFileName)
                ,"해당 확장자는 Upload할 수 없습니다."
            );
            
            return mapper.writeValueAsString(resp);
        }

        if (this.getMaxFileSize(dmsMaxFileSize) < fileSize) {
            resp = new FileResponse("fail", groupId, null, originFileName, String.valueOf(fileSize), null, FilenameUtils.getExtension(originFileName), "최대 " + dmsMaxFileSize + " 이하만 upload할 수 있습니다.");
            
        
            return mapper.writeValueAsString(resp);
        }

        if (mapFolder.get("STATUS").equals("SUCCESS")){
            String folderId = mapFolder.get("FOLDER_ID");
            // File tfile = new File(originFileName);
            Map<String, String> checkFile = isExists(folderId, originFileName, "document");
            if (checkFile.get("STATUS").equals("SUCCESS")){
                fileName = this.rename(originFileName);
            }
            // FileUtils.copyInputStreamToFile(file.getInputStream(), tfile);

            RequestBody body = new MultipartBuilder().type(MultipartBuilder.FORM)
                .addFormDataPart("objectId", folderId)
                .addFormDataPart("cmisaction", "createDocument").addFormDataPart("propertyId[0]", "cmis:name")
                .addFormDataPart("propertyValue[0]", fileName)
                .addFormDataPart("propertyId[1]", "cmis:objectTypeId")
                .addFormDataPart("propertyValue[1]", "cmis:document").addFormDataPart("succinct", "true")
                .addFormDataPart("X-EcmUserEnc", "Sukhil").addFormDataPart("_charset_", "UTF-8")
                .addFormDataPart("filename", fileName,
                        RequestBody.create(MediaType.parse("application/octet-stream"), file))
                        // RequestBody.create(MediaType.parse("multipart/form-data"), file.getBytes()))
                .addFormDataPart("media", "binary").build();

            Request request = new Request.Builder().url(this.getFullEndpoint())
                    .addHeader("Authorization", token)
                    .addHeader("Content-Type", "multipart/form-data")
                    .method("POST", body).build();
            Response response = client.newCall(request).execute();
            ResponseBody respBody = response.body();
            String respJson = respBody.string();

            if (response.isSuccessful()) {
                if (respBody != null) {
                    String objectId = JsonParser.parseString(respJson).getAsJsonObject()
                        .get("succinctProperties").getAsJsonObject()
                        .get("cmis:objectId").getAsString();                   

                    resp = new FileResponse("success", groupId, objectId, originFileName, String.valueOf(fileSize), LocalDate.from(LocalDateTime.now()).toString(), FilenameUtils.getExtension(originFileName), "");
                    
                    FileMstDto findFileMst = fileMStRepository.findById("L2100", groupId);
                    
                    if (findFileMst == null){
                        FileMstDto fileMst = new FileMstDto(
                            "L2100"
                            ,groupId
                            ,Timestamp.valueOf(LocalDateTime.now())
                            ,Timestamp.valueOf(LocalDateTime.now())
                            ,"admin"
                            ,"admin"
                            ,Timestamp.valueOf(LocalDateTime.now())
                            ,Timestamp.valueOf(LocalDateTime.now())
                        );
    
                        fileMStRepository.insertFileMst(fileMst);                        
                    }    

                    FileDtlDto fileDtl = new FileDtlDto("L2100" 
                        ,groupId
                        ,objectId
                        ,1
                        ,originFileName
                        ,fileName
                        ,fileSize
                        ,"AA"
                        ,true
                        ,Timestamp.valueOf(LocalDateTime.now())
                        ,"admin"
                        ,Timestamp.valueOf(LocalDateTime.now())
                        );

                    fileDtlRepository.insert(fileDtl);
                    
                    
                }
            } else {

                resp = new FileResponse(
                    "fail"
                    ,groupId
                    , null
                    ,file.getName()
                    ,String.valueOf(fileSize)
                    , null
                    ,FilenameUtils.getExtension(file.getName())
                    ,JsonParser.parseString(respJson).getAsJsonObject().get("message").getAsString()
                );
            }
        } 

        if (file!=null){
            file.delete();
        }

        return mapper.writeValueAsString(resp);
    }
    /**
     * 파일 업로드
     */
    @PostMapping("/v1/multiUpload")
    public List<Map<String, String>> multiUpload(@RequestPart List<MultipartFile> files) throws Exception {
        List<Map<String, String>> result = new ArrayList<>();
        OkHttpClient client = new OkHttpClient();
        String token = getToken();
        Map<String, String> mapFolder =  createAutoFolder();

        if (mapFolder.get("STATUS").equals("SUCCESS")){
            String folderId = mapFolder.get("FOLDER_ID");

            for (int i = 0; i < files.size(); i++) {
                Map<String, String> respMap = new HashMap<String, String>();
                MultipartFile mFile = files.get(i);
                File file = new File(mFile.getOriginalFilename());
                FileUtils.copyInputStreamToFile(mFile.getInputStream(), file);

                RequestBody body = new MultipartBuilder().type(MultipartBuilder.FORM)
                        .addFormDataPart("objectId", folderId)
                        .addFormDataPart("cmisaction", "createDocument").addFormDataPart("propertyId[0]", "cmis:name")
                        .addFormDataPart("propertyValue[0]", mFile.getOriginalFilename())
                        .addFormDataPart("propertyId[1]", "cmis:objectTypeId")
                        .addFormDataPart("propertyValue[1]", "cmis:document").addFormDataPart("succinct", "true")
                        .addFormDataPart("X-EcmUserEnc", "Sukhil").addFormDataPart("_charset_", "UTF-8")
                        .addFormDataPart("filename", mFile.getOriginalFilename(),
                                RequestBody.create(MediaType.parse("application/octet-stream"), file))
                        .addFormDataPart("media", "binary").build();

                Request request = new Request.Builder().url(this.getFullEndpoint())
                        .addHeader("Authorization", token).addHeader("Content-Type", "multipart/form-data")
                        .method("POST", body).build();

                Response response = client.newCall(request).execute();

                ResponseBody respBody = response.body();
                String respJson = respBody.string();
                if (response.isSuccessful()) {
                    if (respBody != null) {
                        String objectId = JsonParser.parseString(respJson).getAsJsonObject()
                                .get("succinctProperties").getAsJsonObject().get("cmis:objectId").getAsString();
                        respMap.put("STATUS", "SUCCESS");
                        respMap.put("MESSAGE", null);
                        respMap.put("FOLDER_ID", folderId);
                        respMap.put("OBJECT_ID", objectId);
                    }
                } else {
                    respMap.put("STATUS", "FAIL");
                    respMap.put("MESSAGE", JsonParser.parseString(respJson).getAsJsonObject().get("message").getAsString());
                    respMap.put("FOLDER_ID", null);
                    respMap.put("OBJECT_ID", null);
                }

                result.add(respMap);
            }
        } 

        return result;

    }

    @PostMapping("/v1/delete")
    public String deleteFile(String groupId, String fileId) throws Exception {
        Map<String, String> result = new HashMap<>();

        OkHttpClient client = getOkHttpClient(60);
        String token = getToken();
        
        RequestBody body = new MultipartBuilder().type(MultipartBuilder.FORM)
            .addFormDataPart("objectId", fileId)
            .addFormDataPart("cmisaction","delete")
            .build();
        
        Request request = new Request.Builder()
            .url(this.getFullEndpoint())
            .addHeader("Authorization", token)
            .addHeader("Content-Type","multipart/form-data")
            .method("POST", body)
            .build();
        Response response = client.newCall(request).execute();

        ResponseBody respBody = response.body();

        if (response.isSuccessful()) {
            fileDtlRepository.delete("L2100", groupId, fileId);
            result.put("result", "success");
            result.put("fileId", fileId);
        } else {
            result.put("result", "fail");
            result.put("fileId", fileId);
            result.put("message", JsonParser.parseString(respBody.string()).getAsJsonObject().get("exception").getAsString());
        }

        return mapper.writeValueAsString(result);
    }

    @GetMapping("/v1/download")
    public String downFile(String fileId, HttpServletResponse response) throws Exception {

        Map<String, String> fileInfo = this.getFileInfo(fileId);
        if (fileInfo.get("STATUS").equals("FAIL")){
            Map<String, String> result = new HashMap<>();
            result.put("status", "fail");
            result.put("message", fileInfo.get("MESSAGE"));

            return mapper.writeValueAsString(result);
        }

        OkHttpClient client = getOkHttpClient(60);
        String token = getToken();

        String url = this.getFullEndpoint() + "?objectId=" + fileId + "&cmisSelector=content";    
        
        Request request = new Request.Builder()
            .url(url)
            .addHeader("Authorization", token)
            .method("GET", null)
            .build();

        ResponseBody respBody = client.newCall(request).execute().body();
   
        response.setContentType(HttpContentType.APPLICATION_OCTET_STREAM);
        response.setHeader("Content-Disposition", String.format("inline; filename=\"" + fileInfo.get("FILE_NAME") + "\""));
        InputStream in = respBody.byteStream();
        IOUtils.copy(in, response.getOutputStream());
        response.flushBuffer();

        return null;
        
    }

    @GetMapping("/v1/query")    
    public String query(String groupId) throws Exception{
        Map<String, Object> result = new HashMap<>();
        List<UploadFile> groupInfo = fileDtlRepository.getGroup("L2100", groupId);
        result.put("result", "success");
        result.put("records", groupInfo);        
        return new JSONObject(result).toString();
    }
    

    public static void main(String[] args) {
        // String json = "{\"succinctProperties\":{\"cmis:objectId\":\"JZYfItEAl2mnW_DmpLl0DjRgQvjtXz1VPuC9lMKIe60\",\"cmis:contentStreamHash\":[\"{sha-256}998ba1050a062ee55ec3b727435bd89c6f7cb2f06c9adcd253385f5991e16b09\"],\"sap:versionSeriesContentLength\":9643,\"cmis:lastModifiedBy\":\"sb-897d18e8-81bd-4882-b20a-dcb2e19b19be!b522|sdm-di-DocumentManagement-sdm_integration!b307\",\"cmis:versionLabel\":\"1.0\",\"cmis:contentStreamId\":\"5ec6296191380f00063b1209dbc_f7cedad00094b894552c9df5_5fd9c255498b49000dadec81-1743720790_1611553500121-0917-6529eb85-590d-49bf-b949-ee71442e6644\",\"cmis:objectTypeId\":\"cmis:document\",\"cmis:contentStreamMimeType\":\"applicationvnd.openxmlformats-officedocument.spreadsheetml.sheet\",\"cmis:createdBy\":\"sb-897d18e8-81bd-4882-b20a-dcb2e19b19be!b522|sdm-di-DocumentManagement-sdm_integration!b307\",\"cmis:baseTypeId\":\"cmis:document\",\"sap:owner\":\"sb-897d18e8-81bd-4882-b20a-dcb2e19b19be!b522|sdm-di-DocumentManagement-sdm_integration!b307\",\"cmis:creationDate\":1611553610071,\"cmis:changeToken\":\"0\",\"cmis:isVersionSeriesCheckedOut\":false,\"cmis:isMajorVersion\":true,\"cmis:contentStreamFileName\":\"nexthr_session.xlsx\",\"sap:parentIds\":[\"2HbfikpRqzaEUZRAqgPXNh5kwhlPsSO8YXy373Bj5aI\"],\"cmis:name\":\"nexthr_session.xlsx\",\"cmis:isLatestVersion\":true,\"cmis:lastModificationDate\":1611553610071,\"cmis:versionSeriesId\":\"0mHsjdDQ6mb9OKsUj7WC2r35df2KpfHPXwNRqw7dfxo\",\"cmis:isLatestMajorVersion\":true,\"cmis:contentStreamLength\":9643},\"exactACL\":false}";
        // String json = "{\"exception\":\"nameConstraintViolation\",\"message\":\"Child with name 2021-01-26 already exists\"}";
        String json = "{\"results\":[{\"succinctProperties\":{\"cmis:objectId\":\"Ef9FrbyJWpLrOLnTGJf0US1X_VQSWZI-SnLBexUYsuY\",\"cmis:name\":\"߰ο.txt\",\"sap:owner\":\"ultrakim@lgcns.com\"}}],\"hasMoreItems\":\"false\"}";
        // String objectId = JsonParser.parseString(json)
        // .getAsJsonObject().get("succinctProperties").getAsJsonObject()
        // .get("cmis:objectId").getAsString(); 

        // String objectId = JsonParser.parseString(json).getAsJsonObject().get("message").getAsString();

        // System.out.println(objectId);

        // System.out.println(LocalDate.now().toString());

        JsonElement element =  JsonParser.parseString(json);
        System.out.println(element.toString());
        JsonArray results =  element.getAsJsonObject().get("results").getAsJsonArray();
        System.out.println("results size >>" + results.size());
        String objectId = "-1";
        if (results.size() == 1){
            JsonElement object = results.get(0);
            objectId = object.getAsJsonObject().get("succinctProperties").getAsJsonObject().get("cmis:objectId").getAsString();

        }

                System.out.println(objectId);


    }
    
}