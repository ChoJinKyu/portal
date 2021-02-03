package lg.sppCap.handlers.dp.pd;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import lg.sppCap.frame.handler.BaseEventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;

import cds.gen.dp.creationrequestv4service.*;
import cds.gen.dp.partcategorycreationrequestservice.*;

@Component
@ServiceName(CreationRequestV4Service_.CDS_NAME)
public class CreationRequestV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = PdCreationRequestSaveProcContext.CDS_NAME)
    public void PdCreationRequestSaveProc(PdCreationRequestSaveProcContext context) {

        String crudType = context.getInputData().getCrudType();
        PdCategoryCreationRequetType v_pdMst = context.getInputData().getPdMst();
        // 결재선
        Collection<PdCategoryApprovalType> v_pdDtl = context.getInputData().getPdDtl();



        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        // master 테이블
        StringBuffer v_sql_createMstTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createMstTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_DP_PD_PART_CATEGORY_CREATION_REQUEST (");
        v_sql_createMstTable.append("TENANT_ID NVARCHAR(5), ");
        v_sql_createMstTable.append("REQUEST_NUMBER NVARCHAR(30), ");
        v_sql_createMstTable.append("CATEGORY_GROUP_CODE NVARCHAR(30), ");
        v_sql_createMstTable.append("APPROVAL_NUMBER NVARCHAR(50), ");
        v_sql_createMstTable.append("REQUEST_TITLE NVARCHAR(50), ");

        v_sql_createMstTable.append("REQUEST_CATEGORY_NAME NVARCHAR(50), ");
        v_sql_createMstTable.append("SIMILAR_CATEGORY_CODE NVARCHAR(40),");
        v_sql_createMstTable.append("REQUESTOR_EMPNO NVARCHAR(30), ");
        v_sql_createMstTable.append("REQUEST_DATE_TIME TIMESTAMP, ");
        v_sql_createMstTable.append("REQUEST_DESC BLOB, ");

        v_sql_createMstTable.append("ATTCH_GROUP_NUMBER NVARCHAR(100), ");
        v_sql_createMstTable.append("PROGRESS_STATUS_CODE NVARCHAR(30),");
        v_sql_createMstTable.append("CREATOR_EMPNO NVARCHAR(30), ");
        v_sql_createMstTable.append("CREATE_CATEGORY_CODE NVARCHAR(40), ");
        v_sql_createMstTable.append("UPDATE_USER_ID NVARCHAR(255), ");

        v_sql_createMstTable.append("CRUD_TYPE_CODE NVARCHAR(1) ");
        v_sql_createMstTable.append(")");

        String v_sql_insertMstTable = "INSERT INTO #LOCAL_TEMP_DP_PD_PART_CATEGORY_CREATION_REQUEST VALUES (?, ?, ?, ?, ?,   ?, ?, ?, ?, ?,    ?, ?, ?, ?, ?,    ?)";
        String v_sql_dropMstTable = "DROP TABLE #LOCAL_TEMP_DP_PD_PART_CATEGORY_CREATION_REQUEST";
        

        // 결재선 테이블
        StringBuffer v_sql_createDtlTable = new StringBuffer();
		v_sql_createDtlTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_DP_PD_PART_CATEGORY_APPROVAL (");
        v_sql_createDtlTable.append("TENANT_ID NVARCHAR(5), ");
        v_sql_createDtlTable.append("REQUEST_NUMBER NVARCHAR(30), ");
        v_sql_createDtlTable.append("APPROVE_SEQUENCE DECIMAL, ");
        v_sql_createDtlTable.append("APPROVAL_NUMBER NVARCHAR(50), ");
        v_sql_createDtlTable.append("REQUESTOR_EMPNO NVARCHAR(30), ");

        v_sql_createDtlTable.append("TF_FLAG BOOLEAN, ");
        v_sql_createDtlTable.append("APPROVAL_COMMENT NVARCHAR(500), ");
        v_sql_createDtlTable.append("APPROVE_DATE_TIME TIMESTAMP, ");
        v_sql_createDtlTable.append("UPDATE_USER_ID NVARCHAR(255) ");
        v_sql_createDtlTable.append("CRUD_TYPE_CODE NVARCHAR(1) ");
        v_sql_createDtlTable.append(")");

        String v_sql_insertDtlTable = "INSERT INTO #LOCAL_TEMP_DP_PD_PART_CATEGORY_APPROVAL VALUES (?, ?, ?, ?, ?,   ?, ?, ?, ?, ?)";
        String v_sql_dropDtlTable = "DROP TABLE #LOCAL_TEMP_DP_PD_PART_CATEGORY_APPROVAL";

        String v_sql_callProc = "CALL DP_PD_CATEGORY_CREATION_REQUEST_SAVE_PROC(CRUD_TYPE => ?, I_M => #LOCAL_TEMP_DP_PD_PART_CATEGORY_CREATION_REQUEST, I_D => #LOCAL_TEMP_DP_PD_PART_CATEGORY_APPROVAL, O_MSG => ? )";
        
        Collection<OutType> v_result = new ArrayList<>();
        ResultSet v_rs = null;

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createMstTable.toString());

        // Local Temp Table에 insert
        List<Object[]> batch_mst = new ArrayList<Object[]>();
        if(!v_pdMst.isEmpty() && v_pdMst.size() > 0){
            
            Object[] values = new Object[] {               

                v_pdMst.get("tenant_id"),
                v_pdMst.get("request_number"),
                v_pdMst.get("category_group_code"),
                v_pdMst.get("approval_number"),
                v_pdMst.get("request_title"),

                v_pdMst.get("request_category_name"),
                v_pdMst.get("similar_category_code"),
                v_pdMst.get("requestor_empno"),
                v_pdMst.get("request_date_time"),
                v_pdMst.get("request_desc"),

                v_pdMst.get("attch_group_number"),
                v_pdMst.get("progress_status_code"),
                v_pdMst.get("creator_empno"),
                v_pdMst.get("create_category_code"),
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

        jdbc.execute(v_sql_createDtlTable.toString());

        // BaseExtrate Local Temp Table에 insert
        List<Object[]> batch_dtl = new ArrayList<Object[]>();
        if(!v_pdDtl.isEmpty() && v_pdDtl.size() > 0){

            for(PdCategoryApprovalType v_inRow : v_pdDtl){

                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("request_number"),
                    v_inRow.get("approve_sequence"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("requestor_empno"),

                    v_inRow.get("tf_flag"),
                    v_inRow.get("approval_comment"),
                    v_inRow.get("approve_date_time"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("crud_type_code")
                };

                batch_dtl.add(values);
            }

            int[] updateDtlCounts = jdbc.batchUpdate(v_sql_insertDtlTable, batch_dtl);
        }

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
        jdbc.execute(v_sql_dropDtlTable);

        context.setResult(v_row);
        context.setCompleted();

    }

}
