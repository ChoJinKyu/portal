package lg.sppCap.handlers.sp.se;

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


import cds.gen.sp.supevalsetupv4service.SupEvalSetupV4Service_;
import cds.gen.sp.supevalsetupv4service.OperationUnitMst;
import cds.gen.sp.supevalsetupv4service.Mangers;
import cds.gen.sp.supevalsetupv4service.VpOperationUnit;
import cds.gen.sp.supevalsetupv4service.Quantitative;

import cds.gen.sp.supevalsetupv4service.SaveEvaluationSetup1ProcContext;
import cds.gen.sp.supevalsetupv4service.SaveEvaluationSetup2ProcContext;

import cds.gen.sp.supevalsetupv4service.RtnMsg;



@Component
@ServiceName(SupEvalSetupV4Service_.CDS_NAME)
public class SupEvalSetupV4Service implements EventHandler { // import cds.gen.sp.supevalsetupv4service.SupEvalSetupV4Service_;
           
    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;   

    // Procedure 호출해서 저장
    /*********************************
    {
        
    }
    *********************************/

    // @Transactional(rollbackFor = SQLException.class)
    // @On(event=SaveEvaluationSetup2ProcContext.CDS_NAME)
    // public void onSaveEvaluationSetup2Proc(SaveEvaluationSetup2ProcContext context) {   
             
    //     log.info("### onCreateEvalItemSaveProc 1건 처리 [On] ###");

    //     // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
    //     String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

    //     StringBuffer v_sql_callProc = new StringBuffer();
    //     v_sql_callProc.append("CALL SP_SE_CREATE_EVAL_ITEM_SAVE_PROC(");        
    //         v_sql_callProc.append("I_TENANT_ID => ?,");        
    //         v_sql_callProc.append("I_COMPANY_CODE => ?,");       
    //         v_sql_callProc.append("I_ORG_TYPE_CODE => ?,");       
    //         v_sql_callProc.append("I_ORG_CODE => ?,");       
    //         v_sql_callProc.append("I_EVALUATION_OPERATION_UNIT_CODE => ?,");       
    //         v_sql_callProc.append("I_EVALUATION_TYPE_CODE => ?,");       
    //         v_sql_callProc.append("I_PARENT_EVALUATION_ARTICLE_CODE => ?,");       
    //         v_sql_callProc.append("I_EVALUATION_ARTICLE_NAME => ?,");       
    //         v_sql_callProc.append("I_EVALUATION_ARTICLE_LVL_ATTR_CD => ?,");       
    //         v_sql_callProc.append("I_USER_ID => ?,");        
    //         v_sql_callProc.append("O_MSG => ?)");   

    //     log.info("### DB Connect Start ###");

    //     Collection<RtnMsg> v_result = new ArrayList<>();
        		            
    //     log.info("### Proc Start ###");            

    //     // Commit Option
    //     jdbc.execute(v_sql_commitOption);

    //     // Procedure Call
    //     List<SqlParameter> paramList = new ArrayList<SqlParameter>();
    //     paramList.add(new SqlParameter("I_TENANT_ID", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_COMPANY_CODE", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_ORG_TYPE_CODE", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_ORG_CODE", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_EVALUATION_OPERATION_UNIT_CODE", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_EVALUATION_TYPE_CODE", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_PARENT_EVALUATION_ARTICLE_CODE", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_EVALUATION_ARTICLE_NAME", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_EVALUATION_ARTICLE_LVL_ATTR_CD", Types.VARCHAR));
    //     paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));
        
