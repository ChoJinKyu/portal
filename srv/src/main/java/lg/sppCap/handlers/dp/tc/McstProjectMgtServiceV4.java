package lg.sppCap.handlers.dp.tc;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
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
import java.sql.Types;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlOutParameter;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;

import cds.gen.dp.mcstprojectmgtv4service.*;

/**
 *  프로시저 호출시 OutPut의 경우 문자열로 적용시 데이터을 받지 못하고 있음 
 *  OutPut에 경우 O_TABLE형식으로 보내줘야함   
 */
@Component
@ServiceName(McstProjectMgtV4Service_.CDS_NAME)
public class McstProjectMgtServiceV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;   

    @On(event=TcCreateMcstProjectProcContext.CDS_NAME)
    public void onTcCreateMcstProjectProc(TcCreateMcstProjectProcContext context) {

        log.info("### DP_TC_CREATE_MCST_PROJECT_PROC 프로시저 호출시작  start###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        //String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";  

        // Commit Option
        //jdbc.execute(v_sql_commitOption);
                    
        StringBuffer v_sql_callProc = new StringBuffer();
        // v_sql_callProc.append("CALL DP_TC_CREATE_MCST_PROJECT_PROC (");
        // v_sql_callProc.append(" I_TENANT_ID => ?, ");
        // v_sql_callProc.append(" I_PROJECT_CODE => ?, ");
        // v_sql_callProc.append(" I_MODEL_CODE => ?, ");
        // v_sql_callProc.append(" I_MCST_CODE => ?, ");
        // v_sql_callProc.append(" I_USER_ID => ?, ");
        // v_sql_callProc.append(" O_VERSION_NUMBER => ?, ");
        // v_sql_callProc.append(" O_RETURN_CODE => ?, ");
        // v_sql_callProc.append(" O_RETURN_MSG => ? ");  
        // v_sql_callProc.append(" )");  


        v_sql_callProc.append("CALL test03 (");
        v_sql_callProc.append(" O_TABLE => ? ");  
        v_sql_callProc.append(" )"); 
        
        
        CreatePjtOutputData v_result = CreatePjtOutputData.create();
        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<CreatePjtOutputData>(){
            @Override
            public CreatePjtOutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setVersionNumber(v_rs.getString("version_number"));
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });  


        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);        

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());
                // stmt.setString("I_TENANT_ID", context.getInputData().getTenantId());
                // stmt.setString("I_PROJECT_CODE", context.getInputData().getProjectCode());
                // stmt.setString("I_MODEL_CODE", context.getInputData().getModelCode());
                // stmt.setString("I_MCST_CODE", context.getInputData().getTenantId());
                // stmt.setString("I_USER_ID", context.getInputData().getUserId());
                return stmt;
            }
        }, paramList);       
      

        context.setResult(v_result);
        context.setCompleted();

        log.info("### DP_TC_CREATE_MCST_PROJECT_PROC 프로시저 호출 종료 end ###");
    }
}