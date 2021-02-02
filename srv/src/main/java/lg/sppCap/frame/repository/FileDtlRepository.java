package lg.sppCap.frame.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import lg.sppCap.frame.dto.UploadFile;
import lg.sppCap.frame.dto.cm.FileDtlDto;


@Repository

public class FileDtlRepository {

    @Autowired
    private JdbcTemplate template;

    public FileDtlDto findById(String tenantId, String fileGroupId, String fileId){
        String sql = "SELECT TENANT_ID, FILE_GROUP_ID, FILE_ID,	SORT_NUMBER, ORIGIN_NAME, SAVED_NAME, FILE_SIZE, MIME_TYPE, CONFIRM_FLAG, LOCAL_CREATE_DTM,CREATE_USER_ID, SYSTEM_CREATE_DTM FROM CM_FILE_DTL WHERE TENANT_ID = ? AND FILE_GROUP_ID = ? AND FILE_ID = ?"; 
        try {
            return template.queryForObject(sql,new Object[]{tenantId, fileGroupId}, FileDtlMapper);
            
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public List<UploadFile> getGroup(String tenantId, String groupId) {
        String sql = "SELECT FILE_GROUP_ID, FILE_ID, ORIGIN_NAME, FILE_SIZE, LOCAL_CREATE_DTM, MIME_TYPE FROM CM_FILE_DTL WHERE TENANT_ID =? AND FILE_GROUP_ID = ?";
        return template.query(sql, new Object[]{tenantId, groupId}, UploadFileMapper);
    }

    public void insert(FileDtlDto fileDtl){
        String sql = "INSERT INTO CM_FILE_DTL( TENANT_ID, FILE_GROUP_ID, FILE_ID, SORT_NUMBER, ORIGIN_NAME,	SAVED_NAME,	FILE_SIZE,	MIME_TYPE, CONFIRM_FLAG, LOCAL_CREATE_DTM, CREATE_USER_ID, SYSTEM_CREATE_DTM )" +
                     "VALUES( ?,?,?,?,?,?,?,?,?,?,?,?)";
        template.update(sql, new Object[]{
            fileDtl.getTenantId(), 
            fileDtl.getFileGroupId(), 
            fileDtl.getFileId(),
            fileDtl.getSortNumber(),
            fileDtl.getOriginName(),
            fileDtl.getSavedName(),
            fileDtl.getFileSize(),
            fileDtl.getMimeType(),
            fileDtl.getConfirmFlag(),
            fileDtl.getLocalCreateDtm(),
            fileDtl.getCreateUserId(),
            fileDtl.getSytemCreateDtm()}
        );
    }

    public void delete(String tenantId, String groupId, String fileId){
        String sql = "delete from cm_file_dtl where tenant_id =? and file_group_id = ? and file_id = ?";
        template.update(sql, new Object[]{tenantId, groupId, fileId});
    }

    static RowMapper<UploadFile> UploadFileMapper = (rs, rowNum) -> new UploadFile(
        rs.getString("FILE_GROUP_ID"),
        rs.getString("FILE_ID"),
        rs.getString("ORIGIN_NAME"),
        rs.getString("FILE_SIZE"),
        rs.getString("LOCAL_CREATE_DTM"),
        rs.getString("MIME_TYPE")
    ); 

    static RowMapper<FileDtlDto> FileDtlMapper = (rs, rowNum) -> new FileDtlDto( 
        rs.getString("TENANT_ID"),
        rs.getString("FILE_GROUP_ID"),
        rs.getString("FILE_ID"),
        rs.getInt("SORT_NUMBER"),
        rs.getString("ORIGIN_NAME"),
        rs.getString("SAVED_NAME"),
        rs.getInt("FILE_SIZE"),
        rs.getString("MIME_TYPE"), 
        rs.getBoolean("CONFIRM_FLAG"),
        rs.getTimestamp("LOCAL_CREATE_DTM"),
        rs.getString("CREATE_USER_ID"),
        rs.getTimestamp("SYSTEM_CREATE_DTM")
    ); 
}
