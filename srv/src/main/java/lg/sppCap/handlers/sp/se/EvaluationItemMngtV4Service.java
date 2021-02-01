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

import cds.gen.sp.evaluationitemmngtv4service.CreateEvalItemSaveProcContext;
import cds.gen.sp.evaluationitemmngtv4service.EvalItemSaveProcContext;
import cds.gen.sp.evaluationitemmngtv4service.EvaluationItemMngtV4Service_;
import cds.gen.sp.evaluationitemmngtv4service.ItemType;
import cds.gen.sp.evaluationitemmngtv4service.RtnMsg;
import cds.gen.sp.evaluationitemmngtv4service.ScleType;

@Component
@ServiceName(EvaluationItemMngtV4Service_.CDS_NAME)
public class EvaluationItemMngtV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;   

    // Procedure 호출해서 저장
    /*********************************
    {
        
    }
    *********************************/

    @Transactional(rollbackFor = SQLException.class)
    @On(event=CreateEvalItemSaveProcContext.CDS_NAME)
    public void onCreateEvalItemSaveProc(CreateEvalItemSaveProcContext context) {   
             
        log.info("### onCreateEvalItemSaveProc 1건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SE_CREATE_EVAL_ITEM_SAVE_PROC(");        
            v_sql_callProc.append("I_TENANT_ID => ?,");        
            v_sql_callProc.append("I_COMPANY_CODE => ?,");       
            v_sql_callProc.append("I_ORG_TYPE_CODE => ?,");       
            v_sql_callProc.append("I_ORG_CODE => ?,");       
            v_sql_callProc.append("I_EVALUATION_OPERATION_UNIT_CODE => ?,");       
            v_sql_callProc.append("I_EVALUATION_TYPE_CODE => ?,");       
            v_sql_callProc.append("I_PARENT_EVALUATION_ARTICLE_CODE => ?,");       
            v_sql_callProc.append("I_EVALUATION_ARTICLE_NAME => ?,");       
            v_sql_callProc.append("I_EVALUATION_ARTICLE_LVL_ATTR_CD => ?,");       
            v_sql_callProc.append("I_USER_ID => ?,");        
            v_sql_callProc.append("O_MSG => ?)");   

        log.info("### DB Connect Start ###");

        Collection<RtnMsg> v_result = new ArrayList<>();
        		            
        log.info("### Proc Start ###");            

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_TENANT_ID", Types.VARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_ORG_TYPE_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_ORG_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_EVALUATION_OPERATION_UNIT_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_EVALUATION_TYPE_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_PARENT_EVALUATION_ARTICLE_CODE", Types.VARCHAR));
        paramList.add(new SqlParameter("I_EVALUATION_ARTICLE_NAME", Types.VARCHAR));
        paramList.add(new SqlParameter("I_EVALUATION_ARTICLE_LVL_ATTR_CD", Types.VARCHAR));
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

        jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("I_TENANT_ID", context.getTenantId());
                callableStatement.setString("I_COMPANY_CODE", context.getCompanyCode());
                callableStatement.setString("I_ORG_TYPE_CODE", context.getOrgTypeCode());
                callableStatement.setString("I_ORG_CODE", context.getOrgCode());
                callableStatement.setString("I_EVALUATION_OPERATION_UNIT_CODE", context.getEvaluationOperationUnitCode());
                callableStatement.setString("I_EVALUATION_TYPE_CODE", context.getEvaluationTypeCode());
                callableStatement.setString("I_PARENT_EVALUATION_ARTICLE_CODE", context.getParentEvaluationArticleCode());
                callableStatement.setString("I_EVALUATION_ARTICLE_NAME", context.getEvaluationArticleName());
                callableStatement.setString("I_EVALUATION_ARTICLE_LVL_ATTR_CD", context.getEvaluationArticleLvlAttrCd());
                callableStatement.setString("I_USER_ID", context.getUserId());
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        context.setResult(v_result);
        context.setCompleted();  
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=EvalItemSaveProcContext.CDS_NAME)
    public void onEvalItemSaveProc(EvalItemSaveProcContext context) {

        log.info("### onEvalItemSaveProc 1건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableItem = new StringBuffer();
        v_sql_createTableItem.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_EVALUITEM (");
        v_sql_createTableItem.append("TRANSACTION_CODE NVARCHAR(1),");
        v_sql_createTableItem.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableItem.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableItem.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableItem.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableItem.append("EVALUATION_OPERATION_UNIT_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("EVALUATION_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("EVALUATION_ARTICLE_CODE NVARCHAR(15),");
        v_sql_createTableItem.append("EVALUATION_EXECUTE_MODE_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("EVALUATION_ARTICLE_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("EVALUATION_DISTRB_SCR_TYPE_CD NVARCHAR(30),");
        v_sql_createTableItem.append("EVALUATION_RESULT_INPUT_TYPE_CD NVARCHAR(30),");
        v_sql_createTableItem.append("QTTIVE_ITEM_UOM_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("QTTIVE_EVAL_ARTICLE_CALC_FORMULA NVARCHAR(1000),");
        v_sql_createTableItem.append("EVALUATION_ARTICLE_DESC NVARCHAR(3000),");
        v_sql_createTableItem.append("SORT_SEQUENCE DECIMAL)");         
        
        String v_sql_dropTableItem = "DROP TABLE #LOCAL_TEMP_EVALUITEM";                

        StringBuffer v_sql_createTableSCLE = new StringBuffer();
        v_sql_createTableSCLE.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SCLE (");        
        v_sql_createTableSCLE.append("transaction_code NVARCHAR(1),");
        v_sql_createTableSCLE.append("tenant_id NVARCHAR(5),");
        v_sql_createTableSCLE.append("company_code NVARCHAR(10),");
        v_sql_createTableSCLE.append("org_type_code NVARCHAR(2),");
        v_sql_createTableSCLE.append("org_code NVARCHAR(10),");
        v_sql_createTableSCLE.append("evaluation_operation_unit_code NVARCHAR(30),");
        v_sql_createTableSCLE.append("evaluation_type_code NVARCHAR(30),");
        v_sql_createTableSCLE.append("evaluation_article_code NVARCHAR(15),");
        v_sql_createTableSCLE.append("option_article_number NVARCHAR(10),");
        v_sql_createTableSCLE.append("option_article_name NVARCHAR(240),");
        v_sql_createTableSCLE.append("option_article_start_value NVARCHAR(100),");
        v_sql_createTableSCLE.append("option_article_end_value NVARCHAR(100),");
        v_sql_createTableSCLE.append("evaluation_score DECIMAL,");
        v_sql_createTableSCLE.append("sort_sequence DECIMAL)"); 

        String v_sql_dropTableScle = "DROP TABLE #LOCAL_TEMP_SCLE";                      

        String v_sql_insertTableItem = "INSERT INTO #LOCAL_TEMP_EVALUITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableScle = "INSERT INTO #LOCAL_TEMP_SCLE VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_SE_EVAL_ITEM_SAVE_PROC(");        
            v_sql_callProc.append("I_ITEM_TYPE => #LOCAL_TEMP_EVALUITEM,");        
            v_sql_callProc.append("I_SCLE_TYPE => #LOCAL_TEMP_SCLE,");        
            v_sql_callProc.append("I_USER_ID => ?,");        
            v_sql_callProc.append("O_MSG => ?)");   

        log.info("### DB Connect Start ###");

        Collection<ItemType> v_inEvalItem = context.getItemType();
        Collection<ScleType> v_inScle = context.getScleType();

        Collection<RtnMsg> v_result = new ArrayList<>();
        		            
        log.info("### Proc Start ###");            

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Item Local Temp Table 생성            
        jdbc.execute(v_sql_createTableItem.toString());

        // Vendor Pool Item Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inEvalItem.isEmpty() && v_inEvalItem.size() > 0){
            for(ItemType v_inRow : v_inEvalItem){
                Object[] values = new Object[] {    
                     v_inRow.get("transaction_code"),
                     v_inRow.get("tenant_id"),
                     v_inRow.get("company_code"),
                     v_inRow.get("org_type_code"),
                     v_inRow.get("org_code"),
                     v_inRow.get("evaluation_operation_unit_code"),
                     v_inRow.get("evaluation_type_code"),
                     v_inRow.get("evaluation_article_code"),
                     v_inRow.get("evaluation_execute_mode_code"),
                     v_inRow.get("evaluation_article_type_code"),
                     v_inRow.get("evaluation_distrb_scr_type_cd"),
                     v_inRow.get("evaluation_result_input_type_cd"),
                     v_inRow.get("qttive_item_uom_code"),
                     v_inRow.get("qttive_eval_article_calc_formula"),
                     v_inRow.get("evaluation_article_desc"),
                     v_inRow.get("sort_sequence")
                };
                    
                batchMst.add(values);
            }
        }

        int[] updateCountsMst = jdbc.batchUpdate(v_sql_insertTableItem, batchMst);                        

        log.info("### insertEvalItem Success ###");

        // Vendor Pool Supplier Local Temp Table 생성
        jdbc.execute(v_sql_createTableSCLE.toString());

        // Vendor Pool Supplier Local Temp Table에 insert            
        List<Object[]> batchSupp = new ArrayList<Object[]>();
        if(!v_inScle.isEmpty() && v_inScle.size() > 0){
            for(ScleType v_inRow : v_inScle){
                Object[] values = new Object[] {   
                    v_inRow.get("transaction_code"),
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("evaluation_operation_unit_code"),
                    v_inRow.get("evaluation_type_code"),
                    v_inRow.get("evaluation_article_code"),
                    v_inRow.get("option_article_number"),
                    v_inRow.get("option_article_name"),
                    v_inRow.get("option_article_start_value"),
                    v_inRow.get("option_article_end_value"),
                    v_inRow.get("evaluation_score"),
                    v_inRow.get("sort_sequence")
                };
                    
                batchSupp.add(values);
            }
        }

        int[] updateCountsSupp = jdbc.batchUpdate(v_sql_insertTableScle, batchSupp);                          

        log.info("### insertScle Success ###");


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
        jdbc.execute(v_sql_dropTableScle);
        jdbc.execute(v_sql_dropTableItem);

        context.setResult(v_result);
        context.setCompleted();            		
    }
}