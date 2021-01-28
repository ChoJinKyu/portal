package lg.sppCap.handlers.sp.sf;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.fundingapplicationv4service.FundingApplicationV4Service_;
import cds.gen.sp.fundingapplicationv4service.ProcSaveTempContext;
import cds.gen.sp.fundingapplicationv4service.RtnObj;

@Component
@ServiceName("sp.FundingApplicationV4Service")
public class FundingApplicationServiceV4 implements EventHandler {

    private final static Logger log = LoggerFactory.getLogger(FundingApplicationV4Service_.class);
    // Code Master
    @Autowired
    JdbcTemplate jdbc;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = ProcSaveTempContext.CDS_NAME)
    public void onProcSaveTemp(ProcSaveTempContext context) {
        log.info("### onProcSaveTemp 1 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        //String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SF_FUNDING_APPL_DRAFT_PROC(");
        v_sql_callProc.append("I_FUNDING_APPL_NUMBER => ?,");
        v_sql_callProc.append("I_FUNDING_NOTIFY_NUMBER => ?,");
        v_sql_callProc.append("I_SUPPLIER_CODE => ?,");
        v_sql_callProc.append("I_TENANT_ID => ?,");
        v_sql_callProc.append("I_COMPANY_CODE => ?,");
        v_sql_callProc.append("I_ORG_TYPE_CODE => ?,");
        v_sql_callProc.append("I_ORG_CODE => ?,");
        v_sql_callProc.append("I_PURCHASING_DEPARTMENT_NAME => ?,");
        v_sql_callProc.append("I_PYEAR_SALES_AMOUNT => ?,");
        v_sql_callProc.append("I_MAIN_BANK_NAME => ?,");
        v_sql_callProc.append("I_FUNDING_APPL_AMOUNT => ?,");
        v_sql_callProc.append("I_FUNDING_HOPE_YYYYMM => ?,");
        v_sql_callProc.append("I_REPAYMENT_METHOD_CODE => ?,");
        v_sql_callProc.append("I_APPL_USER_NAME => ?,");
        v_sql_callProc.append("I_APPL_USER_TEL_NUMBER => ?,");
        v_sql_callProc.append("I_APPL_USER_EMAIL_ADDRESS => ?,");
        v_sql_callProc.append("I_FUNDING_REASON_CODE => ?,");
        v_sql_callProc.append("I_COLLATERAL_TYPE_CODE => ?,");
        v_sql_callProc.append("I_COLLATERAL_AMOUNT => ?,");
        v_sql_callProc.append("I_COLLATERAL_ATTCH_GROUP_NUMBER => ?,");
        v_sql_callProc.append("I_FUNDING_STEP_CODE => ?,");
        v_sql_callProc.append("I_FUNDING_STATUS_CODE => ?,");
        v_sql_callProc.append("I_USER_ID => ?,");
        v_sql_callProc.append("O_RESULT => ?)");

        log.info("### DB Connect Start ###");

        Collection<RtnObj> v_result = new ArrayList<>();

        log.info("### Proc Start ###");

        // Commit Option
        //jdbc.execute(v_sql_commitOption);

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_FUNDING_APPL_NUMBER", Types.VARCHAR));
        paramList.add(new SqlParameter("I_FUNDING_NOTIFY_NUMBER", Types.VARCHAR));
        paramList.add(new SqlParameter("I_SUPPLIER_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_TENANT_ID", Types.VARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_ORG_TYPE_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_ORG_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_PURCHASING_DEPARTMENT_NAME", Types.VARCHAR));
        paramList.add(new SqlParameter("I_PYEAR_SALES_AMOUNT", Types.DECIMAL));
        paramList.add(new SqlParameter("I_MAIN_BANK_NAME", Types.VARCHAR));
        paramList.add(new SqlParameter("I_FUNDING_APPL_AMOUNT", Types.DECIMAL));
        paramList.add(new SqlParameter("I_FUNDING_HOPE_YYYYMM", Types.VARCHAR));
        paramList.add(new SqlParameter("I_REPAYMENT_METHOD_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_APPL_USER_NAME", Types.VARCHAR));
        paramList.add(new SqlParameter("I_APPL_USER_TEL_NUMBER", Types.VARCHAR));
        paramList.add(new SqlParameter("I_APPL_USER_EMAIL_ADDRESS", Types.VARCHAR));
        paramList.add(new SqlParameter("I_FUNDING_REASON_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_COLLATERAL_TYPE_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_COLLATERAL_AMOUNT", Types.DECIMAL));
        paramList.add(new SqlParameter("I_COLLATERAL_ATTCH_GROUP_NUMBER", Types.VARCHAR));
        paramList.add(new SqlParameter("I_FUNDING_STEP_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_FUNDING_STATUS_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));

        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_RESULT", new RowMapper<RtnObj>() {
            @Override
            public RtnObj mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                RtnObj v_row = RtnObj.create();
                v_row.setResultCode(v_rs.getString("result_code"));
                v_row.setErrType(v_rs.getString("err_type"));
                v_row.setErrCode(v_rs.getString("err_code"));
                v_row.setRtnFundingApplNumber(v_rs.getString("rtn_funding_appl_number"));

                log.info(v_rs.getString("result_code"));
                log.info(v_rs.getString("err_type"));
                log.info(v_rs.getString("err_code"));
                log.info(v_rs.getString("rtn_funding_appl_number"));

                if ("NG".equals(v_rs.getString("result_code"))) {
                    log.info("### Call Proc Error!!  ###");
                    throw new ServiceException(ErrorStatuses.BAD_REQUEST, v_rs.getString("result_code"));
                }
                v_result.add(v_row);
                return v_row;
            }
        });

        paramList.add(oReturn);

        jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection)  {
                CallableStatement callableStatement = null;
                try {
                    callableStatement = connection.prepareCall(v_sql_callProc.toString());
                                    log.info("FundingNotifyNumber  : :  :  "+context.getFundingNotifyNumber());
                // callableStatement.setString("I_FUNDING_APPL_NUMBER", context.getFundingApplNumber());
                callableStatement.setString("I_FUNDING_APPL_NUMBER", "A2021-0016");
                callableStatement.setString("I_FUNDING_NOTIFY_NUMBER", "N2021-065");
                callableStatement.setString("I_SUPPLIER_CODE", context.getSupplierCode());
                callableStatement.setString("I_TENANT_ID", context.getTenantId());
                callableStatement.setString("I_COMPANY_CODE", context.getCompanyCode());
                callableStatement.setString("I_ORG_TYPE_CODE", context.getOrgTypeCode());
                callableStatement.setString("I_ORG_CODE", "ANZ");
                callableStatement.setString("I_PURCHASING_DEPARTMENT_NAME", context.getPurchasingDepartmentName());
                callableStatement.setBigDecimal("I_PYEAR_SALES_AMOUNT", context.getPyearSalesAmount());
                callableStatement.setString("I_MAIN_BANK_NAME", context.getMainBankName());
                callableStatement.setBigDecimal("I_FUNDING_APPL_AMOUNT", context.getFundingApplAmount());
                callableStatement.setString("I_FUNDING_HOPE_YYYYMM", context.getFundingHopeYyyymm());
                callableStatement.setString("I_REPAYMENT_METHOD_CODE", context.getRepaymentMethodCode());
                callableStatement.setString("I_APPL_USER_NAME", context.getApplUserName());
                callableStatement.setString("I_APPL_USER_TEL_NUMBER", context.getApplUserTelNumber());
                callableStatement.setString("I_APPL_USER_EMAIL_ADDRESS", context.getApplUserEmailAddress());
                callableStatement.setString("I_FUNDING_REASON_CODE", context.getFundingReasonCode());
                callableStatement.setString("I_COLLATERAL_TYPE_CODE", context.getCollateralTypeCode());
                callableStatement.setBigDecimal("I_COLLATERAL_AMOUNT", context.getCollateralAmount());
                //callableStatement.setString("I_COLLATERAL_START_DATE", context.getCollateralStartDate());
                callableStatement.setString("I_COLLATERAL_ATTCH_GROUP_NUMBER", context.getCollateralAttchGroupNumber());
                callableStatement.setString("I_FUNDING_STEP_CODE", context.getFundingStepCode());
                callableStatement.setString("I_FUNDING_STATUS_CODE", context.getFundingStatusCode());
                callableStatement.setString("I_USER_ID", context.getUserId());
                } catch (SQLException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }

                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        context.setResult(v_result);
        context.setCompleted();

    }
}