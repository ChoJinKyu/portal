package lg.sppCap.frame.dto.cm;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class FileMstDto {
    private String tenantId;
    private String fileGroupId;
    private Timestamp localCreateDtm;
    private Timestamp localUpdateDtm;
    private String createUserId;
    private String updateUserId;
    private Timestamp systemCreateDtm;
    private Timestamp systemUpdateDtm;

    public FileMstDto(String tenantId, String fileGroupId, Timestamp localCreateDtm, Timestamp localUpdateDtm,
            String createUserId, String updateUserId, Timestamp systemCreateDtm, Timestamp systemUpdateDtm) {
        this.tenantId = tenantId;
        this.fileGroupId = fileGroupId;
        this.localCreateDtm = localCreateDtm;
        this.localUpdateDtm = localUpdateDtm;
        this.createUserId = createUserId;
        this.updateUserId = updateUserId;
        this.systemCreateDtm = systemCreateDtm;
        this.systemUpdateDtm = systemUpdateDtm;
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

    public Timestamp getLocalCreateDtm() {
        return localCreateDtm;
    }

    public void setLocalCreateDtm(Timestamp localCreateDtm) {
        this.localCreateDtm = localCreateDtm;
    }

    public Timestamp getLocalUpdateDtm() {
        return localUpdateDtm;
    }

    public void setLocalUpdateDtm(Timestamp localUpdateDtm) {
        this.localUpdateDtm = localUpdateDtm;
    }

    public String getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(String createUserId) {
        this.createUserId = createUserId;
    }

    public String getUpdateUserId() {
        return updateUserId;
    }

    public void setUpdateUserId(String updateUserId) {
        this.updateUserId = updateUserId;
    }

    public Timestamp getSystemCreateDtm() {
        return systemCreateDtm;
    }

    public void setSystemCreateDtm(Timestamp systemCreateDtm) {
        this.systemCreateDtm = systemCreateDtm;
    }

    public Timestamp getSystemUpdateDtm() {
        return systemUpdateDtm;
    }

    public void setSystemUpdateDtm(Timestamp systemUpdateDtm) {
        this.systemUpdateDtm = systemUpdateDtm;
    }



}
