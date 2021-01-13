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
        v_sql_callProc.append("CALL DP_TC_CREATE_MCST_PROJECT_PROC (");
        v_sql_callProc.append(" I_TENANT_ID => ?, ");
        v_sql_callProc.append(" I_PROJECT_CODE => ?, ");
        v_sql_callProc.append(" I_MODEL_CODE => ?, ");
        v_sql_callProc.append(" I_MCST_CODE => ?, ");
        v_sql_callProc.append(" I_USER_ID => ?, ");
        v_sql_callProc.append(" O_VERSION_NUMBER => ?, ");
        v_sql_callProc.append(" O_RETURN_CODE => ?, ");
        v_sql_callProc.append(" O_RETURN_MSG => ? )");  
             
        String o_version_number = "";
        String o_return_code = "";
        String o_return_msg = "";
        
        log.info("getTenantId : " + context.getInputData().getTenantId());        
        log.info("getProjectCode : " + context.getInputData().getProjectCode());
        log.info("getModelCode : " + context.getInputData().getModelCode());
        log.info("getMcstCode : " + context.getInputData().getMcstCode());
        log.info("getUserId : " + context.getInputData().getUserId());

    
        jdbc.update(v_sql_callProc.toString()
                , context.getInputData().getTenantId()
                , context.getInputData().getProjectCode()
                , context.getInputData().getModelCode()
                , context.getInputData().getMcstCode()
                , context.getInputData().getUserId()
                , o_version_number
                , o_return_code
                , o_return_msg
                );

        // SqlReturnResultSet oDTable = new SqlReturnResultSet("O_VERSION_NUMBER", new RowMapper<OutType>(){
        //     @Override
        //     public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
        //         OutType v_row = OutType.create();
        //         v_row.setReturncode(v_rs.getString("returncode"));
        //         v_row.setReturnmessage(v_rs.getString("returnmessage"));
        //         v_row.setSavedkey(v_rs.getString("savedkey"));
        //         v_result.add(v_row);
        //         return v_row;
        //     }
        // });  


        // Object<String> paramList = new ArrayList<String>();
        // paramList.add(o_version_number);
        // paramList.add(o_return_code);
        // paramList.add(o_return_msg);


        // Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
        //     @Override
        //     public CallableStatement createCallableStatement(Connection con) throws SQLException {
        //         CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());
        //         stmt.setString(1, context.getInputData().getTenantId());
        //         stmt.setString(2, context.getInputData().getProjectCode());
        //         stmt.setString(3, context.getInputData().getModelCode());
        //         stmt.setString(4, context.getInputData().getTenantId());
        //         stmt.setString(5, context.getInputData().getUserId());
        //         return stmt;
        //     }
        // }, paramList);       


        // for(int i=0; i<1; i++){
        //     log.info(paramList.getString(1));
        //     log.info(paramList.getString("o_version_number"));
        //     log.info(paramList.getString("o_return_code"));
        //     log.info(paramList.getString("o_return_msg"));
        // }
        
        log.info("o_version_number : " + o_version_number);
        log.info("o_version_number : " + o_return_code);
        log.info("o_version_number : " + o_return_msg);


         CreatePjtOutputData v_row = CreatePjtOutputData.create();
         v_row.setVersionNumber("11");
         v_row.setReturnCode("22");
         v_row.setReturnMsg("33");
         context.setResult(v_row);
         context.setCompleted(); 

        log.info("### DP_TC_CREATE_MCST_PROJECT_PROC 프로시저 호출 종료 end ###");
    }
}