    //     SqlReturnResultSet oReturn = new SqlReturnResultSet("O_MSG", new RowMapper<RtnMsg>(){
    //         @Override
    //         public RtnMsg mapRow(ResultSet v_rs, int rowNum) throws SQLException {
    //             RtnMsg v_row = RtnMsg.create();
    //             v_row.setReturnCode(v_rs.getString("return_code"));
    //             v_row.setReturnMsg(v_rs.getString("return_msg"));
    //             log.info(v_rs.getString("return_code"));
    //             log.info(v_rs.getString("return_msg"));  
    //             if("NG".equals(v_rs.getString("return_code"))){
    //                 log.info("### Call Proc Error!!  ###");
    //                 throw new ServiceException(ErrorStatuses.BAD_REQUEST, v_rs.getString("return_msg"));
    //             }              
    //             v_result.add(v_row);
    //             return v_row;
    //         }
    //     });
    //     paramList.add(oReturn);       

    //     jdbc.call(new CallableStatementCreator() {
    //         @Override
    //         public CallableStatement createCallableStatement(Connection connection) throws SQLException {
    //             CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
    //             callableStatement.setString("I_TENANT_ID", context.getTenantId());
    //             callableStatement.setString("I_COMPANY_CODE", context.getCompanyCode());
    //             callableStatement.setString("I_ORG_TYPE_CODE", context.getOrgTypeCode());
    //             callableStatement.setString("I_ORG_CODE", context.getOrgCode());
    //             callableStatement.setString("I_EVALUATION_OPERATION_UNIT_CODE", context.getEvaluationOperationUnitCode());
    //             callableStatement.setString("I_EVALUATION_TYPE_CODE", context.getEvaluationTypeCode());
    //             callableStatement.setString("I_PARENT_EVALUATION_ARTICLE_CODE", context.getParentEvaluationArticleCode());
    //             callableStatement.setString("I_EVALUATION_ARTICLE_NAME", context.getEvaluationArticleName());
    //             callableStatement.setString("I_EVALUATION_ARTICLE_LVL_ATTR_CD", context.getEvaluationArticleLvlAttrCd());
    //             callableStatement.setString("I_USER_ID", context.getUserId());
    //             return callableStatement;
    //         }
    //     }, paramList);

    //     log.info("### callProc Success ###");

