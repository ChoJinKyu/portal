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
    
    @On(event = TcCreateMcstProjectProcContext.CDS_NAME)
    public void onTcCreateMcstProjectProc(TcCreateMcstProjectProcContext context) {
        
        log.info("### DP_TC_CREATE_MCST_PROJECT_PROC 프로시저 호출시작 ###");
        
        StringBuffer v_sql = new StringBuffer();
        ResultSet v_rs = null;

        v_sql.append("CALL DP_TC_CREATE_MCST_PROJECT_PROC ( ")
                        .append(" I_TENANT_ID => ?, ")
                        .append(" I_PROJECT_CODE => ?, ")
                        .append(" I_MODEL_CODE => ?, ")
                        .append(" I_MCST_CODE => ?, ")
                        .append(" I_USER_ID => ?, ")
                        .append(" O_VERSION_NUMBER => ?, ")
                        .append(" O_RETURN_CODE => ?, ")
                        .append(" O_RETURN_MSG => ? ")
                        .append(" )");        
		try {
            
            Connection conn = jdbc.getDataSource().getConnection();            
            CallableStatement v_statement_proc = conn.prepareCall(v_sql.toString());

            log.info("v_sql.toString : "+ v_sql.toString());
            log.info("getTenantId : "+ context.getInputData().getTenantId());
            log.info("getProjectCode : "+ context.getInputData().getProjectCode());
            log.info("getModelCode : "+ context.getInputData().getModelCode());
            log.info("getMcstCode : "+ context.getInputData().getMcstCode());
            log.info("getUserId : "+ context.getInputData().getUserId());

            v_statement_proc.setString(1, context.getInputData().getTenantId());
            v_statement_proc.setString(2, context.getInputData().getProjectCode());
            v_statement_proc.setString(3, context.getInputData().getModelCode());
            v_statement_proc.setString(4, context.getInputData().getMcstCode());
            v_statement_proc.setString(5, context.getInputData().getUserId());
            

            log.info("v_sql.toString : "+ v_sql.toString());
            log.info("111111");
            v_rs = v_statement_proc.executeQuery();
            log.info("222222");
             // Procedure Out put 담기 TcProcOutType
            while (v_rs.next()){
                log.info("3333");
                CreatePjtOutputData v_row = CreatePjtOutputData.create();
                log.info("444");
                log.info("version_number : "+ v_rs.getString("version_number"));
                log.info("return_code : "+ v_rs.getString("return_code"));
                log.info("return_msg : "+ v_rs.getString("return_msg"));

                v_row.setReturnCode(v_rs.getString("version_number"));
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));    
                context.setResult(v_row);
            }

		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			log.info("SQLException : " + sqlE);
		} catch (Exception e) {
			e.printStackTrace();
			log.info("Exception : " + e);
		} finally {
			context.setCompleted();
        }
    
        log.info("### DP_TC_CREATE_MCST_PROJECT_PROC 프로시저 종료 ###");

    }
}