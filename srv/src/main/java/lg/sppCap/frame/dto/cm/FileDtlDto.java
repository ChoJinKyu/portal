package lg.sppCap.frame.dto.cm;

import java.sql.Timestamp;

public class FileDtlDto {
    private String tenantId;
    private String fileGroupId;
    private String fileId;
    private Integer sortNumber;
    private String originalFileName;
    private String saveFileName;
    private Integer fileSize;
    private String mimeTypeName;
    private Boolean confirmFlag;
    private Timestamp localCreateDtm;
    private String createUserId;
    private Timestamp sytemCreateDtm;

    public FileDtlDto(String tenantId, String fileGroupId, String fileId, Integer sortNumber, String originalName,
            String saveFileName, Integer fileSize, String mimeTypeName, Boolean confirmFlag, Timestamp localCreateDtm,
            String createUserId, Timestamp sytemCreateDtm) {
        this.tenantId = tenantId;
        this.fileGroupId = fileGroupId;
        this.fileId = fileId;
        this.sortNumber = sortNumber;
        this.originalFileName = originalName;
        this.saveFileName = saveFileName;
        this.fileSize = fileSize;
        this.mimeTypeName = mimeTypeName;
        this.confirmFlag = confirmFlag;
        this.localCreateDtm = localCreateDtm;
        this.createUserId = createUserId;
        this.sytemCreateDtm = sytemCreateDtm;
    }

    public FileDtlDto(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getFileGroupId() {
        return fileGroupId;
    }

    public void setFileGroupId(String fileGroupId) {
        this.fileGroupId = fileGroupId;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public Integer getSortNumber() {
        return sortNumber;
    }

    public void setSortNumber(Integer sortNumber) {
        this.sortNumber = sortNumber;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originFileName) {
        this.originalFileName = originFileName;
    }

    public String getSaveFileName() {
        return saveFileName;
    }

    public void setSaveFileName(String saveFileName) {
        this.saveFileName = saveFileName;
    }

    public Integer getFileSize() {
        return fileSize;
    }

    public void setFileSize(Integer fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeTypeName;
    }

    public void setMimeTypeName(String mimeType) {
        this.mimeTypeName = mimeType;
    }

    public Boolean getConfirmFlag() {
        return confirmFlag;
    }

    public void setConfirmFlag(Boolean confirmFlag) {
        this.confirmFlag = confirmFlag;
    }

    public Timestamp getLocalCreateDtm() {
        return localCreateDtm;
    }

    public void setLocalCreateDtm(Timestamp localCreateDtm) {
        this.localCreateDtm = localCreateDtm;
    }

    public String getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(String createUserId) {
        this.createUserId = createUserId;
    }

    public Timestamp getSytemCreateDtm() {
        return sytemCreateDtm;
    }

    public void setSytemCreateDtm(Timestamp sytemCreateDtm) {
        this.sytemCreateDtm = sytemCreateDtm;
    }

    

    

    
}
