package lg.sppCap.frame.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import lg.sppCap.frame.dto.cm.FileDtlDto;
import lg.sppCap.frame.dto.UploadFile;
import lg.sppCap.frame.dto.cm.FileMstDto;

@Repository
public class FileMstRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // public List<UploadFile> findAll() {
    //     String sql = "select m.tenant_id, m.file_group_id, l.file_id, l.sort_number, l.origin_name from cm_file_mst m inner join cm_file_dtl l on m.tenant_id = l.tenant_id and m.file_group_id = l.file_group_id";
    //     List<UploadFile> files = jdbcTemplate.query(sql, uploadFileMapper);
    //     return files;
    // } 

    // static RowMapper<UploadFile> uploadFileMapper = (rs, rowNum) -> new UploadFile( rs.getString("TENANT_ID"),
    //     rs.getString("FILE_GROUP_ID"),
    //     rs.getString("FILE_ID"),
    //     rs.getInt("SORT_NUMBER"),
    //     rs.getString("ORIGIN_NAME"));
    
    

	// public List<UploadFile> getGroup(String groupId) {
    //     String sql = "select m.tenant_id, m.file_group_id , l.file_id, l.sort_number, l.origin_name from cm_file_mst m inner join cm_file_dtl l on m.tenant_id = l.tenant_id and m.file_group_id = l.file_group_id where m.file_group_id = ?";
    //     return jdbcTemplate.query(sql, new Object[]{groupId}, uploadFileMapper);
    // }

    public FileMstDto findById(String tenantId, String fileGroupId) {
        String sql = "select tenant_id, file_group_id, local_create_dtm, local_update_dtm, create_user_id, update_user_id, system_create_dtm, system_update_dtm from cm_file_mst where tenant_id =? and file_group_id = ?"; 
        try {
            return jdbcTemplate.queryForObject(sql,new Object[]{tenantId, fileGroupId}, FileMstMapper);
            
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void insertFileMst(FileMstDto fileMst) {
        String sql = "insert into cm_file_mst(tenant_id, file_group_id, local_create_dtm, local_update_dtm, create_user_id, update_user_id, system_create_dtm, system_update_dtm) " +
                     "values (?, ?, ?, ?, ?, ?, ?, ?)";
                     
        jdbcTemplate.update(sql, new Object[]{fileMst.getTenantId(), fileMst.getFileGroupId(), fileMst.getLocalCreateDtm(), fileMst.getLocalUpdateDtm(), fileMst.getCreateUserId(), fileMst.getUpdateUserId(), fileMst.getSystemCreateDtm(), fileMst.getSystemUpdateDtm()});
    }

    public void insertFileDtl(FileDtlDto fileDtl){
        String sql = "insert into cm_file_dtl(tenant_id, file_group_id, file_id, sort_number, origin_name, saved_name, file_size, mime_type, confirm_flag,  local_create_dtm, create_user_id, system_crete_dtm)" +
                     "into values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                     
        jdbcTemplate.update(sql, new Object[]{fileDtl.getTenantId(), fileDtl.getFileGroupId(), fileDtl.getFileId(), fileDtl.getSortNumber(), fileDtl.getOriginName(), fileDtl.getSavedName(), fileDtl.getFileSize(), fileDtl.getMimeType(), fileDtl.getConfirmFlag(),  fileDtl.getLocalCreateDtm(), fileDtl.getCreateUserId(),  fileDtl.getSytemCreateDtm()});

    }

    

    static RowMapper<FileMstDto> FileMstMapper = (rs, rowNum) -> new FileMstDto( 
        rs.getString("TENANT_ID"),
        rs.getString("FILE_GROUP_ID"),
        rs.getTimestamp("LOCAL_CREATE_DTM"),
        rs.getTimestamp("LOCAL_UPDATE_DTM"),
        rs.getString("CREATE_USER_ID"),
        rs.getString("UPDATE_USER_ID"),
        rs.getTimestamp("SYSTEM_CREATE_DTM"),
        rs.getTimestamp("SYSTEM_UPDATE_DTM")
    ); 
}
