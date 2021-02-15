package lg.sppCap.handlers.ep.cm;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collection;
import java.util.stream.Stream;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.ep.poapprmgtv4service.*;

@Component
@ServiceName(PoApprMgtV4Service_.CDS_NAME)
public class PoApprMgtV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;
    

    // Procedure 호출해서 외환신고품목 저장
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SavePoForexDeclarationProcContext.CDS_NAME)
    public void onSavePoForexDeclaration(SavePoForexDeclarationProcContext context) {

        log.info("### EP_PO_FOREX_DECLARATION_SAVE_PROC 프로시저 호출 시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_PO_FOREX_DECLARATION ( ")
                         .append("TENANT_ID	NVARCHAR(5) ")
                         .append(", COMPANY_CODE NVARCHAR(10) ")
                         .append(", PO_NUMBER NVARCHAR(50) ")
                         .append(", FOREX_DECLARE_STATUS_CODE NVARCHAR(30) ")
                         //.append(", DECLARE_SCHEDULED_DATE DATE ")
                         //.append(", DECLARE_DATE DATE")
                         .append(", DECLARE_SCHEDULED_DATE NVARCHAR(50) ")
                         .append(", DECLARE_DATE NVARCHAR(50)")
                         .append(", PROCESSED_COMPLETE_DATE NVARCHAR(50)")
                         .append(", ATTCH_GROUP_NUMBER NVARCHAR(100) ")
                         .append(", REMARK NVARCHAR(3000) ")
                         .append(", UPDATE_USER_ID NVARCHAR(255) ")
                         .append(")");

        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_EP_PO_FOREX_DECLARATION";
        
		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_EP_PO_FOREX_DECLARATION VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL EP_PO_FOREX_DECLARATION_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_PO_FOREX_DECLARATION, O_TABLE => ? )";

        Collection<SavedForexItems> v_inRows = context.getForexItems();

        ResultForexItems v_result = ResultForexItems.create();
        Collection<ResultForexItems> v_resultH = new ArrayList<>();
  
        

         log.info("###getForexItems===="+context.getForexItems()); 
         log.info("###v_inRows.size(===="+v_inRows.size()); 


        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());

        // Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inRows.isEmpty() && v_inRows.size() > 0){
            for(SavedForexItems v_inRow : v_inRows){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("po_number"),
                    v_inRow.get("forex_declare_status_code"),
                    v_inRow.get("declare_scheduled_date"),
                    v_inRow.get("declare_date"),
                    v_inRow.get("processed_complete_date"),
                    v_inRow.get("attch_group_number"),
                    v_inRow.get("remark"),
                    v_inRow.get("update_user_id")
                };
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTable, batchH);

        boolean delFlag = false;

        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<ResultForexItems>(){
            @Override
            public ResultForexItems mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ResultForexItems v_row = ResultForexItems.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setPoNumber(v_rs.getString("po_number"));
                v_row.setResultCode(v_rs.getString("result_code"));
                v_resultH.add(v_row);
                return v_row;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                String callProc = "";

                callProc = v_sql_callProc;
                
                CallableStatement callableStatement = connection.prepareCall(callProc);
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropableH);

        //v_result.setResultForexItems(v_resultH);

        context.setResult(v_resultH);
        context.setCompleted();

	}    

}