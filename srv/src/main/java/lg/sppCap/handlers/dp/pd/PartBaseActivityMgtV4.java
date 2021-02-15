package lg.sppCap.handlers.dp.pd;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;

import cds.gen.dp.partbaseactivityv4service.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@ServiceName(PartBaseActivityV4Service_.CDS_NAME)
public class PartBaseActivityMgtV4 implements EventHandler {

    private final static Logger log = LoggerFactory.getLogger(PartBaseActivityV4Service_.class);

    @Autowired
    private JdbcTemplate jdbc;
    
    @Transactional(rollbackFor = SQLException.class)
    @On(event = PdpartBaseActivitySaveProcContext.CDS_NAME)
    public void SaveIdeaProc(PdpartBaseActivitySaveProcContext context) {
        
        // ProcInputType v_inDatas = context.getInputData();
        String crudType = context.getInputData().getCrudType();
        PdpartBaseActivityType v_pdMst = context.getInputData().getPdMst();
        Collection<PdpartBaseActivityLngType> v_pdDtl = context.getInputData().getPdDtl();
        Collection<PdpartBaseActivityCategoryType> v_pdCat = context.getInputData().getPdCat();
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        // master 테이블
        StringBuffer v_sql_createMstTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createMstTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY (");

        v_sql_createMstTable.append("TENANT_ID NVARCHAR(5),");
        v_sql_createMstTable.append("ACTIVITY_CODE NVARCHAR(40),");
        v_sql_createMstTable.append("SEQUENCE DECIMAL(34),");
        v_sql_createMstTable.append("DESCRIPTION NVARCHAR(240),");
        v_sql_createMstTable.append("ACTIVE_FLAG BOOLEAN,");
        v_sql_createMstTable.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createMstTable.append("CRUD_TYPE_CODE NVARCHAR(1) )");

        String v_sql_insertMstTable = "INSERT INTO #LOCAL_TEMP_PART_BASE_ACTIVITY VALUES (?, ?, ?, ?, ?, ?, ?)";        
        
        String v_sql_dropMstTable = "DROP TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY";

        // languages 테이블
        StringBuffer v_sql_createLngTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createLngTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG (");

        v_sql_createLngTable.append("TENANT_ID NVARCHAR(5),");
        v_sql_createLngTable.append("ACTIVITY_CODE NVARCHAR(40),");
        v_sql_createLngTable.append("LANGUAGE_CD NVARCHAR(30),");
        v_sql_createLngTable.append("CODE_NAME NVARCHAR(240),");        
        v_sql_createLngTable.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createLngTable.append("CRUD_TYPE_CODE NVARCHAR(1) )");

        String v_sql_insertLngTable = "INSERT INTO #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG VALUES (?, ?, ?, ?, ?, ?)";        
        
        String v_sql_dropLngtable = "DROP TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG";

        // category 테이블
        StringBuffer v_sql_createCateTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createCateTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY_CATEGORY (");

        v_sql_createCateTable.append("TENANT_ID NVARCHAR(5),"); 
        v_sql_createCateTable.append("ACTIVITY_CODE NVARCHAR(40),");
        v_sql_createCateTable.append("CATEGORY_GROUP_CODE NVARCHAR(30),");
        v_sql_createCateTable.append("CATEGORY_CODE NVARCHAR(40),");
        v_sql_createCateTable.append("S_GRADE_STANDARD_DAYS INTEGER,");

        v_sql_createCateTable.append("A_GRADE_STANDARD_DAYS INTEGER,");	
        v_sql_createCateTable.append("B_GRADE_STANDARD_DAYS INTEGER,");	
        v_sql_createCateTable.append("C_GRADE_STANDARD_DAYS INTEGER,");	
        v_sql_createCateTable.append("D_GRADE_STANDARD_DAYS INTEGER,");	
        v_sql_createCateTable.append("ACTIVE_FLAG BOOLEAN,");        

        v_sql_createCateTable.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createCateTable.append("CRUD_TYPE_CODE NVARCHAR(1) )");

        String v_sql_insertCateTable = "INSERT INTO #LOCAL_TEMP_PART_BASE_ACTIVITY_CATEGORY VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";        
        
        String v_sql_dropCatetable = "DROP TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY_CATEGORY";

        String v_sql_callProc = "CALL DP_PD_PART_BASE_ACTIVITY_SAVE_PROC(CRUD_TYPE => ?, I_M => #LOCAL_TEMP_PART_BASE_ACTIVITY, I_D => #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG, I_C => #LOCAL_TEMP_PART_BASE_ACTIVITY_CATEGORY, O_MSG => ?)";

        Collection<OutType> v_result = new ArrayList<>();

        ResultSet v_rs = null;

                    
        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createMstTable.toString());        
        
        // Local Temp Table에 insert
        List<Object[]> batch_mst = new ArrayList<Object[]>();
        if(!v_pdMst.isEmpty() && v_pdMst.size() > 0){
            boolean active_flag = false;
                if(v_pdMst.get("active_flag")!=null && (v_pdMst.get("active_flag")).equals("true")){
                    active_flag = true;
                }
            Object[] values = new Object[] {               

                v_pdMst.get("tenant_id"),
                v_pdMst.get("activity_code"),
                v_pdMst.get("sequence"),
                v_pdMst.get("description"),
                active_flag,
                v_pdMst.get("update_user_id"),
                v_pdMst.get("crud_type_code")                
                        
            };
            batch_mst.add(values);
            int[] updateMstCounts = jdbc.batchUpdate(v_sql_insertMstTable, batch_mst);
        }        

        jdbc.execute(v_sql_createLngTable.toString());
        
        List<Object[]> batch_dtl = new ArrayList<Object[]>();
        if(!v_pdDtl.isEmpty() && v_pdDtl.size() > 0){        
            for(PdpartBaseActivityLngType v_inRow : v_pdDtl){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("activity_code"),
                    v_inRow.get("language_cd"),
                    v_inRow.get("code_name"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("crud_type_code")
                };                
                batch_dtl.add(values);
            }            
            int[] updateLngCounts = jdbc.batchUpdate(v_sql_insertLngTable, batch_dtl);            
        }       

        jdbc.execute(v_sql_createCateTable.toString());
        
        List<Object[]> batch_cat = new ArrayList<Object[]>();
        
        if(!v_pdCat.isEmpty() && v_pdCat.size() > 0){
            boolean cate_active_flag = false;
            Integer sGrade;
            Integer aGrade;
            Integer bGrade;
            Integer cGrade;
            Integer dGrade;
                    
            for(PdpartBaseActivityCategoryType v_inRow : v_pdCat){                
                if(v_inRow.get("active_flag")!=null && (v_inRow.get("active_flag")).equals("true")){
                    cate_active_flag = true;
                } else {
                    cate_active_flag = false;
                }
                if(v_inRow.get("s_grade_standard_days")==null){
                    sGrade = null;
                } else {
                    sGrade = Integer.parseInt(String.valueOf(v_inRow.get("s_grade_standard_days")));
                }
                if(v_inRow.get("a_grade_standard_days")==null){
                    aGrade = null;
                } else {
                    aGrade = Integer.parseInt(String.valueOf(v_inRow.get("a_grade_standard_days")));
                }
                if(v_inRow.get("b_grade_standard_days")==null){
                    bGrade = null;
                } else {
                    bGrade = Integer.parseInt(String.valueOf(v_inRow.get("b_grade_standard_days")));
                }
                if(v_inRow.get("c_grade_standard_days")==null){
                    cGrade = null;
                } else {
                    cGrade = Integer.parseInt(String.valueOf(v_inRow.get("c_grade_standard_days")));
                }
                if(v_inRow.get("d_grade_standard_days")==null){
                    dGrade = null;
                } else {
                    dGrade = Integer.parseInt(String.valueOf(v_inRow.get("d_grade_standard_days")));
                }
                
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("activity_code"),
                    v_inRow.get("category_group_code"),
                    v_inRow.get("category_code"),
                    sGrade,                    
                    aGrade,
                    bGrade,
                    cGrade,
                    dGrade,                    
                    cate_active_flag,
                    v_inRow.get("update_user_id"),
                    v_inRow.get("crud_type_code")
                };                
                batch_cat.add(values);
            }            
            int[] updateCateCounts = jdbc.batchUpdate(v_sql_insertCateTable, batch_cat);            
        }
                
    
        OutType v_row = OutType.create();
        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutType>(){
            @Override
            public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
                // v_row.setReturnMsgCode(v_rs.getString("return_msg_code"));
                v_result.add(v_row);
                return v_row;
            }
        });
    

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                callableStatement.setString("CRUD_TYPE", crudType);                
                return callableStatement;
            }
        }, paramList);
        


        // Local Temp Table DROP
        try{
            jdbc.execute(v_sql_dropMstTable);
            jdbc.execute(v_sql_dropLngtable);
            jdbc.execute(v_sql_dropCatetable);
        }catch(Exception e){
            log.error("Part Base Activity Error  : {}", e);
            
        }

        context.setResult(v_row);
        context.setCompleted();

    }

}