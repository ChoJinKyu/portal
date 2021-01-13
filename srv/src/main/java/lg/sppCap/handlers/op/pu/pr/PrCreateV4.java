package lg.sppCap.handlers.op.pu.pr;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;
import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
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
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.Insert;

import lg.sppCap.util.StringUtil;

import cds.gen.op.prcreatev4service.*;

@Component
@ServiceName(PrCreateV4Service_.CDS_NAME)
public class PrCreateV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SavePrCreateProcContext.CDS_NAME)
    public void onSavePrCreateProc(SavePrCreateProcContext context) {

        log.info("##### onSavePrCreateProc START ");

        Collection<PrCreateSaveType> v_inMultiData = context.getInputData();
        Collection<OutType> v_result = new ArrayList<>();
        int iRow = 0;
        
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        StringBuffer v_sql_createTableM = new StringBuffer();
        v_sql_createTableM.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_M (")    
        .append("TENANT_ID NVARCHAR(5),")
        .append("COMPANY_CODE NVARCHAR(10),")
        .append("PR_NUMBER NVARCHAR(50),")
        .append("PR_TYPE_CODE NVARCHAR(30),")
        .append("PR_TYPE_CODE_2 NVARCHAR(30),")
        .append("PR_TYPE_CODE_3 NVARCHAR(40),")
        .append("PR_TEMPLATE_NUMBER NVARCHAR(10),")
        .append("PR_CREATE_SYSTEM_CODE NVARCHAR(30),")
        .append("PR_DESC NVARCHAR(100),")
        .append("REQUESTOR_EMPNO NVARCHAR(30),")
        .append("REQUESTOR_NAME NVARCHAR(50),")
        .append("REQUESTOR_DEPARTMENT_CODE NVARCHAR(50),")
        .append("REQUESTOR_DEPARTMENT_NAME NVARCHAR(240),")
        .append("PR_CREATE_STATUS_CODE NVARCHAR(30), ")
        .append("PR_HEADER_TEXT NVARCHAR(200),")
        .append("APPROVAL_CONTENTS NCLOB,")
        .append("UPDATE_USER_ID NVARCHAR(255)")
        .append(")");   
        
        StringBuffer v_sql_createTableD = new StringBuffer();
        v_sql_createTableD.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (")    
        .append("TENANT_ID NVARCHAR(5),")
        .append("COMPANY_CODE NVARCHAR(10),")
        .append("PR_NUMBER NVARCHAR(50),")
        .append("PR_ITEM_NUMBER NVARCHAR(10),")
        .append("ORG_TYPE_CODE NVARCHAR(2), ")
		.append("ORG_CODE NVARCHAR(10), ")
		.append("MATERIAL_CODE NVARCHAR(40), ")
		.append("MATERIAL_GROUP_CODE NVARCHAR(10),")
		.append("PR_DESC NVARCHAR(100),")
		.append("PR_QUANTITY NVARCHAR(34),")
		.append("PR_UNIT NVARCHAR(3),")
        .append("REQUESTOR_EMPNO NVARCHAR(30),")
        .append("REQUESTOR_NAME NVARCHAR(50),")
        .append("DELIVERY_REQUEST_DATE DATE,")
        .append("BUYER_EMPNO NVARCHAR(30),")
        .append("PURCHASING_GROUP_CODE NVARCHAR(3),")
        .append("ESTIMATED_PRICE DECIMAL(34),")
        .append("CURRENCY_CODE NVARCHAR(3),")
        .append("PRICE_UNIT NVARCHAR(3),")
        .append("PR_PROGRESS_STATUS_CODE NVARCHAR(30),")
        .append("REMARK NVARCHAR(3000),")
        .append("SLOC_CODE NVARCHAR(3),")
        .append("UPDATE_USER_ID NVARCHAR(255)")
        .append(")"); 

        // String v_sql_truncateTableM = "TRUNCATE TABLE #LOCAL_TEMP_M";   
        // String v_sql_truncateTableD = "TRUNCATE TABLE #LOCAL_TEMP_D";  

        String v_sql_truncateTableM = "DROP TABLE #LOCAL_TEMP_M";   
        String v_sql_truncateTableD = "DROP TABLE #LOCAL_TEMP_D";  

        String v_sql_insertTableM = "INSERT INTO #LOCAL_TEMP_M VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";        
        
        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL OP_PU_PR_CREATE_SAVE_PROC ( ")
        .append("I_TENANT_ID => ?, ")
        .append("I_COMPANY_CODE => ?, ")
        .append("I_PR_NUMBER => ?, ")
        .append("I_M_TABLE => #LOCAL_TEMP_M, ")
        .append("I_D_TABLE => #LOCAL_TEMP_D, ")
        .append("O_RTN_MSG => ? ")
        .append(")"); 


        ResultSet v_rs = null;
        
        // try {
            
            // Commit Option
            jdbc.execute(v_sql_commitOption);
                        
            // Master Local Temp Table 생성
            jdbc.execute(v_sql_createTableM.toString());

            // Detail Local Temp Table 생성
            jdbc.execute(v_sql_createTableD.toString());


            // Header Local Temp Table에 insert
            List<Object[]> batchH = new ArrayList<Object[]>();
            List<Object[]> batchD = new ArrayList<Object[]>();

            Object[] values = null;

            if(!v_inMultiData.isEmpty() && v_inMultiData.size() > 0){
                for(PrCreateSaveType v_indata : v_inMultiData) {
                    log.info("###"+v_indata.getTenantId()+"###"+v_indata.getCompanyCode()+"###"+v_indata.getPrNumber()+"###"+v_indata.getPrCreateStatusCode());

                    values = new Object[] {
                        (String)v_indata.get("tenant_id"),
                        (String)v_indata.get("company_code"),
                        (String)v_indata.get("pr_number"),
                        (String)v_indata.get("pr_type_code"),
                        (String)v_indata.get("pr_type_code_2"),
                        (String)v_indata.get("pr_type_code_3"),
                        (String)v_indata.get("pr_template_number"),
                        (String)v_indata.get("pr_create_system_code"),
                        v_indata.getPrDesc(),
                        v_indata.getRequestorEmpno(),
                        v_indata.getRequestorName(),
                        v_indata.getRequestorDepartmentCode(),
                        v_indata.getRequestorDepartmentName(),
                        v_indata.getPrCreateStatusCode(),
                        v_indata.getPrHeaderText(),
                        v_indata.getApprovalContents(),
                        "A60264"
                    };
                    batchH.add(values);

                    // Detail Local Temp Table에 insert     
                    Collection<SavedDetail> v_inDetails = v_indata.getDetails();               
                    if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){                        
                        for(SavedDetail v_inRow : v_inDetails){
                            log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getPrNumber()+"###"+v_inRow.getPrItemNumber());
                            values = new Object[] {
                                v_inRow.getTenantId(),
                                v_inRow.getCompanyCode(),
                                v_inRow.getPrNumber(),
                                v_inRow.getPrItemNumber(),
                                v_inRow.getOrgTypeCode(),
                                v_inRow.getOrgCode(),
                                v_inRow.getMaterialCode(),
                                v_inRow.getMaterialGroupCode(),
                                v_inRow.getPrDesc(),
                                v_inRow.getPrQuantity(),
                                v_inRow.getPrUnit(),
                                v_inRow.getRequestorEmpno(),
                                v_inRow.getRequestorName(),
                                //(v_inRow.getDeliveryRequestDate()).substring(0, 10) ),
                                v_inRow.getDeliveryRequestDate(),
                                v_inRow.getBuyerEmpno(),
                                v_inRow.getPurchasingGroupCode(),
                                v_inRow.getEstimatedPrice(),
                                v_inRow.getCurrencyCode(),
                                v_inRow.getPriceUnit(),
                                v_inRow.getPrProgressStatusCode(),
                                v_inRow.getRemark(),
                                v_inRow.getSlocCode(),
                                "A60264"
                            };
                            batchD.add(values);
                        }
                    }  

                    log.info("###"+v_indata.getTenantId()+"###"+v_indata.getCompanyCode()+"###"+v_indata.getPrNumber());
                    
                    int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTableM, batchH); 
                    int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);


                    // Procedure Call
                    List<SqlParameter> paramList = new ArrayList<SqlParameter>();
                    paramList.add(new SqlParameter("I_TENANT_ID", Types.VARCHAR));
                    paramList.add(new SqlParameter("I_COMPANY_CODE", Types.VARCHAR));
                    paramList.add(new SqlParameter("I_PR_NUMBER", Types.VARCHAR));

                    SqlReturnResultSet oTable = new SqlReturnResultSet("O_MSG", new RowMapper<OutType>(){
                        @Override
                        public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                            log.info("##### return_code: "+v_rs.getString("return_code")+" ### return_msg: "+v_rs.getString("return_msg"));
                            OutType v_row = OutType.create();
                            v_row.setReturnCode(v_rs.getString("return_code"));
                            v_row.setReturnMsg(v_rs.getString("return_msg"));
                            v_result.add(v_row);
                            return v_row;
                        }
                    });
                    paramList.add(oTable);

                    Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                        @Override
                        public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                            CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                            callableStatement.setString("I_TENANT_ID", v_indata.getTenantId());
                            callableStatement.setString("I_COMPANY_CODE", v_indata.getCompanyCode());
                            callableStatement.setString("I_PR_NUMBER", v_indata.getPrNumber());
                            return callableStatement;
                        }
                    }, paramList);
                }
            }

            // Local Temp Table DROP
            jdbc.execute(v_sql_truncateTableM);
            jdbc.execute(v_sql_truncateTableD);

            context.setResult(v_result);
            context.setCompleted();

            log.info("##### onSavePrCreateProc END");

		// } catch (SQLException sqle) { 
        //     sqle.printStackTrace();
		// 	log.error("##### ErrCode : "+sqle.getErrorCode());
		//     log.error("##### ErrMesg : "+sqle.getMessage());
                        
        //     OutType v_out = OutType.create();
        //     v_out.setReturnCode(sqle.getErrorCode()+"");
        //     v_out.setReturnMsg(sqle.getMessage());                
        //     v_result.add(v_out);
        //     context.setResult(v_result);
        //     context.setCompleted();
        // } catch(Exception ex) {
        //     ex.printStackTrace();
        // }
    }

}