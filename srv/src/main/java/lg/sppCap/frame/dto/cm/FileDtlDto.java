package lg.sppCap.frame.dto.cm;

import java.sql.Timestamp;

public class FileDtlDto {
    private String tenantId;
    private String fileGroupId;
    private String fileId;
    private Integer sortNumber;
    private String originName;
    private String savedName;
    private Integer fileSize;
    private String mimeType;
    private Boolean confirmFlag;
    private Timestamp localCreateDtm;
    private String createUserId;
    private Timestamp sytemCreateDtm;

    public FileDtlDto(String tenantId, String fileGroupId, String fileId, Integer sortNumber, String originName,
            String savedName, Integer fileSize, String mimeType, Boolean confirmFlag, Timestamp localCreateDtm,
            String createUserId, Timestamp sytemCreateDtm) {
        this.tenantId = tenantId;
        this.fileGroupId = fileGroupId;
        this.fileId = fileId;
        this.sortNumber = sortNumber;
        this.originName = originName;
        this.savedName = savedName;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
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

    public String getOriginName() {
        return originName;
    }

    public void setOriginName(String originName) {
        this.originName = originName;
    }

    public String getSavedName() {
        return savedName;
    }

    public void setSavedName(String savedName) {
        this.savedName = savedName;
    }

    public Integer getFileSize() {
        return fileSize;
    }

    public void setFileSize(Integer fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
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