    //     context.setResult(v_result);
    //     context.setCompleted();  
    // }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=SaveEvaluationSetup1ProcContext.CDS_NAME)
    public void onSaveEvaluationSetup1Proc(SaveEvaluationSetup1ProcContext context) { //import cds.gen.sp.supevalsetupv4service.SaveEvaluationSetup2ProcContext;

        log.info("### onSaveEvaluationSetup1Proc 1건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableOPMST = new StringBuffer();
        v_sql_createTableOPMST.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_OPMST (");
        v_sql_createTableOPMST.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableOPMST.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableOPMST.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableOPMST.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableOPMST.append("EVALUATION_OPERATION_UNIT_CODE NVARCHAR(30),");
        v_sql_createTableOPMST.append("EVALUATION_OPERATION_UNIT_NAME NVARCHAR(50),");
        v_sql_createTableOPMST.append("DISTRB_SCORE_ENG_FLAG BOOLEAN,");
        v_sql_createTableOPMST.append("EVALUATION_REQUEST_MODE_CODE NVARCHAR(30),");
        v_sql_createTableOPMST.append("EVALUATION_REQUEST_APPROVAL_FLAG BOOLEAN,");
        v_sql_createTableOPMST.append("OPERATION_PLAN_FLAG BOOLEAN,");
        v_sql_createTableOPMST.append("EVAL_APPLY_VENDOR_POOL_LVL_NO DECIMAL(34),");
        v_sql_createTableOPMST.append("USE_FLAG BOOLEAN)");
        
        String v_sql_dropTableOPMST = "DROP TABLE #LOCAL_TEMP_OPMST";    

        StringBuffer v_sql_createTableVPOP = new StringBuffer();
        v_sql_createTableVPOP.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_VPOP (");
        v_sql_createTableVPOP.append("VENDOR_POOL_OPERATION_UNIT_CODE NVARCHAR(30))");

        String v_sql_dropTableVPOP = "DROP TABLE #LOCAL_TEMP_VPOP"; 


        StringBuffer v_sql_createTableMGR = new StringBuffer();
        v_sql_createTableMGR.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MGR (");        
        v_sql_createTableMGR.append("TRANSACTION_CODE NVARCHAR(1),");
        v_sql_createTableMGR.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableMGR.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableMGR.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableMGR.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableMGR.append("EVALUATION_OPERATION_UNIT_CODE NVARCHAR(30),");
        v_sql_createTableMGR.append("EVALUATION_OP_UNT_PERSON_EMPNO NVARCHAR(30),");
        v_sql_createTableMGR.append("EVALUATION_EXECUTE_ROLE_CODE NVARCHAR(30))");

        String v_sql_dropTableMGR = "DROP TABLE #LOCAL_TEMP_MGR";    


        StringBuffer v_sql_createTableQTT = new StringBuffer();

        v_sql_createTableQTT.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_QTT (");     
        v_sql_createTableQTT.append("TRANSACTION_CODE NVARCHAR(1),");
        v_sql_createTableQTT.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableQTT.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableQTT.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableQTT.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableQTT.append("EVALUATION_OPERATION_UNIT_CODE NVARCHAR(30),");
        v_sql_createTableQTT.append("QTTIVE_ITEM_CODE NVARCHAR(15),");
        v_sql_createTableQTT.append("QTTIVE_ITEM_NAME NVARCHAR(240),");
        v_sql_createTableQTT.append("QTTIVE_ITEM_UOM_CODE NVARCHAR(30),");
        v_sql_createTableQTT.append("QTTIVE_ITEM_MEASURE_MODE_CODE NVARCHAR(50),");
        v_sql_createTableQTT.append("QTTIVE_ITEM_DESC NVARCHAR(1000),");
        v_sql_createTableQTT.append("SORT_SEQUENCE DECIMAL)");

        String v_sql_dropTableQTT = "DROP TABLE #LOCAL_TEMP_QTT";    



        String v_sql_insertTableOPMST = "INSERT INTO #LOCAL_TEMP_OPMST VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableVPOP = "INSERT INTO #LOCAL_TEMP_VPOP VALUES (?)";
        String v_sql_insertTableMGR = "INSERT INTO #LOCAL_TEMP_MGR VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableQTT = "INSERT INTO #LOCAL_TEMP_QTT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";



        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SE_EVAL_SETUP_SAVE1_PROC(");        
            v_sql_callProc.append("I_OPMST => #LOCAL_TEMP_OPMST,");        
            v_sql_callProc.append("I_VPOP => #LOCAL_TEMP_VPOP,");        
            v_sql_callProc.append("I_MGR => #LOCAL_TEMP_MGR,");  
            v_sql_callProc.append("I_QTT => #LOCAL_TEMP_QTT,");  

            v_sql_callProc.append("I_USER_ID => ?,");        
            v_sql_callProc.append("O_MSG => ?)");   

        log.info("### DB Connect Start ###");

        Collection<OperationUnitMst> v_inOPMST = context.getOperationUnitMst();
        Collection<VpOperationUnit> v_inVOP = context.getVpOperationUnit();
        Collection<Mangers> v_inMGR = context.getMangers();
        Collection<Quantitative> v_inQTT = context.getQuantitative();

        Collection<RtnMsg> v_result = new ArrayList<>();
        		            
        log.info("### Proc Start ###");            

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Item Local Temp Table 생성            
        jdbc.execute(v_sql_createTableOPMST.toString());

        // Vendor Pool Item Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inOPMST.isEmpty() && v_inOPMST.size() > 0){
            for(OperationUnitMst v_inRow : v_inOPMST){
                Object[] values = new Object[] {    
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("evaluation_operation_unit_code"),
                    v_inRow.get("evaluation_operation_unit_name"),
                    v_inRow.get("distrb_score_eng_flag"),
                    v_inRow.get("evaluation_request_mode_code"),
                    v_inRow.get("evaluation_request_approval_flag"),
                    v_inRow.get("operation_plan_flag"),
                    v_inRow.get("eval_apply_vendor_pool_lvl_no"),
                    v_inRow.get("use_flag")
                };
                    
                batchMst.add(values);
            }
        }

        int[] updateCountsMst = jdbc.batchUpdate(v_sql_insertTableOPMST, batchMst);  
        log.info("### insert v_inOPMST Success ###");      
        

        // Vendor Pool Item Local Temp Table 생성           
        jdbc.execute(v_sql_createTableVPOP.toString());

        // Vendor Pool Item Local Temp Table에 insert                        
        List<Object[]> batchVPOP = new ArrayList<Object[]>();
        if(!v_inVOP.isEmpty() && v_inVOP.size() > 0){
            for(VpOperationUnit v_inRow : v_inVOP){
                Object[] values = new Object[] {    
                    v_inRow.get("vendor_pool_operation_unit_code")
                };      

                batchVPOP.add(values);
            }
        }

        int[] updateCountsVPOP = jdbc.batchUpdate(v_sql_insertTableVPOP, batchVPOP);  

        log.info("### insert VPOP Success ###");

        // Vendor Pool Item Local Temp Table 생성           
        jdbc.execute(v_sql_createTableMGR.toString());

        // Vendor Pool Item Local Temp Table에 insert                        
        List<Object[]> batchMGR = new ArrayList<Object[]>();
        if(!v_inMGR.isEmpty() && v_inMGR.size() > 0){
            for(Mangers v_inRow : v_inMGR){
                Object[] values = new Object[] {    
                    v_inRow.get("transaction_code"),
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("evaluation_operation_unit_code"),
                    v_inRow.get("evaluation_op_unt_person_empno"),
                    v_inRow.get("evaluation_execute_role_code")
                };                    
                batchMGR.add(values);
            }
        }

        int[] updateCountsMGR = jdbc.batchUpdate(v_sql_insertTableMGR, batchMGR);                        

        log.info("### insert  MGR Success ###");


        // Vendor Pool Item Local Temp Table 생성           
        jdbc.execute(v_sql_createTableQTT.toString());

        // Vendor Pool Item Local Temp Table에 insert                        
        List<Object[]> batchQTT = new ArrayList<Object[]>();
        if(!v_inQTT.isEmpty() && v_inQTT.size() > 0){
            for(Quantitative v_inRow : v_inQTT){
                Object[] values = new Object[] {    
                    v_inRow.get("transaction_code"),
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("evaluation_operation_unit_code"),
                    v_inRow.get("qttive_item_code"),
                    v_inRow.get("qttive_item_name"),
                    v_inRow.get("qttive_item_uom_code"),
                    v_inRow.get("qttive_item_measure_mode_code"),
                    v_inRow.get("qttive_item_desc"),
                    v_inRow.get("sort_sequence")
                };                    
                batchQTT.add(values);
            }
        }


        int[] updateCountsQTT = jdbc.batchUpdate(v_sql_insertTableQTT, batchQTT);                        

        log.info("### insertQTT Success ###");

        //여기끼지 4 set 



        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));
        
        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_MSG", new RowMapper<RtnMsg>(){
            @Override
            public RtnMsg mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                RtnMsg v_row = RtnMsg.create();
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
                log.info(v_rs.getString("return_code"));
                log.info(v_rs.getString("return_msg"));  
                if("NG".equals(v_rs.getString("return_code"))){
                    log.info("### Call Proc Error!!  ###");
                    throw new ServiceException(ErrorStatuses.BAD_REQUEST, v_rs.getString("return_msg"));
                }              
                v_result.add(v_row);
                return v_row;
            }
        });
        paramList.add(oReturn);       

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("I_USER_ID", context.getUserId());
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableOPMST);
        jdbc.execute(v_sql_dropTableVPOP);        
        jdbc.execute(v_sql_dropTableMGR);        
        jdbc.execute(v_sql_dropTableQTT);


        context.setResult(v_result);
        context.setCompleted();     
        
    }
}