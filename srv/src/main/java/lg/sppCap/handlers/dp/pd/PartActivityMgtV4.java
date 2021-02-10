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

import cds.gen.dp.partactivityv4service.*;

@Component
@ServiceName(PartActivityV4Service_.CDS_NAME)
public class PartActivityMgtV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;
    
    @Transactional(rollbackFor = SQLException.class)
    @On(event = PdpartActivitySaveProcContext.CDS_NAME)
    public void SaveIdeaProc(PdpartActivitySaveProcContext context) {
        System.out.println("START PROC.....");
        // ProcInputType v_inDatas = context.getInputData();
        String crudType = context.getInputData().getCrudType();
        PdpartActivityTemplateType v_pdMst = context.getInputData().getPdMst();
        // Collection<PdPartBaseActivityLng> v_pdDtl = context.getInputData().getPdDtl();
        
        /*
        System.out.println(v_inDatas.get("tenant_id"));
        System.out.println(v_inDatas.get("idea_number"));
        System.out.println(v_inDatas.get("idea_title"));if(!v_inDatas.isEmpty() && v_inDatas.size() > 0){
            for(PdProdActivityTemplateType v_inRow : v_inDatas){
                System.out.println(v_inRow.get("crud_type_code"));
                System.out.println(v_inRow.get("product_activity_code"));
                System.out.println(v_inRow.get("product_activity_name"));
            }
        }*/
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        // master 테이블
        StringBuffer v_sql_createMstTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createMstTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PART_ACTIVITY (");

        v_sql_createMstTable.append("TENANT_ID NVARCHAR(5),");
        v_sql_createMstTable.append("COMPANY_CODE NVARCHAR(10),");
        // v_sql_createMstTable.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createMstTable.append("ORG_CODE NVARCHAR(10),");
        v_sql_createMstTable.append("PART_PROJECT_TYPE_CODE NVARCHAR(30),");

        v_sql_createMstTable.append("ACTIVITY_CODE NVARCHAR(40),");
        // v_sql_createMstTable.append("CATEGORY_GROUP_CODE NVARCHAR(30),");
        v_sql_createMstTable.append("SEQUENCE DECIMAL,");
        v_sql_createMstTable.append("DEVELOPE_EVENT_CODE NVARCHAR(30),");
        v_sql_createMstTable.append("ACTUAL_ROLE_CODE NVARCHAR(40),");

        v_sql_createMstTable.append("ACTIVITY_COMPLETE_TYPE_CODE NVARCHAR(10),");
        v_sql_createMstTable.append("JOB_TYPE_CODE NVARCHAR(10),");
        v_sql_createMstTable.append("ATTACHMENT_MANDATORY_FLAG BOOLEAN,");
        v_sql_createMstTable.append("APPROVE_MANDATORY_FLAG BOOLEAN,");
        v_sql_createMstTable.append("ACTIVE_FLAG BOOLEAN,");

        v_sql_createMstTable.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createMstTable.append("CRUD_TYPE_CODE NVARCHAR(1) )");

        String v_sql_insertMstTable = "INSERT INTO #LOCAL_TEMP_PART_ACTIVITY VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";        
        
        String v_sql_dropMstTable = "DROP TABLE #LOCAL_TEMP_PART_ACTIVITY";

        // // languages 테이블
        // StringBuffer v_sql_createLngTable = new StringBuffer();
        // // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        // v_sql_createLngTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG (");

        // v_sql_createLngTable.append("TENANT_ID NVARCHAR(5),");
        // v_sql_createLngTable.append("ACTIVITY_CODE NVARCHAR(40),");
        // v_sql_createLngTable.append("LANGUAGE_CD NVARCHAR(30),");
        // v_sql_createLngTable.append("CODE_NAME NVARCHAR(240),");        
        // v_sql_createLngTable.append("UPDATE_USER_ID NVARCHAR(255),");
        // v_sql_createLngTable.append("CRUD_TYPE_CODE NVARCHAR(1) )");

        // String v_sql_insertLngTable = "INSERT INTO #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG VALUES (?, ?, ?, ?, ?, ?)";        
        
        // String v_sql_dropLngtable = "DROP TABLE #LOCAL_TEMP_PART_BASE_ACTIVITY_LNG";

        String v_sql_callProc = "CALL DP_PD_PART_ACTIVITY_TEMPLETE_SAVE_PROC(CRUD_TYPE => ?, I_M => #LOCAL_TEMP_PART_ACTIVITY, O_MSG => ?)";

        Collection<OutType> v_result = new ArrayList<>();

        ResultSet v_rs = null;

                    
        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createMstTable.toString());        
        
        // Local Temp Table에 insert
        List<Object[]> batch_mst = new ArrayList<Object[]>();
        if(!v_pdMst.isEmpty() && v_pdMst.size() > 0){
            boolean attachment_mandatory_flag = false;
            if(v_pdMst.get("attachment_mandatory_flag")!=null && (v_pdMst.get("attachment_mandatory_flag")).equals("true")){
                attachment_mandatory_flag = true;
            }
            boolean approve_mandatory_flag = false;
            if(v_pdMst.get("approve_mandatory_flag")!=null && (v_pdMst.get("approve_mandatory_flag")).equals("true")){
                approve_mandatory_flag = true;
            }
            boolean active_flag = false;
            if(v_pdMst.get("active_flag")!=null && (v_pdMst.get("active_flag")).equals("true")){
                active_flag = true;
            }
            Object[] values = new Object[] {

                v_pdMst.get("tenant_id"),
                v_pdMst.get("company_code"),
                // v_pdMst.get("org_type_code"),
                v_pdMst.get("org_code"),
                v_pdMst.get("part_project_type_code"),

                v_pdMst.get("activity_code"),
                // v_pdMst.get("category_group_code"),
                v_pdMst.get("sequence"),
                v_pdMst.get("develope_event_code"),
                v_pdMst.get("actual_role_code"),

                v_pdMst.get("activity_complete_type_code"),
                v_pdMst.get("job_type_code"),
                attachment_mandatory_flag,
                approve_mandatory_flag,
                active_flag, 
                
                v_pdMst.get("update_user_id"),
                v_pdMst.get("crud_type_code")                
                
                // Integer.parseInt(String.valueOf(v_inDatas.get("vi_amount"))),
                // Integer.parseInt(String.valueOf(v_inDatas.get("monthly_mtlmob_quantity"))),
                // Integer.parseInt(String.valueOf(v_inDatas.get("monthly_purchasing_amount"))),
                // Integer.parseInt(String.valueOf(v_inDatas.get("annual_purchasing_amount"))),
                        
            };
            batch_mst.add(values);
            int[] updateMstCounts = jdbc.batchUpdate(v_sql_insertMstTable, batch_mst);
        }

        

        // jdbc.execute(v_sql_createLngTable.toString());

        // BaseExtrate Local Temp Table에 insert
            // List<Object[]> batch_dtl = new ArrayList<Object[]>();
            // if(!v_pdDtl.isEmpty() && v_pdDtl.size() > 0){
            // // log.info("-----> v_pdDtl : " + v_pdDtl.size());
            //     for(PdPartBaseActivityLng v_inRow : v_pdDtl){
            //         Object[] values = new Object[] {
            //             v_inRow.get("tenant_id"),
            //             v_inRow.get("activity_code"),
            //             v_inRow.get("language_cd"),
            //             v_inRow.get("code_name"),
            //             v_inRow.get("update_user_id"),
            //             v_inRow.get("crud_type_code")
            //         };
            //         //v_statement_insertBaseExtrate.addBatch();
            //         batch_dtl.add(values);
            //     }
            //     //v_statement_insertBaseExtrate.executeBatch();
            //     int[] updateLngCounts = jdbc.batchUpdate(v_sql_insertLngTable, batch_dtl);
            //     // log.info("batch_BaseExtrate : " + updateCounts);
            // }

        // int[] updateLngCounts = jdbc.batchUpdate(v_sql_insertLngTable, batch);
                
    
        OutType v_row = OutType.create();
        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutType>(){
            @Override
            public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));                
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
        jdbc.execute(v_sql_dropMstTable);
        // jdbc.execute(v_sql_dropLngtable);

        context.setResult(v_row);
        context.setCompleted();

    }

}