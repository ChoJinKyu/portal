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
import org.springframework.transaction.annotation.Transactional;

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
import cds.gen.dp.projectmgtv4service.TcProcOutType;

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

    /**
     * Mcst Project Update
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event=TcUpdateMcstProjectProcContext.CDS_NAME)
    public void onTcUpdateMcstProjectProc(TcUpdateMcstProjectProcContext context) {

        log.info("### TcUpdateMcstProjectProcContext 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        String v_sql_dropable_similar = "DROP TABLE #LOCAL_TEMP_SIMILAR_MODEL";

        StringBuffer v_sql_createTableSimilarModel = new StringBuffer();
        v_sql_createTableSimilarModel.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SIMILAR_MODEL (");
        v_sql_createTableSimilarModel.append("SIMILAR_MODEL_CODE NVARCHAR(40),");
        v_sql_createTableSimilarModel.append("CODE_DESC NVARCHAR(300),");
        v_sql_createTableSimilarModel.append("DIRECT_REGISTER_FLAG BOOLEAN)");
 
        String v_sql_insertTableSimilarModel = "INSERT INTO #LOCAL_TEMP_SIMILAR_MODEL VALUES (?, ?, ?)";

        //project 기본정보는 프로시저 직접 호출.
        StringBuffer v_sql_callProcProject = new StringBuffer();
        v_sql_callProcProject.append("CALL DP_TC_UPDATE_MCST_PROJECT_PROC(");        
        v_sql_callProcProject.append("I_TENANT_ID => ?,");
        v_sql_callProcProject.append("I_PROJECT_CODE => ?,");
        v_sql_callProcProject.append("I_MODEL_CODE => ?,");        
        v_sql_callProcProject.append("I_VERSION_NUMBER => ?, ");
        v_sql_callProcProject.append("I_MCST_CODE => ?,");
        v_sql_callProcProject.append("I_PROJECT_NAME => ?,");
        v_sql_callProcProject.append("I_MODEL_NAME => ?,");
        v_sql_callProcProject.append("I_PRODUCT_GROUP_CODE => ?,");
        v_sql_callProcProject.append("I_SOURCE_TYPE_CODE => ?,");
        v_sql_callProcProject.append("I_QUOTATION_PROJECT_CODE => ?,");
        v_sql_callProcProject.append("I_PROJECT_STATUS_CODE => ?,");
        v_sql_callProcProject.append("I_PROJECT_GRADE_CODE => ?,");
        v_sql_callProcProject.append("I_DEVELOPE_EVENT_CODE => ?,");
        v_sql_callProcProject.append("I_PRODUCTION_COMPANY_CODE => ?,");
        v_sql_callProcProject.append("I_PROJECT_LEADER_EMPNO => ?,");
        v_sql_callProcProject.append("I_BUYER_EMPNO => ?,");
        v_sql_callProcProject.append("I_MARKETING_PERSON_EMPNO => ?,");
        v_sql_callProcProject.append("I_PLANNING_PERSON_EMPNO => ?,");
        v_sql_callProcProject.append("I_CUSTOMER_LOCAL_NAME => ?,");
        v_sql_callProcProject.append("I_LAST_CUSTOMER_NAME => ?,");
        v_sql_callProcProject.append("I_CUSTOMER_MODEL_DESC => ?,");
        v_sql_callProcProject.append("I_MCST_YIELD_RATE => ?,");
        v_sql_callProcProject.append("I_BOM_TYPE_CODE => ?,");
        v_sql_callProcProject.append("I_PROJECT_CREATE_DATE => ?,");
        v_sql_callProcProject.append("I_USER_ID => ?,");
        v_sql_callProcProject.append("O_RETURN_CODE => ?,");
        v_sql_callProcProject.append("O_RETURN_MSG => ?)");  

        //additional 정보는 프로시저 직접 호출.
        StringBuffer v_sql_callProcAdd = new StringBuffer();
        v_sql_callProcAdd.append("CALL DP_TC_UPDATE_MCST_ADD_INFO_PROC(");        
        v_sql_callProcAdd.append("I_TENANT_ID => ?,"); 
        v_sql_callProcAdd.append("I_PROJECT_CODE => ?,");        
        v_sql_callProcAdd.append("I_MODEL_CODE => ?, ");
        v_sql_callProcAdd.append("I_VERSION_NUMBER => ?,");
        v_sql_callProcAdd.append("I_ADDITION_TYPE_CODE => ?,"); 
        v_sql_callProcAdd.append("I_PERIOD_CODE => ?,"); 
        v_sql_callProcAdd.append("I_ADDITION_TYPE_VALUE => ?,"); 
        v_sql_callProcAdd.append("I_USER_ID => ?,");
        v_sql_callProcAdd.append("O_RETURN_CODE => ?,");
        v_sql_callProcAdd.append("O_RETURN_MSG => ?)");

        //baseExtrate 정보는 프로시저 직접 호출.
        StringBuffer v_sql_callProcBaseExt = new StringBuffer();
        v_sql_callProcBaseExt.append("CALL DP_TC_UPDATE_MCST_BASE_EXRATE_PROC(");        
        v_sql_callProcBaseExt.append("I_TENANT_ID => ?,"); 
        v_sql_callProcBaseExt.append("I_PROJECT_CODE => ?,");        
        v_sql_callProcBaseExt.append("I_MODEL_CODE => ?, ");
        v_sql_callProcBaseExt.append("I_VERSION_NUMBER => ?,");
        v_sql_callProcBaseExt.append("I_CURRENCY_CODE => ?,"); 
        v_sql_callProcBaseExt.append("I_PERIOD_CODE => ?,"); 
        v_sql_callProcBaseExt.append("I_EXRATE => ?,"); 
        v_sql_callProcBaseExt.append("I_USER_ID => ?,");
        v_sql_callProcBaseExt.append("O_RETURN_CODE => ?,");
        v_sql_callProcBaseExt.append("O_RETURN_MSG => ?)");   
        
        //similar model 정보는 TEMP Table 사용하여 프로시저 호출.
        StringBuffer v_sql_callProcSimilar = new StringBuffer();
        v_sql_callProcSimilar.append("CALL DP_TC_UPDATE_MCST_SIMILAR_MODEL_PROC(");        
        v_sql_callProcSimilar.append("I_TENANT_ID => ?,"); 
        v_sql_callProcSimilar.append("I_PROJECT_CODE => ?,");        
        v_sql_callProcSimilar.append("I_MODEL_CODE => ?, ");
        v_sql_callProcSimilar.append("I_VERSION_NUMBER => ?,");
        v_sql_callProcSimilar.append("I_TABLE => #LOCAL_TEMP_SIMILAR_MODEL,");   
        v_sql_callProcSimilar.append("I_USER_ID => ?,");
        v_sql_callProcSimilar.append("O_RETURN_CODE => ?,");
        v_sql_callProcSimilar.append("O_RETURN_MSG => ?)");   

        Collection<TcProjectType> v_inPrj = context.getInputData().getTcPjt();
        Collection<UpdateSimilarModelInputDataType> v_inSimilarModel = context.getInputData().getTcPjtSimilarModel();
        Collection<TcProjectAdditionInfoType> v_inAddInfo = context.getInputData().getTcPjtAddInfo();
        Collection<TcProjectBaseExrateType> v_inBaseExtract = context.getInputData().getTcPjtBaseExrate();

        OutputData v_result = OutputData.create();

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        ResultSet v_rs = null;

        if(!v_inPrj.isEmpty() && v_inPrj.size() > 0){
            log.info("-----> v_inPrj");

            
            SqlReturnResultSet oDTable = new SqlReturnResultSet("O_TABLE_MESSAGE", new RowMapper<OutputData>(){
                @Override
                public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    v_result.setReturnCode(v_rs.getString("returncode"));
                    v_result.setReturnMsg("v_inPrj :: "+v_rs.getString("returnmessage"));
                    return v_result;
                }
            });
            List<SqlParameter> paramList = new ArrayList<SqlParameter>();

            paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MODEL_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_VERSION_NUMBER", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MCST_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_NAME", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MODEL_NAME", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PRODUCT_GROUP_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_SOURCE_TYPE_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_QUOTATION_PROJECT_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_STATUS_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_GRADE_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_DEVELOPE_EVENT_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PRODUCTION_COMPANY_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_LEADER_EMPNO", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_BUYER_EMPNO", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MARKETING_PERSON_EMPNO", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PLANNING_PERSON_EMPNO", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_CUSTOMER_LOCAL_NAME", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_LAST_CUSTOMER_NAME", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_CUSTOMER_MODEL_DESC", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MCST_YIELD_RATE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_BOM_TYPE_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_CREATE_DATE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));

            paramList.add(oDTable);

            for(TcProjectType v_inRow : v_inPrj){

                Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                    @Override
                    public CallableStatement createCallableStatement(Connection con) throws SQLException {
                        CallableStatement stmt = con.prepareCall(v_sql_callProcProject.toString());
                        stmt.setObject(1, v_inRow.get("tenant_id"));
                        stmt.setObject(2, v_inRow.get("project_code"));
                        stmt.setObject(3, v_inRow.get("model_code"));
                        stmt.setObject(4, v_inRow.get("version_number"));
                        stmt.setObject(5, v_inRow.get("mcst_code"));
                        stmt.setObject(6, v_inRow.get("project_name"));
                        stmt.setObject(7, v_inRow.get("model_name"));
                        stmt.setObject(8, v_inRow.get("product_group_code"));
                        stmt.setObject(9, v_inRow.get("source_type_code"));
                        stmt.setObject(10, v_inRow.get("quotation_project_code"));
                        stmt.setObject(11, v_inRow.get("project_status_code"));
                        stmt.setObject(12, v_inRow.get("project_grade_code"));
                        stmt.setObject(13, v_inRow.get("develope_event_code"));
                        stmt.setObject(14, v_inRow.get("production_company_code"));
                        stmt.setObject(15, v_inRow.get("project_leader_empno"));
                        stmt.setObject(16, v_inRow.get("buyer_empno"));
                        stmt.setObject(17, v_inRow.get("marketing_person_empno"));
                        stmt.setObject(18, v_inRow.get("planning_person_empno"));
                        stmt.setObject(19, v_inRow.get("customer_local_name"));
                        stmt.setObject(20, v_inRow.get("last_customer_name"));
                        stmt.setObject(21, v_inRow.get("customer_model_desc"));
                        stmt.setObject(22, v_inRow.get("mcst_yield_rate"));
                        stmt.setObject(23, v_inRow.get("bom_type_code"));
                        stmt.setObject(24, v_inRow.get("project_create_date"));
                        stmt.setObject(25, v_inRow.get("user_id"));
                        return stmt;
                    }
                }, paramList);
            }
        }


        if(!v_inAddInfo.isEmpty() && v_inAddInfo.size() > 0){
            log.info("-----> v_inAddInfo");

            SqlReturnResultSet oDTable = new SqlReturnResultSet("O_TABLE_MESSAGE", new RowMapper<OutputData>(){
                @Override
                public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    v_result.setReturnCode(v_rs.getString("returncode"));
                    v_result.setReturnMsg(v_rs.getString("v_inAddInfo :: "+"returnmessage"));
                    return v_result;
                }
            });
            List<SqlParameter> paramList = new ArrayList<SqlParameter>();

            paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MODEL_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_VERSION_NUMBER", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_ADDITION_TYPE_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PERIOD_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_ADDITION_TYPE_VALUE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
            //paramList.add(oDTable);

            for(TcProjectAdditionInfoType v_inRowAdd : v_inAddInfo){

                Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                    @Override
                    public CallableStatement createCallableStatement(Connection con) throws SQLException {
                        CallableStatement stmt = con.prepareCall(v_sql_callProcProject.toString());
                        stmt.setObject(1, v_inRowAdd.get("tenant_id"));
                        stmt.setObject(2, v_inRowAdd.get("project_code"));
                        stmt.setObject(3, v_inRowAdd.get("model_code"));
                        stmt.setObject(4, v_inRowAdd.get("version_number"));
                        stmt.setObject(5, v_inRowAdd.get("addition_type_code"));
                        stmt.setObject(6, v_inRowAdd.get("period_code"));
                        stmt.setObject(7, v_inRowAdd.get("addition_type_value"));
                        stmt.setObject(8, v_inRowAdd.get("user_id"));
                        return stmt;
                    }
                }, paramList);

            }
        }

        if(!v_inBaseExtract.isEmpty() && v_inBaseExtract.size() > 0){
            log.info("-----> v_inBaseExtract");

            SqlReturnResultSet oDTable = new SqlReturnResultSet("O_TABLE_MESSAGE", new RowMapper<OutputData>(){
                @Override
                public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    v_result.setReturnCode(v_rs.getString("returncode"));
                    v_result.setReturnMsg(v_rs.getString("v_inBaseExtract :: "+"returnmessage"));
                    return v_result;
                }
            });
            List<SqlParameter> paramList = new ArrayList<SqlParameter>();

            paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PROJECT_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_MODEL_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_VERSION_NUMBER", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_CURRENCY_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_PERIOD_CODE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_EXRATE", Types.NVARCHAR));
            paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
            //paramList.add(oDTable);

            for(TcProjectAdditionInfoType v_inRowBase : v_inAddInfo){

                Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                    @Override
                    public CallableStatement createCallableStatement(Connection con) throws SQLException {
                        CallableStatement stmt = con.prepareCall(v_sql_callProcProject.toString());
                        stmt.setObject(1, v_inRowBase.get("tenant_id"));
                        stmt.setObject(2, v_inRowBase.get("project_code"));
                        stmt.setObject(3, v_inRowBase.get("model_code"));
                        stmt.setObject(4, v_inRowBase.get("version_number"));
                        stmt.setObject(5, v_inRowBase.get("currency_code"));
                        stmt.setObject(6, v_inRowBase.get("period_code"));
                        stmt.setObject(7, v_inRowBase.get("exrate"));
                        stmt.setObject(8, v_inRowBase.get("user_id"));
                        return stmt;
                    }
                }, paramList);

            }
        }

        // SimilarModel Local Temp Table 생성해서 프로시저 호출
        if(!v_inSimilarModel.isEmpty() && v_inSimilarModel.size() > 0){

            jdbc.execute(v_sql_createTableSimilarModel.toString());

            // SimilarModel Local Temp Table에 insert
            List<Object[]> batch_similarmodel = new ArrayList<Object[]>();

            //if(!v_inSimilarModel.isEmpty() && v_inSimilarModel.size() > 0){
            log.info("-----> v_inSimilarModel : " + v_inSimilarModel.size());

                for(UpdateSimilarModelInputDataType v_inRow : v_inSimilarModel){

                    Collection<UpdateSimilarModelInputData> similarModelList = v_inRow.getSimilarModel();

                    for(UpdateSimilarModelInputData v_inSimModel : similarModelList) {
                        Object[] values = new Object[] {
                            v_inRow.get("similar_model_code"),
                            v_inRow.get("code_desc"),
                            v_inRow.get("direct_register_flag")
                        };
                        batch_similarmodel.add(values);
                    }

                }

                int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableSimilarModel, batch_similarmodel);
                log.info("batch_similarmodel : " + updateCounts);
            //}            

            for(UpdateSimilarModelInputDataType v_inRowSim : v_inSimilarModel){

                SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputData>(){
                    @Override
                    public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                        v_result.setReturnCode(v_rs.getString("return_code"));
                        v_result.setReturnMsg(v_rs.getString("v_inSimilarModel :: " + "return_msg"));
                        return v_result;
                    }
                });

                List<SqlParameter> paramList = new ArrayList<SqlParameter>();
                paramList.add(oTable);

                Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                    @Override
                    public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                        CallableStatement callableStatement = connection.prepareCall(v_sql_callProcSimilar.toString());
                        callableStatement.setString("I_TENANT_ID", v_inRowSim.getTenantId());
                        callableStatement.setString("I_PROJECT_CODE", v_inRowSim.getProjectCode());
                        callableStatement.setString("I_MODEL_CODE", v_inRowSim.getModelCode());
                        callableStatement.setString("I_VERSION_NUMBER", v_inRowSim.getVersionNumber());
                        callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                        return callableStatement;
                    }
                }, paramList);

            }
            // Local Temp Table DROP
            jdbc.execute(v_sql_dropable_similar);

        }

        context.setResult(v_result);
        context.setCompleted();
 
    }
}