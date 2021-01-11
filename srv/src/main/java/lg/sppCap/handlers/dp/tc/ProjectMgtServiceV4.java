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
        v_sql_callProc.append("I_PROJECT => #LOCAL_TEMP_MST,");        
        v_sql_callProc.append("I_SIMILAR_MODEL => #LOCAL_TEMP_SUPPLIER,");        
        v_sql_callProc.append("I_ADD_INFO => #LOCAL_TEMP_ITEM, ");        
        v_sql_callProc.append("I_BASE_EXRATE => #LOCAL_TEMP_MANAGER,");        
        v_sql_callProc.append("I_USER_NO => ?,");        
        v_sql_callProc.append("O_MSG => ?)");                    

        Collection<TcProjectType> v_inPrj = context.getInputData().getTcPjt();
        Collection<TcProjectSimilarModelType> v_inSimilarModel = context.getInputData().getTcPjtSimilarModel();
        Collection<TcProjectAdditionInfoType> v_inAddInfo = context.getInputData().getTcPjtAddInfo();
        Collection<TcProjectBaseExrateType> v_inBaseExtract = context.getInputData().getTcPjtBaseExrate();
        Collection<TcProcOutType> v_result = new ArrayList<>();

        if(!v_inPrj.isEmpty() && v_inPrj.size() > 0){
            log.debug("-----> v_inPrj");
            for(TcProjectType v_inRow : v_inPrj){
                log.debug("> tenant_id : " + v_inRow.get("tenant_id"));
                log.debug("> project_code : " + v_inRow.get("project_code"));
                log.debug("> model_code : " + v_inRow.get("model_code"));
                log.debug("> project_name : " + v_inRow.get("project_name"));
                log.debug("> model_name : " + v_inRow.get("model_name"));
                log.debug("> product_group_code : " + v_inRow.get("product_group_code"));
                log.debug("> source_type_code : " + v_inRow.get("source_type_code"));
                log.debug("> quotation_project_code : " + v_inRow.get("quotation_project_code"));
                log.debug("> project_status_code : " + v_inRow.get("project_status_code"));
                log.debug("> project_grade_code : " + v_inRow.get("project_grade_code"));
                log.debug("> develope_event_code : " + v_inRow.get("develope_event_code"));
                log.debug("> production_company_code : " + v_inRow.get("production_company_code"));
                log.debug("> project_leader_empno : " + v_inRow.get("project_leader_empno"));
                log.debug("> buyer_empno : " + v_inRow.get("buyer_empno"));
                log.debug("> marketing_person_empno : " + v_inRow.get("marketing_person_empno"));
                log.debug("> planning_person_empno : " + v_inRow.get("planning_person_empno"));
                log.debug("> customer_local_name : " + v_inRow.get("customer_local_name"));
                log.debug("> last_customer_name : " + v_inRow.get("last_customer_name"));
                log.debug("> customer_model_desc : " + v_inRow.get("customer_model_desc"));
                log.debug("> mcst_yield_rate : " + v_inRow.get("mcst_yield_rate"));
                log.debug("> bom_type_code : " + v_inRow.get("bom_type_code"));
                log.debug("> project_create_date : " + v_inRow.get("project_create_date"));
            }
        }
        
        if(!v_inSimilarModel.isEmpty() && v_inSimilarModel.size() > 0){
            log.debug("-----> v_inSimilarModel");
            for(TcProjectSimilarModelType v_inRow : v_inSimilarModel){
                log.debug("> tenant_id : " + v_inRow.get("tenant_id"));
                log.debug("> project_code : " + v_inRow.get("project_code"));
                log.debug("> model_code : " + v_inRow.get("model_code"));
                log.debug("> similar_model_code : " + v_inRow.get("similar_model_code"));
                log.debug("> code_desc : " + v_inRow.get("code_desc"));
                log.debug("> direct_register_flag : " + v_inRow.get("direct_register_flag"));
            }
        }

        if(!v_inAddInfo.isEmpty() && v_inAddInfo.size() > 0){
            log.debug("-----> v_inAddInfo");
            for(TcProjectAdditionInfoType v_inRow : v_inAddInfo){
                log.debug("> tenant_id : " + v_inRow.get("tenant_id"));
                log.debug("> project_code : " + v_inRow.get("project_code"));
                log.debug("> model_code : " + v_inRow.get("model_code"));
                log.debug("> similar_model_code : " + v_inRow.get("similar_model_code"));
                log.debug("> code_desc : " + v_inRow.get("code_desc"));
                log.debug("> direct_register_flag : " + v_inRow.get("direct_register_flag"));
            }
        }

        if(!v_inBaseExtract.isEmpty() && v_inBaseExtract.size() > 0){
            log.debug("-----> v_inBaseExtract");
            for(TcProjectBaseExrateType v_inRow : v_inBaseExtract){
                log.debug("> tenant_id : " + v_inRow.get("tenant_id"));
                log.debug("> project_code : " + v_inRow.get("project_code"));
                log.debug("> model_code : " + v_inRow.get("model_code"));
                log.debug("> currency_code : " + v_inRow.get("currency_code"));
                log.debug("> period_code : " + v_inRow.get("period_code"));
                log.debug("> exrate : " + v_inRow.get("exrate"));
            }
        }

        ResultSet v_rs = null;
        /*
		try {            
            Connection conn = jdbc.getDataSource().getConnection();

            // Vendor Pool Mst Local Temp Table 생성
            PreparedStatement v_statement_tableMst = conn.prepareStatement(v_sql_createTableMst.toString());
            v_statement_tableMst.execute();

            // Vendor Pool Mst Local Temp Table에 insert
            PreparedStatement v_statement_insertMst = conn.prepareStatement(v_sql_insertTableMst);

            if(!v_inMst.isEmpty() && v_inMst.size() > 0){
                for(VpMstType v_inRow : v_inMst){
                    v_statement_insertMst.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertMst.setObject(2, v_inRow.get("company_code"));
                    v_statement_insertMst.setObject(3, v_inRow.get("org_type_code"));
                    v_statement_insertMst.setObject(4, v_inRow.get("org_code"));
                    v_statement_insertMst.setObject(5, v_inRow.get("vendor_pool_code"));
                    v_statement_insertMst.setObject(6, v_inRow.get("vendor_pool_local_name"));
                    v_statement_insertMst.setObject(7, v_inRow.get("vendor_pool_english_name"));
                    v_statement_insertMst.setObject(8, v_inRow.get("repr_department_code"));
                    v_statement_insertMst.setObject(9, v_inRow.get("operation_unit_code"));
                    v_statement_insertMst.setObject(10, v_inRow.get("inp_type_code"));
                    v_statement_insertMst.setObject(11, v_inRow.get("mtlmob_base_code"));
                    v_statement_insertMst.setObject(12, v_inRow.get("regular_evaluation_flag"));
                    v_statement_insertMst.setObject(13, v_inRow.get("industry_class_code"));
                    v_statement_insertMst.setObject(14, v_inRow.get("sd_exception_flag"));
                    v_statement_insertMst.setObject(15, v_inRow.get("vendor_pool_apply_exception_flag"));
                    v_statement_insertMst.setObject(16, v_inRow.get("domestic_net_price_diff_rate"));
                    v_statement_insertMst.setObject(17, v_inRow.get("dom_oversea_netprice_diff_rate"));
                    v_statement_insertMst.setObject(18, v_inRow.get("equipment_grade_code"));
                    v_statement_insertMst.setObject(19, v_inRow.get("equipment_type_code"));
                    v_statement_insertMst.setObject(20, v_inRow.get("vendor_pool_use_flag"));
                    v_statement_insertMst.setObject(21, v_inRow.get("vendor_pool_desc"));
                    v_statement_insertMst.setObject(22, v_inRow.get("vendor_pool_history_desc"));
                    v_statement_insertMst.setObject(23, v_inRow.get("parent_vendor_pool_code"));
                    v_statement_insertMst.setObject(24, v_inRow.get("leaf_flag"));
                    v_statement_insertMst.setObject(25, v_inRow.get("level_number"));
                    v_statement_insertMst.setObject(26, v_inRow.get("display_sequence"));
                    v_statement_insertMst.setObject(27, v_inRow.get("register_reason"));
                    v_statement_insertMst.setObject(28, v_inRow.get("approval_number"));
                    v_statement_insertMst.addBatch();
                }

                v_statement_insertMst.executeBatch();
            }

            // Vendor Pool Supplier Local Temp Table 생성
            PreparedStatement v_statement_tableSupplier = conn.prepareStatement(v_sql_createTableSupplier.toString());
            v_statement_tableSupplier.execute();

            // Vendor Pool Supplier Local Temp Table에 insert
            PreparedStatement v_statement_insertSupplier = conn.prepareStatement(v_sql_insertTableSupplier);

            if(!v_inSupplier.isEmpty() && v_inSupplier.size() > 0){
                for(VpSuppilerType v_inRow : v_inSupplier){
                    v_statement_insertSupplier.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertSupplier.setObject(2, v_inRow.get("company_code"));
                    v_statement_insertSupplier.setObject(3, v_inRow.get("org_type_code"));
                    v_statement_insertSupplier.setObject(4, v_inRow.get("org_code"));
                    v_statement_insertSupplier.setObject(5, v_inRow.get("vendor_pool_code"));
                    v_statement_insertSupplier.setObject(6, v_inRow.get("supplier_code"));
                    v_statement_insertSupplier.setObject(7, v_inRow.get("supeval_target_flag"));
                    v_statement_insertSupplier.setObject(8, v_inRow.get("supplier_op_plan_review_flag"));
                    v_statement_insertSupplier.setObject(9, v_inRow.get("supeval_control_flag"));
                    v_statement_insertSupplier.setObject(10, v_inRow.get("supeval_control_start_date"));
                    v_statement_insertSupplier.setObject(11, v_inRow.get("supeval_control_end_date"));
                    v_statement_insertSupplier.setObject(12, v_inRow.get("supeval_restrict_start_date"));
                    v_statement_insertSupplier.setObject(13, v_inRow.get("supeval_restrict_end_date"));
                    v_statement_insertSupplier.setObject(14, v_inRow.get("inp_code"));
                    v_statement_insertSupplier.setObject(15, v_inRow.get("supplier_rm_control_flag"));
                    v_statement_insertSupplier.setObject(16, v_inRow.get("supplier_base_portion_rate"));
                    v_statement_insertSupplier.setObject(17, v_inRow.get("vendor_pool_mapping_use_flag"));
                    v_statement_insertSupplier.setObject(18, v_inRow.get("register_reason"));
                    v_statement_insertSupplier.setObject(19, v_inRow.get("approval_number"));
                    v_statement_insertSupplier.addBatch();
                }

                v_statement_insertSupplier.executeBatch();
            }

            // Vendor Pool Item Local Temp Table 생성
            PreparedStatement v_statement_tableItem = conn.prepareStatement(v_sql_createTableItem.toString());
            v_statement_tableItem.execute();

            // Vendor Pool Mst Local Temp Table에 insert
            PreparedStatement v_statement_insertItem = conn.prepareStatement(v_sql_insertTableItem);

            if(!v_inItem.isEmpty() && v_inItem.size() > 0){
                for(VpItemType v_inRow : v_inItem){
                    v_statement_insertItem.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertItem.setObject(2, v_inRow.get("company_code"));
                    v_statement_insertItem.setObject(3, v_inRow.get("org_type_code"));
                    v_statement_insertItem.setObject(4, v_inRow.get("org_code"));
                    v_statement_insertItem.setObject(5, v_inRow.get("vendor_pool_code"));
                    v_statement_insertItem.setObject(6, v_inRow.get("material_code"));
                    v_statement_insertItem.setObject(7, v_inRow.get("vendor_pool_mapping_use_flag"));
                    v_statement_insertItem.setObject(8, v_inRow.get("register_reason"));
                    v_statement_insertItem.setObject(9, v_inRow.get("approval_number"));                    
                    v_statement_insertItem.addBatch();
                }

                v_statement_insertItem.executeBatch();
            }

            // Vendor Pool Manager Local Temp Table 생성
            PreparedStatement v_statement_tableManager = conn.prepareStatement(v_sql_createTableManager.toString());
            v_statement_tableManager.execute();

            // Vendor Pool Manager Local Temp Table에 insert
            PreparedStatement v_statement_insertManager = conn.prepareStatement(v_sql_insertTableManager);

            if(!v_inManager.isEmpty() && v_inManager.size() > 0){
                for(VpManagerType v_inRow : v_inManager){
                    v_statement_insertManager.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insertManager.setObject(2, v_inRow.get("company_code"));
                    v_statement_insertManager.setObject(3, v_inRow.get("org_type_code"));
                    v_statement_insertManager.setObject(4, v_inRow.get("org_code"));
                    v_statement_insertManager.setObject(5, v_inRow.get("vendor_pool_code"));
                    v_statement_insertManager.setObject(6, v_inRow.get("vendor_pool_person_empno"));
                    v_statement_insertManager.setObject(7, v_inRow.get("vendor_pool_person_role_text"));
                    v_statement_insertManager.setObject(8, v_inRow.get("vendor_pool_mapping_use_flag"));
                    v_statement_insertManager.setObject(9, v_inRow.get("register_reason"));
                    v_statement_insertManager.setObject(10, v_inRow.get("approval_number"));
                    v_statement_insertManager.addBatch();
                }

                v_statement_insertManager.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());

            v_statement_proc.setString(1, context.getInputData().getUserId());
            v_statement_proc.setString(2, context.getInputData().getUserNo());
            v_rs = v_statement_proc.executeQuery();
            

            //VpOutType

            // Procedure Out put 담기
            while (v_rs.next()){
                VpOutType v_row = VpOutType.create();
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));                
                v_result.add(v_row);
            }

            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }
        */
    }
}