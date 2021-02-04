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

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.fundingapplicationv4service.InvPlanDtlDelType;
import cds.gen.sp.fundingapplicationv4service.InvPlanDtlType;
import cds.gen.sp.fundingapplicationv4service.InvPlanMstDelType;
import cds.gen.sp.fundingapplicationv4service.ProcDelInvPlanContext;
import cds.gen.sp.fundingapplicationv4service.ProcDelInvPlanDtlContext;
import cds.gen.sp.fundingapplicationv4service.ProcRequestContext;
import cds.gen.sp.fundingapplicationv4service.ProcSaveInvPlanContext;
import cds.gen.sp.fundingapplicationv4service.ProcSaveTempContext;
import cds.gen.sp.fundingapplicationv4service.RtnObj;
import cds.gen.sp.fundingapplicationv4service.RtnObjInvDtl;

@Component
@ServiceName("sp.FundingApplicationV4Service")
public class FundingApplicationServiceV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();


    // Code Master
    @Autowired
    JdbcTemplate jdbc;

    //신청서 임시저장
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
                v_row.setSqlErrCode(v_rs.getString("sql_err_code"));
                v_row.setDefErrCode(v_rs.getString("def_err_code"));
                v_row.setRtnFundingApplNumber(v_rs.getString("rtn_funding_appl_number"));

                log.info(v_rs.getString("result_code"));
                log.info(v_rs.getString("err_type"));
                log.info(v_rs.getString("sql_err_code"));
                log.info(v_rs.getString("def_err_code"));
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
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = null;
                callableStatement = connection.prepareCall(v_sql_callProc.toString());
                log.info("FundingNotifyNumber  : :  :  "+context.getFundingNotifyNumber());
                callableStatement.setString("I_FUNDING_APPL_NUMBER", context.getFundingApplNumber());
                // callableStatement.setString("I_FUNDING_APPL_NUMBER", "A2021-0016");
                callableStatement.setString("I_FUNDING_NOTIFY_NUMBER", context.getFundingNotifyNumber());
                callableStatement.setString("I_SUPPLIER_CODE", context.getSupplierCode());
                callableStatement.setString("I_TENANT_ID", context.getTenantId());
                callableStatement.setString("I_COMPANY_CODE", context.getCompanyCode());
                callableStatement.setString("I_ORG_TYPE_CODE", context.getOrgTypeCode());
                callableStatement.setString("I_ORG_CODE", context.getOrgCode());
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
                callableStatement.setString("I_COLLATERAL_ATTCH_GROUP_NUMBER", context.getCollateralAttchGroupNumber());
                callableStatement.setString("I_FUNDING_STEP_CODE", null);
                callableStatement.setString("I_FUNDING_STATUS_CODE", null);
                callableStatement.setString("I_USER_ID", "admin");
               
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        context.setResult(v_result);
        context.setCompleted();

    }

    //신청서 제출
    @Transactional(rollbackFor = SQLException.class)
    @On(event = ProcRequestContext.CDS_NAME)
    public void onProcRequest(ProcRequestContext context) {

        log.info("### onProcRequest 1 [On] ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SF_FUNDING_APPL_REQUEST_PROC(");
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
                v_row.setSqlErrCode(v_rs.getString("sql_err_code"));
                v_row.setDefErrCode(v_rs.getString("def_err_code"));
                v_row.setRtnFundingApplNumber(v_rs.getString("rtn_funding_appl_number"));

                log.info(v_rs.getString("result_code"));
                log.info(v_rs.getString("err_type"));
                log.info(v_rs.getString("sql_err_code"));
                log.info(v_rs.getString("def_err_code"));
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
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = null;
                callableStatement = connection.prepareCall(v_sql_callProc.toString());
                log.info("FundingApplNumber  : :  :  "+context.getFundingApplNumber());
                callableStatement.setString("I_FUNDING_APPL_NUMBER", context.getFundingApplNumber());
                callableStatement.setString("I_FUNDING_NOTIFY_NUMBER", context.getFundingNotifyNumber());
                callableStatement.setString("I_SUPPLIER_CODE", context.getSupplierCode());
                callableStatement.setString("I_TENANT_ID", context.getTenantId());
                callableStatement.setString("I_COMPANY_CODE", context.getCompanyCode());
                callableStatement.setString("I_ORG_TYPE_CODE", context.getOrgTypeCode());
                callableStatement.setString("I_ORG_CODE", context.getOrgCode());
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
                callableStatement.setString("I_COLLATERAL_ATTCH_GROUP_NUMBER", context.getCollateralAttchGroupNumber());
                callableStatement.setString("I_FUNDING_STEP_CODE", null);
                callableStatement.setString("I_FUNDING_STATUS_CODE", context.getFundingStatusCode());
                callableStatement.setString("I_USER_ID", "admin");
               
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        context.setResult(v_result);
        context.setCompleted();

    }

    //투자계획 저장
    @Transactional(rollbackFor = SQLException.class)
    @On(event = ProcSaveInvPlanContext.CDS_NAME)
    public void onProcSaveInvPlan(ProcSaveInvPlanContext context) {
        log.info("### onProcSaveInvPlan master/dtl[On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableDtl = new StringBuffer();
        v_sql_createTableDtl.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_DTL (");
            v_sql_createTableDtl.append("CRUD_TYPE NVARCHAR(1),");
            v_sql_createTableDtl.append("FUNDING_APPL_NUMBER NVARCHAR(10),");
            v_sql_createTableDtl.append("INVESTMENT_PLAN_SEQUENCE DECIMAL,");
            v_sql_createTableDtl.append("INVESTMENT_PLAN_ITEM_SEQUENCE DECIMAL,");
            v_sql_createTableDtl.append("INVESTMENT_ITEM_NAME NVARCHAR(500),");
            v_sql_createTableDtl.append("INVESTMENT_ITEM_PURCHASING_PRICE DECIMAL ,");
            v_sql_createTableDtl.append("INVESTMENT_ITEM_PURCHASING_QTY DECIMAL ,");
            v_sql_createTableDtl.append("INVESTMENT_ITEM_PURCHASING_AMT DECIMAL)");    
        
        String v_sql_dropTableDtl = "DROP TABLE #LOCAL_TEMP_DTL";

        String v_sql_insertTableDtl = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_callProc.append("CALL SP_SF_INVEST_PLAN_SAVE_PROC(");
            v_sql_callProc.append("I_CRUD_TYPE => ?,");
            v_sql_callProc.append("I_FUNDING_APPL_NUMBER => ?,");
            v_sql_callProc.append("I_INVESTMENT_PLAN_SEQUENCE => ?,");
            v_sql_callProc.append("I_INVESTMENT_TYPE_CODE => ?,");
            v_sql_callProc.append("I_INVESTMENT_PROJECT_NAME => ?,");
            v_sql_callProc.append("I_INVESTMENT_YYYYMM => ?,");
            v_sql_callProc.append("I_APPL_AMOUNT => ?,");
            v_sql_callProc.append("I_INVESTMENT_PURPOSE => ?,");
            v_sql_callProc.append("I_APPLY_MODEL_NAME => ?,");
            v_sql_callProc.append("I_ANNUAL_MTLMOB_QUANTITY => ?,");
            v_sql_callProc.append("I_INVESTMENT_DESC => ?,");
            v_sql_callProc.append("I_EXECUTION_YYYYMM => ?,");
            v_sql_callProc.append("I_INVESTMENT_EFFECT => ?,");
            v_sql_callProc.append("I_INVESTMENT_PLACE => ?,");
            v_sql_callProc.append("I_DTL_DATA => #LOCAL_TEMP_DTL,");  
            v_sql_callProc.append("I_USER_ID => ?,");
            v_sql_callProc.append("O_RESULT => ?)");

        log.info("### DB Connect Start ###");

        Collection<InvPlanDtlType> v_inDtl = context.getDtlType();

        Collection<RtnObj> v_result = new ArrayList<>();

        log.info("### Proc Start ###"); 

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Mst Local Temp Table 생성            
        jdbc.execute(v_sql_createTableDtl.toString());

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inDtl.isEmpty() && v_inDtl.size() > 0){
            for(InvPlanDtlType v_inRow : v_inDtl){
                Object[] values = new Object[] {
                    v_inRow.get("crud_type"),
                    v_inRow.get("funding_appl_number"),
                    v_inRow.get("investment_plan_sequence"),
                    v_inRow.get("investment_plan_item_sequence"),
                    v_inRow.get("investment_item_name"),
                    v_inRow.get("investment_item_purchasing_price"),
                    v_inRow.get("investment_item_purchasing_qty"),
                    v_inRow.get("investment_item_purchasing_amt")
                };
                    
                batchMst.add(values);
            }
        }
        
        int[] updateCountsDtl = jdbc.batchUpdate(v_sql_insertTableDtl, batchMst);                        

        log.info("### insertItem Success ###");

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_CRUD_TYPE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_FUNDING_APPL_NUMBER", Types.VARCHAR));
        paramList.add(new SqlParameter("I_INVESTMENT_PLAN_SEQUENCE", Types.INTEGER));
        paramList.add(new SqlParameter("I_INVESTMENT_TYPE_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_INVESTMENT_PROJECT_NAME", Types.VARCHAR));
        paramList.add(new SqlParameter("I_INVESTMENT_YYYYMM", Types.VARCHAR));
        paramList.add(new SqlParameter("I_APPL_AMOUNT", Types.DECIMAL));
        paramList.add(new SqlParameter("I_INVESTMENT_PURPOSE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_APPLY_MODEL_NAME", Types.VARCHAR));
        paramList.add(new SqlParameter("I_ANNUAL_MTLMOB_QUANTITY", Types.DECIMAL));
        paramList.add(new SqlParameter("I_INVESTMENT_DESC", Types.VARCHAR));
        paramList.add(new SqlParameter("I_EXECUTION_YYYYMM", Types.VARCHAR));
        paramList.add(new SqlParameter("I_INVESTMENT_EFFECT", Types.VARCHAR));
        paramList.add(new SqlParameter("I_INVESTMENT_PLACE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));


        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_RESULT", new RowMapper<RtnObj>() {
            @Override
            public RtnObj mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                RtnObj v_row = RtnObj.create();
                v_row.setResultCode(v_rs.getString("result_code"));
                v_row.setErrType(v_rs.getString("err_type"));
                v_row.setSqlErrCode(v_rs.getString("sql_err_code"));
                v_row.setDefErrCode(v_rs.getString("def_err_code"));
                v_row.setRtnFundingApplNumber(v_rs.getString("rtn_funding_appl_number"));

                log.info(v_rs.getString("result_code"));
                log.info(v_rs.getString("err_type"));
                log.info(v_rs.getString("sql_err_code"));
                log.info(v_rs.getString("def_err_code"));
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
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                log.info("FundingApplNumber  : :  :  "+context.getFundingApplNumber());
                callableStatement.setString("I_CRUD_TYPE", context.getCrudType());
                callableStatement.setString("I_FUNDING_APPL_NUMBER", context.getFundingApplNumber());
                callableStatement.setInt("I_INVESTMENT_PLAN_SEQUENCE", context.getInvestmentPlanSequence());
                callableStatement.setString("I_INVESTMENT_TYPE_CODE", context.getInvestmentTypeCode());
                callableStatement.setString("I_INVESTMENT_PROJECT_NAME", context.getInvestmentProjectName());
                callableStatement.setString("I_INVESTMENT_YYYYMM", context.getInvestmentYyyymm());
                callableStatement.setBigDecimal("I_APPL_AMOUNT", context.getApplAmount());
                callableStatement.setString("I_INVESTMENT_PURPOSE", context.getInvestmentPurpose());
                callableStatement.setString("I_APPLY_MODEL_NAME", context.getApplyModelName());
                callableStatement.setBigDecimal("I_ANNUAL_MTLMOB_QUANTITY", context.getAnnualMtlmobQuantity());
                callableStatement.setString("I_INVESTMENT_DESC", context.getInvestmentDesc());
                callableStatement.setString("I_EXECUTION_YYYYMM", context.getExecutionYyyymm());
                callableStatement.setString("I_INVESTMENT_EFFECT", context.getInvestmentEffect());
                callableStatement.setString("I_INVESTMENT_PLACE", context.getInvestmentPlace());
                callableStatement.setString("I_USER_ID", "admin");
               
                return callableStatement;
            }
        }, paramList);

        
        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableDtl);

        context.setResult(v_result);
        context.setCompleted();
    }

    //투자계획 마스터 삭제
    @Transactional(rollbackFor = SQLException.class)
    @On(event = ProcDelInvPlanContext.CDS_NAME)
    public void onProcDelInvPlan(ProcDelInvPlanContext context) {
        log.info("### onProcDelInvPlan ###");

        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MST (");
            v_sql_createTableMst.append("FUNDING_APPL_NUMBER NVARCHAR(10),");
            v_sql_createTableMst.append("INVESTMENT_PLAN_SEQUENCE DECIMAL)");
        
        String v_sql_dropTableMst = "DROP TABLE #LOCAL_TEMP_MST";

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_MST VALUES (?, ?)";

        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SF_INVEST_PLAN_DEL_PROC(");
            v_sql_callProc.append("I_MST_DATA => #LOCAL_TEMP_MST,");  
            v_sql_callProc.append("I_USER_ID => ?,");
            v_sql_callProc.append("O_RESULT => ?)");

        log.info("### DB Connect Start ###");

        Collection<InvPlanMstDelType> v_inMst = context.getMstType();

        Collection<RtnObj> v_result = new ArrayList<>();

        log.info("### Proc Start ###"); 

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Mst Local Temp Table 생성            
        jdbc.execute(v_sql_createTableMst.toString());

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inMst.isEmpty() && v_inMst.size() > 0){
            for(InvPlanMstDelType v_inRow : v_inMst){
                Object[] values = new Object[] {
                    v_inRow.get("funding_appl_number"),
                    v_inRow.get("investment_plan_sequence")
                };
                    
                batchMst.add(values);
            }
        }
        
        int[] updateCountsDtl = jdbc.batchUpdate(v_sql_insertTableMst, batchMst);                        

        log.info("### insertItem Success ###");

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));

        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_RESULT", new RowMapper<RtnObj>() {
            @Override
            public RtnObj mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                RtnObj v_row = RtnObj.create();
                v_row.setResultCode(v_rs.getString("result_code"));
                v_row.setErrType(v_rs.getString("err_type"));
                v_row.setSqlErrCode(v_rs.getString("sql_err_code"));
                v_row.setDefErrCode(v_rs.getString("def_err_code"));
                v_row.setRtnFundingApplNumber(v_rs.getString("rtn_funding_appl_number"));

                log.info(v_rs.getString("result_code"));
                log.info(v_rs.getString("err_type"));
                // log.info(v_rs.getString("err_code"));
                log.info(v_rs.getString("rtn_funding_appl_number"));
                // log.info(v_rs.getString("rtn_investment_plan_sequence"));

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
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("I_USER_ID", "admin");
               
                return callableStatement;
            }
        }, paramList);

        
        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableMst);

        context.setResult(v_result);
        context.setCompleted();

    }

    //투자계획상세 삭제
    @Transactional(rollbackFor = SQLException.class)
    @On(event = ProcDelInvPlanDtlContext.CDS_NAME)
    public void onProcDelInvPlanDtl(ProcDelInvPlanDtlContext context) {
        log.info("### onProcDelInvPlanDtl ###");

        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableDtl = new StringBuffer();
        v_sql_createTableDtl.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_DTL (");
            v_sql_createTableDtl.append("FUNDING_APPL_NUMBER NVARCHAR(10),");
            v_sql_createTableDtl.append("INVESTMENT_PLAN_SEQUENCE DECIMAL,");
            v_sql_createTableDtl.append("INVESTMENT_PLAN_ITEM_SEQUENCE DECIMAL)");
        
        String v_sql_dropTableDtl = "DROP TABLE #LOCAL_TEMP_DTL";

        String v_sql_insertTableDtl = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?, ?, ?)";

        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SF_INVEST_PLAN_DTL_DEL_PROC(");
            v_sql_callProc.append("I_DTL_DATA => #LOCAL_TEMP_DTL,");  
            v_sql_callProc.append("I_USER_ID => ?,");
            v_sql_callProc.append("O_RESULT => ?)");

        log.info("### DB Connect Start ###");

        Collection<InvPlanDtlDelType> v_inDtl = context.getDtlType();

        Collection<RtnObjInvDtl> v_result = new ArrayList<>();

        log.info("### Proc Start ###"); 

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Mst Local Temp Table 생성            
        jdbc.execute(v_sql_createTableDtl.toString());

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inDtl.isEmpty() && v_inDtl.size() > 0){
            for(InvPlanDtlDelType v_inRow : v_inDtl){
                Object[] values = new Object[] {
                    v_inRow.get("funding_appl_number"),
                    v_inRow.get("investment_plan_sequence"),
                    v_inRow.get("investment_plan_item_sequence")
                };
                    
                batchMst.add(values);
            }
        }
        
        int[] updateCountsDtl = jdbc.batchUpdate(v_sql_insertTableDtl, batchMst);                        

        log.info("### insertItem Success ###");

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));


        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_RESULT", new RowMapper<RtnObjInvDtl>() {
            @Override
            public RtnObjInvDtl mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                RtnObjInvDtl v_row = RtnObjInvDtl.create();
                v_row.setResultCode(v_rs.getString("result_code"));
                v_row.setErrType(v_rs.getString("err_type"));
                v_row.setSqlErrCode(v_rs.getString("sql_err_code"));
                v_row.setDefErrCode(v_rs.getString("def_err_code"));
                v_row.setRtnFundingApplNumber(v_rs.getString("rtn_funding_appl_number"));

                log.info(v_rs.getString("result_code"));
                log.info(v_rs.getString("err_type"));
                log.info(v_rs.getString("sql_err_code"));
                log.info(v_rs.getString("def_err_code"));
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
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("I_USER_ID", "admin");
               
                return callableStatement;
            }
        }, paramList);

        
        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableDtl);

        context.setResult(v_result);
        context.setCompleted();

    }

}
