package lg.sppCap.handlers.op.pu.pr;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

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

import cds.gen.cm.msgmgtservice.Message;
import cds.gen.cm.msgmgtservice.Message_;
import lg.sppCap.frame.handler.BaseEventHandler;

import cds.gen.op.prreviewmgtv4service.*;

@Component
@ServiceName(PrReviewMgtV4Service_.CDS_NAME)
public class PrReviewMgtV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = CallPrReviewSaveProcContext.CDS_NAME)
    public void onCallPrReviewSaveProc(CallPrReviewSaveProcContext context) {

        log.info("#### onCallPrReviewSaveProc Start ");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_PR_REVIEW (")
                         .append("TRANSACTION_CODE NVARCHAR(1), ")
                         .append("TENANT_ID NVARCHAR(5), ")
                         .append("COMPANY_CODE NVARCHAR(10), ")
                         .append("PR_NUMBER NVARCHAR(50), ")
                         .append("PR_ITEM_NUMBER NVARCHAR(10) ")
                         .append(")");

        String v_sql_dropTable = "DROP TABLE #LOCAL_TEMP_PR_REVIEW";
        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PR_REVIEW VALUES (?, ?, ?, ?, ?)";

        log.info("#### LOCAL_TEMP Table Create Success ####");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL OP_PU_PR_REVIEW_SAVE_PROC (")
                      .append("I_JOB_TYPE => ?, ")
                      .append("I_PR_ITEM_TBL => #LOCAL_TEMP_PR_REVIEW, ")
                      .append("I_BUYER_EMPNO => ?, ")
                      .append("I_BUYER_DEPARTMENT_CODE => ?, ")
                      .append("I_PROCESSED_REASON => ?, ")
                      .append("I_EMPLOYEE_NUMBER => ?, ")
                      .append("O_MSG_TBL => ? ")
                      .append(")");

        log.info("#### DB Connect Start ####");
        ProcInputType v_inData = context.getInputData();
        Collection<PrItemType> v_inPrItemTbl = v_inData.getPrItemTbl();
        Collection<OutType> v_result = new ArrayList<>();

        log.info("#### Proc Start ####");

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());

        // Local Temp Table에 insert
        List<Object[]> batch_prItemTbl = new ArrayList<Object[]>();
        if (!v_inPrItemTbl.isEmpty() && v_inPrItemTbl.size() > 0) {
            for (PrItemType v_inRow : v_inPrItemTbl) {
                Object[] values = new Object[] {
                                                 v_inRow.get("transaction_code")
                                                ,v_inRow.get("tenant_id")
                                                ,v_inRow.get("company_code")
                                                ,v_inRow.get("pr_number")
                                                ,v_inRow.get("pr_item_number")
                                                };
                log.info("====> PR Number : " + v_inRow.get("pr_number") + ", PR Item Number : " + v_inRow.get("pr_item_number"));
                batch_prItemTbl.add(values);
            }
        }

        int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch_prItemTbl);

        log.info("#### LOCAL_TEMP Data Insert Success ####");

        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_MSG_TBL", new RowMapper<OutType>() {
            @Override
            public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                OutType v_row = OutType.create();
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
                log.info("====> return_code : " + v_rs.getString("return_code"));
                log.info("====> return_msg  : " + v_rs.getString("return_msg"));

/*
                if ("NG".equals(v_rs.getString("return_code"))) {
                    log.info("#### Call Proc Error!!  ####");
                    log.info("====> ErrorStatuses.BAD_REQUEST  : " + ErrorStatuses.BAD_REQUEST);
                    throw new ServiceException(ErrorStatuses.BAD_REQUEST, v_rs.getString("return_msg"));
                }
*/
                v_result.add(v_row);
                return v_row;
            }
        });

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_JOB_TYPE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_BUYER_EMPNO", Types.VARCHAR));
        paramList.add(new SqlParameter("I_BUYER_DEPARTMENT_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_PROCESSED_REASON", Types.VARCHAR));
        paramList.add(new SqlParameter("I_EMPLOYEE_NUMBER", Types.VARCHAR));
        paramList.add(oReturn);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());

                log.info("====> I_JOB_TYPE              : "+v_inData.getJobType());
                log.info("====> I_BUYER_EMPNO           : "+v_inData.getBuyerEmpno());
                log.info("====> I_BUYER_DEPARTMENT_CODE : "+v_inData.getBuyerDepartmentCode());
                log.info("====> I_PROCESSED_REASON      : "+v_inData.getProcessedReason());
                log.info("====> I_EMPLOYEE_NUMBER       : "+v_inData.getEmployeeNumber());

                stmt.setString("I_JOB_TYPE", v_inData.getJobType());
                stmt.setString("I_BUYER_EMPNO", v_inData.getBuyerEmpno());
                stmt.setString("I_BUYER_DEPARTMENT_CODE", v_inData.getBuyerDepartmentCode());
                stmt.setString("I_PROCESSED_REASON", v_inData.getProcessedReason());
                stmt.setString("I_EMPLOYEE_NUMBER", v_inData.getEmployeeNumber());

                return stmt;
            }
        }, paramList);

        log.info("#### callProc Success ####");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTable);

        context.setResult(v_result);
        context.setCompleted();

        log.info("#### onCallPrReviewSaveProc End");

    }

}