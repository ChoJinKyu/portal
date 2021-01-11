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

import cds.gen.dp.projectmgtv4service.*;

@Component
@ServiceName(ProjectMgtV4Service_.CDS_NAME)
public class ProjectMgtServiceV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;   

    // Procedure 호출해서 header/Detail 저장
    // Header, Detail 둘다 multi
    /*********************************
    {
        "inputData" : {
            "savedHeaders" : [
                {"header_id" : 108, "cd": "eeee1122222", "name": "eeee11"} ,
                {"header_id" : 109, "cd": "eeee1222222", "name": "eeee12"} 
            ],
            "savedDetails" : [
                {"detail_id": 1008, "header_id" : 108, "cd": "eeee122221", "name": "eeee11"},
                {"detail_id": 1009, "header_id" : 108, "cd": "eeee122222", "name": "eeee12"},
                {"detail_id": 1010, "header_id" : 109, "cd": "eeee122221", "name": "eeee11"},
                {"detail_id": 1011, "header_id" : 109, "cd": "eeee122222", "name": "eeee12"}
            ]
        }
    }
    *********************************/
    @On(event=TcUpdateProjectProcContext.CDS_NAME)
    public void onTcUpdateProjectProc(TcUpdateProjectProcContext context) {

        log.info("### onTcProjectMgtProc 1건 처리 [On] ###");

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableProject = new StringBuffer();
        v_sql_createTableProject.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PROJECT (");
        v_sql_createTableProject.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableProject.append("PROJECT_CODE NVARCHAR(30),");
        v_sql_createTableProject.append("MODEL_CODE NVARCHAR(40),");
        v_sql_createTableProject.append("PROJECT_NAME NVARCHAR(100),");
        v_sql_createTableProject.append("MODEL_NAME NVARCHAR(100),");
        v_sql_createTableProject.append("PRODUCT_GROUP_CODE NVARCHAR(10),");
        v_sql_createTableProject.append("SOURCE_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableProject.append("QUOTATION_PROJECT_CODE NVARCHAR(50),");
        v_sql_createTableProject.append("PROJECT_STATUS_CODE NVARCHAR(30),");
        v_sql_createTableProject.append("PROJECT_GRADE_CODE NVARCHAR(30),");
        v_sql_createTableProject.append("DEVELOPE_EVENT_CODE NVARCHAR(30),");
        v_sql_createTableProject.append("PRODUCTION_COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableProject.append("PROJECT_LEADER_EMPNO NVARCHAR(30),");
        v_sql_createTableProject.append("BUYER_EMPNO NVARCHAR(30),");
        v_sql_createTableProject.append("MARKETING_PERSON_EMPNO NVARCHAR(30),");
        v_sql_createTableProject.append("PLANNING_PERSON_EMPNO NVARCHAR(30),");
        v_sql_createTableProject.append("CUSTOMER_LOCAL_NAME NVARCHAR(50),");
        v_sql_createTableProject.append("LAST_CUSTOMER_NAME NVARCHAR(240),");
        v_sql_createTableProject.append("CUSTOMER_MODEL_DESC NVARCHAR(1000),");
        v_sql_createTableProject.append("MCST_YIELD_RATE DECIMAL,");
        v_sql_createTableProject.append("BOM_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableProject.append("PROJECT_CREATE_DATE DATE)");

        StringBuffer v_sql_createTableSimilarModel = new StringBuffer();
        v_sql_createTableSimilarModel.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SIMILAR_MODEL (");
        v_sql_createTableSimilarModel.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableSimilarModel.append("PROJECT_CODE NVARCHAR(30),");
        v_sql_createTableSimilarModel.append("MODEL_CODE NVARCHAR(40),");
        v_sql_createTableSimilarModel.append("SIMILAR_MODEL_CODE NVARCHAR(40),");
        v_sql_createTableSimilarModel.append("CODE_DESC NVARCHAR(300),");
        v_sql_createTableSimilarModel.append("DIRECT_REGISTER_FLAG BOOLEAN)");

        StringBuffer v_sql_createTableAdditionalInfo = new StringBuffer();
        v_sql_createTableAdditionalInfo.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_ADDITIONAL_INFO (");
        v_sql_createTableAdditionalInfo.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableAdditionalInfo.append("PROJECT_CODE NVARCHAR(30),");
        v_sql_createTableAdditionalInfo.append("MODEL_CODE NVARCHAR(40),");
        v_sql_createTableAdditionalInfo.append("ADDITION_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableAdditionalInfo.append("PERIOD_CODE NVARCHAR(30),");
        v_sql_createTableAdditionalInfo.append("ADDITION_TYPE_VALUE NVARCHAR(10))");

        StringBuffer v_sql_createTableBaseExrate = new StringBuffer();
        v_sql_createTableBaseExrate.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_BASE_EXRATE (");
        v_sql_createTableBaseExrate.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableBaseExrate.append("PROJECT_CODE NVARCHAR(30),");
        v_sql_createTableBaseExrate.append("MODEL_CODE NVARCHAR(40),");
        v_sql_createTableBaseExrate.append("CURRENCY_CODE NVARCHAR(3),");
        v_sql_createTableBaseExrate.append("PERIOD_CODE NVARCHAR(30),");
        v_sql_createTableBaseExrate.append("EXRATE DECIMAL)");

        String v_sql_insertTableProject = "INSERT INTO #LOCAL_TEMP_PROJECT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableSimilarModel = "INSERT INTO #LOCAL_TEMP_SIMILAR_MODEL VALUES (?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableAdditionalInfo = "INSERT INTO #LOCAL_TEMP_ADDITIONAL_INFO VALUES (?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableBaseExrate = "INSERT INTO #LOCAL_TEMP_BASE_EXRATE VALUES (?, ?, ?, ?, ?, ?)";


        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL DP_TC_UPDATE_PROJECT_PROC(");        
        v_sql_callProc.append("I_PROJECT => #LOCAL_TEMP_PROJECT,");        
        v_sql_callProc.append("I_SIMILAR_MODEL => #LOCAL_TEMP_SIMILAR_MODEL,");        
        v_sql_callProc.append("I_ADD_INFO => #LOCAL_TEMP_ADDITIONAL_INFO, ");        
        v_sql_callProc.append("I_BASE_EXRATE => #LOCAL_TEMP_BASE_EXRATE,");        
        v_sql_callProc.append("I_USER_ID => ?,");        
        v_sql_callProc.append("O_MSG => ?)");                    

        Collection<TcProjectType> v_inPrj = context.getInputData().getTcPjt();
        Collection<TcProjectSimilarModelType> v_inSimilarModel = context.getInputData().getTcPjtSimilarModel();
        Collection<TcProjectAdditionInfoType> v_inAddInfo = context.getInputData().getTcPjtAddInfo();
        Collection<TcProjectBaseExrateType> v_inBaseExtract = context.getInputData().getTcPjtBaseExrate();
        Collection<TcProcOutType> v_result = new ArrayList<>();
        /*
        if(!v_inPrj.isEmpty() && v_inPrj.size() > 0){
            log.info("-----> v_inPrj");
            for(TcProjectType v_inRow : v_inPrj){
                log.info("> tenant_id : " + v_inRow.get("tenant_id"));
                log.info("> project_code : " + v_inRow.get("project_code"));
                log.info("> model_code : " + v_inRow.get("model_code"));
                log.info("> project_name : " + v_inRow.get("project_name"));
                log.info("> model_name : " + v_inRow.get("model_name"));
                log.info("> product_group_code : " + v_inRow.get("product_group_code"));
                log.info("> source_type_code : " + v_inRow.get("source_type_code"));
                log.info("> quotation_project_code : " + v_inRow.get("quotation_project_code"));
                log.info("> project_status_code : " + v_inRow.get("project_status_code"));
                log.info("> project_grade_code : " + v_inRow.get("project_grade_code"));
                log.info("> develope_event_code : " + v_inRow.get("develope_event_code"));
                log.info("> production_company_code : " + v_inRow.get("production_company_code"));
                log.info("> project_leader_empno : " + v_inRow.get("project_leader_empno"));
                log.info("> buyer_empno : " + v_inRow.get("buyer_empno"));
                log.info("> marketing_person_empno : " + v_inRow.get("marketing_person_empno"));
                log.info("> planning_person_empno : " + v_inRow.get("planning_person_empno"));
                log.info("> customer_local_name : " + v_inRow.get("customer_local_name"));
                log.info("> last_customer_name : " + v_inRow.get("last_customer_name"));
                log.info("> customer_model_desc : " + v_inRow.get("customer_model_desc"));
                log.info("> mcst_yield_rate : " + v_inRow.get("mcst_yield_rate"));
                log.info("> bom_type_code : " + v_inRow.get("bom_type_code"));
                log.info("> project_create_date : " + v_inRow.get("project_create_date"));
            }
        }
        
        if(!v_inSimilarModel.isEmpty() && v_inSimilarModel.size() > 0){
            log.info("-----> v_inSimilarModel");
            for(TcProjectSimilarModelType v_inRow : v_inSimilarModel){
                log.info("> tenant_id : " + v_inRow.get("tenant_id"));
                log.info("> project_code : " + v_inRow.get("project_code"));
                log.info("> model_code : " + v_inRow.get("model_code"));
                log.info("> similar_model_code : " + v_inRow.get("similar_model_code"));
                log.info("> code_desc : " + v_inRow.get("code_desc"));
                log.info("> direct_register_flag : " + v_inRow.get("direct_register_flag"));
            }
        }

        if(!v_inAddInfo.isEmpty() && v_inAddInfo.size() > 0){
            log.info("-----> v_inAddInfo");
            for(TcProjectAdditionInfoType v_inRow : v_inAddInfo){
                log.info("> tenant_id : " + v_inRow.get("tenant_id"));
                log.info("> project_code : " + v_inRow.get("project_code"));
                log.info("> model_code : " + v_inRow.get("model_code"));
                log.info("> similar_model_code : " + v_inRow.get("similar_model_code"));
                log.info("> code_desc : " + v_inRow.get("code_desc"));
                log.info("> direct_register_flag : " + v_inRow.get("direct_register_flag"));
            }
        }

        if(!v_inBaseExtract.isEmpty() && v_inBaseExtract.size() > 0){
            log.info("-----> v_inBaseExtract");
            for(TcProjectBaseExrateType v_inRow : v_inBaseExtract){
                log.info("> tenant_id : " + v_inRow.get("tenant_id"));
                log.info("> project_code : " + v_inRow.get("project_code"));
                log.info("> model_code : " + v_inRow.get("model_code"));
                log.info("> currency_code : " + v_inRow.get("currency_code"));
                log.info("> period_code : " + v_inRow.get("period_code"));
                log.info("> exrate : " + v_inRow.get("exrate"));
            }
        }
        */
        ResultSet v_rs = null;
        
		try {            
            Connection conn = jdbc.getDataSource().getConnection();

            // ProjectInfo Local Temp Table 생성
            PreparedStatement v_statement_createProject = conn.prepareStatement(v_sql_createTableProject.toString());
            v_statement_createProject.execute();

            // ProjectInfo Local Temp Table에 insert
            PreparedStatement v_statement_insertProject = conn.prepareStatement(v_sql_insertTableProject);

            if(!v_inPrj.isEmpty() && v_inPrj.size() > 0){
            log.info("-----> v_inPrj : " + v_inPrj.size());
                for(TcProjectType v_inRow : v_inPrj){
                    v_statement_insertProject.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertProject.setObject(2, v_inRow.get("project_code"));
                    v_statement_insertProject.setObject(3, v_inRow.get("model_code"));
                    v_statement_insertProject.setObject(4, v_inRow.get("project_name"));
                    v_statement_insertProject.setObject(5, v_inRow.get("model_name"));
                    v_statement_insertProject.setObject(6, v_inRow.get("product_group_code"));
                    v_statement_insertProject.setObject(7, v_inRow.get("source_type_code"));
                    v_statement_insertProject.setObject(8, v_inRow.get("quotation_project_code"));
                    v_statement_insertProject.setObject(9, v_inRow.get("project_status_code"));
                    v_statement_insertProject.setObject(10, v_inRow.get("project_grade_code"));
                    v_statement_insertProject.setObject(11, v_inRow.get("develope_event_code"));
                    v_statement_insertProject.setObject(12, v_inRow.get("production_company_code"));
                    v_statement_insertProject.setObject(13, v_inRow.get("project_leader_empno"));
                    v_statement_insertProject.setObject(14, v_inRow.get("buyer_empno"));
                    v_statement_insertProject.setObject(15, v_inRow.get("marketing_person_empno"));
                    v_statement_insertProject.setObject(16, v_inRow.get("planning_person_empno"));
                    v_statement_insertProject.setObject(17, v_inRow.get("customer_local_name"));
                    v_statement_insertProject.setObject(18, v_inRow.get("last_customer_name"));
                    v_statement_insertProject.setObject(19, v_inRow.get("customer_model_desc"));
                    v_statement_insertProject.setObject(20, v_inRow.get("mcst_yield_rate"));
                    v_statement_insertProject.setObject(21, v_inRow.get("bom_type_code"));
                    v_statement_insertProject.setObject(22, v_inRow.get("project_create_date"));
                    v_statement_insertProject.addBatch();
                }

                v_statement_insertProject.executeBatch();
            }

            // SimilarModel Local Temp Table 생성
            PreparedStatement v_statement_createSimilarModel = conn.prepareStatement(v_sql_createTableSimilarModel.toString());
            v_statement_createSimilarModel.execute();

            // SimilarModel Local Temp Table에 insert
            PreparedStatement v_statement_insertSimilarModel = conn.prepareStatement(v_sql_insertTableSimilarModel);

            if(!v_inSimilarModel.isEmpty() && v_inSimilarModel.size() > 0){
            log.info("-----> v_inSimilarModel : " + v_inSimilarModel.size());
                for(TcProjectSimilarModelType v_inRow : v_inSimilarModel){
                    v_statement_insertSimilarModel.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertSimilarModel.setObject(2, v_inRow.get("project_code"));
                    v_statement_insertSimilarModel.setObject(3, v_inRow.get("model_code"));
                    v_statement_insertSimilarModel.setObject(4, v_inRow.get("similar_model_code"));
                    v_statement_insertSimilarModel.setObject(5, v_inRow.get("code_desc"));
                    v_statement_insertSimilarModel.setObject(6, v_inRow.get("direct_register_flag"));
                    v_statement_insertSimilarModel.addBatch();
                }

                v_statement_insertSimilarModel.executeBatch();
            }

            // Additional Info Local Temp Table 생성
            PreparedStatement v_statement_createAdditionalInfo = conn.prepareStatement(v_sql_createTableAdditionalInfo.toString());
            v_statement_createAdditionalInfo.execute();

            // Additional Info Local Temp Table에 insert
            PreparedStatement v_statement_insertAdditionalInfo = conn.prepareStatement(v_sql_insertTableAdditionalInfo);

            if(!v_inAddInfo.isEmpty() && v_inAddInfo.size() > 0){
            log.info("-----> v_inAddInfo : " + v_inAddInfo.size());
                for(TcProjectAdditionInfoType v_inRow : v_inAddInfo){
                    v_statement_insertAdditionalInfo.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertAdditionalInfo.setObject(2, v_inRow.get("project_code"));
                    v_statement_insertAdditionalInfo.setObject(3, v_inRow.get("model_code"));
                    v_statement_insertAdditionalInfo.setObject(4, v_inRow.get("addition_type_code"));
                    v_statement_insertAdditionalInfo.setObject(5, v_inRow.get("period_code"));
                    v_statement_insertAdditionalInfo.setObject(6, v_inRow.get("addition_type_value"));
                    v_statement_insertAdditionalInfo.addBatch();
                }

                v_statement_insertAdditionalInfo.executeBatch();
            }

            // BaseExtrate Local Temp Table 생성
            PreparedStatement v_statement_createBaseExtrate = conn.prepareStatement(v_sql_createTableBaseExrate.toString());
            v_statement_createBaseExtrate.execute();

            // BaseExtrate Local Temp Table에 insert
            PreparedStatement v_statement_insertBaseExtrate = conn.prepareStatement(v_sql_insertTableBaseExrate);

            if(!v_inBaseExtract.isEmpty() && v_inBaseExtract.size() > 0){
            log.info("-----> v_inBaseExtract : " + v_inBaseExtract.size());
                for(TcProjectBaseExrateType v_inRow : v_inBaseExtract){
                    v_statement_insertBaseExtrate.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertBaseExtrate.setObject(2, v_inRow.get("project_code"));
                    v_statement_insertBaseExtrate.setObject(3, v_inRow.get("model_code"));
                    v_statement_insertBaseExtrate.setObject(4, v_inRow.get("currency_code"));
                    v_statement_insertBaseExtrate.setObject(5, v_inRow.get("period_code"));
                    v_statement_insertBaseExtrate.setObject(6, v_inRow.get("exrate"));
                    v_statement_insertBaseExtrate.addBatch();
                }

                v_statement_insertBaseExtrate.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());

            v_statement_proc.setString(1, context.getInputData().getUserId());
            v_rs = v_statement_proc.executeQuery();
            

            // Procedure Out put 담기 TcProcOutType
            while (v_rs.next()){
                TcProcOutType v_row = TcProcOutType.create();
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));                
                context.setResult(v_row);
            }

            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }
        
    }
}