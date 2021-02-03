package lg.sppCap.frame.dto;



public class UploadFile {

    private String groupId;
    private String fileId;
    private String fileName;
    private String fileSize;
    private String uploadDate;
    private String fileExt;

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(String uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getFileExt() {
        return fileExt;
    }

    public void setFileExt(String fileExt) {
        this.fileExt = fileExt;
    }

    public UploadFile(String groupId, String fileId, String fileName, String fileSize, String uploadDate,
            String fileExt) {
        this.groupId = groupId;
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.uploadDate = uploadDate;
        this.fileExt = fileExt;
    }

    
    
   
}
