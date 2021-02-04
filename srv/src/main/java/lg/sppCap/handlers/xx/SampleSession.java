package lg.sppCap.handlers.xx;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;


import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.xx.samplesessionservice.*;

@Component
@ServiceName(SampleSessionService_.CDS_NAME)
public class SampleSession implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SessionProcContext.CDS_NAME)
    public void onSessionProc(SessionProcContext context) {
        String v_sql_callProc = "CALL XX_SAMPLE_SESS_PROC(O_TABLE => ?)";
        SppUserSessionType v_result = SppUserSessionType.create();

        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<SppUserSessionType>(){
            @Override
            public SppUserSessionType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setUserId(v_rs.getString("USER_ID"));
                v_result.setTenantId(v_rs.getString("TENANT_ID"));
                v_result.setCompanyCode(v_rs.getString("COMPANY_CODE"));
                v_result.setEmployeeNumber(v_rs.getString("EMPLOYEE_NUMBER"));
                v_result.setEmployeeName(v_rs.getString("EMPLOYEE_NAME"));
                v_result.setEnglishEmployeeName(v_rs.getString("ENGLISH_EMPLOYEE_NAME"));
                v_result.setEmployeeStatusCode(v_rs.getString("EMPLOYEE_STATUS_CODE"));
                v_result.setLanguageCode(v_rs.getString("LANGUAGE_CODE"));
                v_result.setTimezoneCode(v_rs.getString("TIMEZONE_CODE"));
                v_result.setDateFormatType(v_rs.getString("DATE_FORMAT_TYPE"));
                v_result.setDigitsFormatType(v_rs.getString("DIGITS_FORMAT_TYPE"));
                v_result.setCurrencyCode(v_rs.getString("CURRENCY_CODE"));
                v_result.setEmail(v_rs.getString("EMAIL"));
                v_result.setRoles(v_rs.getString("ROLES"));
                v_result.setApplicationuser(v_rs.getString("APPLICATIONUSER"));
                v_result.setConnection(v_rs.getLong("CONNECTION"));
                return v_result;
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

        context.setResult(v_result);
        context.setCompleted();


    }
}