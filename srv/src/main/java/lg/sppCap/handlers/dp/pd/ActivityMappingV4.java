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

import cds.gen.dp.activitymappingv4service.*;
import cds.gen.dp.activitymappingservice.*;

@Component
@ServiceName(ActivityMappingV4Service_.CDS_NAME)
public class ActivityMappingV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;
    
    @Transactional(rollbackFor = SQLException.class)
    @On(event = PdActivityMappingSaveProcContext.CDS_NAME)
    public void PdActivityMappingSaveProc(PdActivityMappingSaveProcContext context) {

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_DP_PD_ACTIVITY_MAPPING_TEMP (");
        v_sql_createTable.append("TENANT_ID NVARCHAR(5), ");
        v_sql_createTable.append("COMPANY_CODE NVARCHAR(10), ");
        v_sql_createTable.append("ORG_TYPE_CODE NVARCHAR(2), ");
        v_sql_createTable.append("ORG_CODE NVARCHAR(10), ");
        v_sql_createTable.append("ACTIVITY_CODE NVARCHAR(40), ");

        v_sql_createTable.append("PRODUCT_ACTIVITY_CODE NVARCHAR(40), ");
        v_sql_createTable.append("ACTIVITY_DEPENDENCY_CODE NVARCHAR(30), ");
        v_sql_createTable.append("ACTIVE_FLAG BOOLEAN, ");
        v_sql_createTable.append("UPDATE_USER_ID NVARCHAR(255), ");
        v_sql_createTable.append("LOCAL_UPDATE_DTM TIMESTAMP,");
        
        v_sql_createTable.append("CRUD_TYPE_CODE NVARCHAR(1), ");
        v_sql_createTable.append("UPDATE_ACTIVITY_CODE NVARCHAR(40), ");
        v_sql_createTable.append("UPDATE_PRODUCT_ACTIVITY_CODE NVARCHAR(40) ");
        v_sql_createTable.append(")");
        
        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP_DP_PD_ACTIVITY_MAPPING_TEMP";

		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_DP_PD_ACTIVITY_MAPPING_TEMP VALUES (?, ?, ?, ?, ?,   ?, ?, ?, ?, current_date,    ?, ?, ?)";
        String v_sql_callProc = "CALL DP_PD_ACTIVITY_MAPPING_SAVE_PROC(I_TABLE => #LOCAL_TEMP_DP_PD_ACTIVITY_MAPPING_TEMP, O_MSG  => ? )";
        
        ResultSet v_rs = null;
        Collection<OutType> v_result = new ArrayList<>();
        Collection<PdActivityMappingType> v_inRows = context.getInputData();

        try {
            // Commit Option
            jdbc.execute(v_sql_commitOption);
            // Local Temp Table 생성
            jdbc.execute(v_sql_createTable.toString());

            // Local Temp Table에 insert
            List<Object[]> batch = new ArrayList<Object[]>();
            if(!v_inRows.isEmpty() && v_inRows.size() > 0){
                for(PdActivityMappingType v_inRow : v_inRows){
                System.out.println(v_inRow.get("crud_type_code"));
                System.out.println(v_inRow.get("product_activity_code"));
                System.out.println(v_inRow.get("activity_dependency_code"));
                    Object[] values = new Object[] {
                        v_inRow.get("tenant_id")
                        , v_inRow.get("company_code")
                        , v_inRow.get("org_type_code")
                        , v_inRow.get("org_code")
                        , v_inRow.get("activity_code")

                        , v_inRow.get("product_activity_code")
                        , v_inRow.get("activity_dependency_code")
                        , true
                        , v_inRow.get("update_user_id")

                        , v_inRow.get("crud_type_code")
                        , v_inRow.get("update_activity_code")
                        , v_inRow.get("update_product_activity_code")
                    };
                    batch.add(values);
                }
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);

            // Procedure Call
            SqlReturnResultSet oTable = new SqlReturnResultSet("O_MSG", new RowMapper<OutType>(){
                @Override
                public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    OutType v_row = OutType.create();
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
                    return callableStatement;
                }
            }, paramList);
            
            // Local Temp Table DROP
            jdbc.execute(v_sql_dropable);

            context.setResult(v_result);
            context.setCompleted();
            

		}catch (Exception e) {
            e.printStackTrace();
		} 
    }
    
}