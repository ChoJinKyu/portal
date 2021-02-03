package lg.sppCap.handlers.pg.vp;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
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

import cds.gen.pg.vpmappingv4service.*;

@Component
@ServiceName(VpMappingV4Service_.CDS_NAME)
public class VpMappingServiceV4 implements EventHandler {

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

    @On(event=VpMappingChangeProcContext.CDS_NAME)
    public void onVpMappingChangeProc(VpMappingChangeProcContext context) {        
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=VpMappingChangeTestProcContext.CDS_NAME)
    public void onVpMappingChangeTestProc(VpMappingChangeTestProcContext context) {

        log.info("### onVpMappingChangeTestProc 1건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MST (");
        v_sql_createTableMst.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableMst.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableMst.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableMst.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableMst.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableMst.append("VENDOR_POOL_LOCAL_NAME NVARCHAR(240),");
        v_sql_createTableMst.append("VENDOR_POOL_ENGLISH_NAME NVARCHAR(240),");
        v_sql_createTableMst.append("REPR_DEPARTMENT_CODE NVARCHAR(50),");
        v_sql_createTableMst.append("OPERATION_UNIT_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("INP_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MTLMOB_BASE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("REGULAR_EVALUATION_FLAG BOOLEAN,");
        v_sql_createTableMst.append("INDUSTRY_CLASS_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("SD_EXCEPTION_FLAG BOOLEAN,");
        v_sql_createTableMst.append("VENDOR_POOL_APPLY_EXCEPTION_FLAG BOOLEAN,");
        v_sql_createTableMst.append("MAKER_MATERIAL_CODE_MNGT_FLAG BOOLEAN,");
        v_sql_createTableMst.append("DOMESTIC_NET_PRICE_DIFF_RATE DECIMAL,");
        v_sql_createTableMst.append("DOM_OVERSEA_NETPRICE_DIFF_RATE DECIMAL,");
        v_sql_createTableMst.append("EQUIPMENT_GRADE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("EQUIPMENT_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("VENDOR_POOL_USE_FLAG BOOLEAN,");
        v_sql_createTableMst.append("VENDOR_POOL_DESC NVARCHAR(3000),");
        v_sql_createTableMst.append("VENDOR_POOL_HISTORY_DESC NVARCHAR(3000),");
        v_sql_createTableMst.append("PARENT_VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableMst.append("LEAF_FLAG BOOLEAN,");
        v_sql_createTableMst.append("LEVEL_NUMBER DECIMAL,");
        v_sql_createTableMst.append("DISPLAY_SEQUENCE BIGINT,");
        v_sql_createTableMst.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableMst.append("APPROVAL_NUMBER NVARCHAR(50),"); 
        v_sql_createTableMst.append("CRUD_TYPE_CODE NVARCHAR(2))");         
        
        String v_sql_dropTableMst = "DROP TABLE #LOCAL_TEMP_MST";                

        StringBuffer v_sql_createTableSupplier = new StringBuffer();
        v_sql_createTableSupplier.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SUPPLIER (");        
        v_sql_createTableSupplier.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableSupplier.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableSupplier.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableSupplier.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableSupplier.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableSupplier.append("SUPPLIER_CODE NVARCHAR(15),");
        v_sql_createTableSupplier.append("SUPEVAL_TARGET_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPPLIER_OP_PLAN_REVIEW_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPEVAL_CONTROL_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPEVAL_CONTROL_START_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("SUPEVAL_CONTROL_END_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("SUPEVAL_RESTRICT_START_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("SUPEVAL_RESTRICT_END_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("INP_CODE NVARCHAR(30),");
        v_sql_createTableSupplier.append("SUPPLIER_RM_CONTROL_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPPLIER_BASE_PORTION_RATE DECIMAL,");
        v_sql_createTableSupplier.append("VENDOR_POOL_MAPPING_USE_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableSupplier.append("APPROVAL_NUMBER NVARCHAR(50),");
        v_sql_createTableSupplier.append("CRUD_TYPE_CODE NVARCHAR(2))"); 

        String v_sql_dropTableSupplier = "DROP TABLE #LOCAL_TEMP_SUPPLIER";                      

        StringBuffer v_sql_createTableItem = new StringBuffer();
        v_sql_createTableItem.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_ITEM (");        
        v_sql_createTableItem.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableItem.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableItem.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableItem.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableItem.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableItem.append("MATERIAL_CODE NVARCHAR(40),");
        v_sql_createTableItem.append("VENDOR_POOL_MAPPING_USE_FLAG BOOLEAN,");
        v_sql_createTableItem.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableItem.append("APPROVAL_NUMBER NVARCHAR(50),");
        v_sql_createTableItem.append("CRUD_TYPE_CODE NVARCHAR(2))"); 
        
        String v_sql_dropTableItem = "DROP TABLE #LOCAL_TEMP_ITEM";                

        StringBuffer v_sql_createTableManager = new StringBuffer();
        v_sql_createTableManager.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MANAGER (");        
        v_sql_createTableManager.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableManager.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableManager.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableManager.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableManager.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableManager.append("VENDOR_POOL_PERSON_EMPNO NVARCHAR(30),");
        v_sql_createTableManager.append("VENDOR_POOL_PERSON_ROLE_TEXT NVARCHAR(50),");
        v_sql_createTableManager.append("VENDOR_POOL_MAPPING_USE_FLAG BOOLEAN,");
        v_sql_createTableManager.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableManager.append("APPROVAL_NUMBER NVARCHAR(50),");
        v_sql_createTableManager.append("CRUD_TYPE_CODE NVARCHAR(2))"); 

        String v_sql_dropTableManager = "DROP TABLE #LOCAL_TEMP_MANAGER";        

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_MST VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableSupplier = "INSERT INTO #LOCAL_TEMP_SUPPLIER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableItem = "INSERT INTO #LOCAL_TEMP_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableManager = "INSERT INTO #LOCAL_TEMP_MANAGER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL PG_VP_MAPPING_CHANGE_PROC(");        
            v_sql_callProc.append("I_MST => #LOCAL_TEMP_MST,");        
            v_sql_callProc.append("I_SUP => #LOCAL_TEMP_SUPPLIER,");        
            v_sql_callProc.append("I_ITM => #LOCAL_TEMP_ITEM, ");        
            v_sql_callProc.append("I_MAN => #LOCAL_TEMP_MANAGER,");        
            v_sql_callProc.append("I_USER_ID => ?,");        
            v_sql_callProc.append("I_USER_NO => ?,");        
            v_sql_callProc.append("O_MSG => ?)");   

        log.info("### DB Connect Start ###");

        Collection<VpMstType> v_inMst = context.getInputData().getVpMst();
        Collection<VpSuppilerType> v_inSupplier = context.getInputData().getVpSupplier();
        Collection<VpItemType> v_inItem = context.getInputData().getVpItem();
        Collection<VpManagerType> v_inManager = context.getInputData().getVpManager();             

        Collection<VpOutType> v_result = new ArrayList<>();
        		            
        log.info("### Proc Start ###");            

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Mst Local Temp Table 생성            
        jdbc.execute(v_sql_createTableMst.toString());

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inMst.isEmpty() && v_inMst.size() > 0){
            for(VpMstType v_inRow : v_inMst){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("vendor_pool_local_name"),
                    v_inRow.get("vendor_pool_english_name"),
                    v_inRow.get("repr_department_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("inp_type_code"),
                    v_inRow.get("mtlmob_base_code"),
                    v_inRow.get("regular_evaluation_flag"),
                    v_inRow.get("industry_class_code"),
                    v_inRow.get("sd_exception_flag"),
                    v_inRow.get("vendor_pool_apply_exception_flag"),
                    v_inRow.get("maker_material_code_mngt_flag"),
                    v_inRow.get("domestic_net_price_diff_rate"),
                    v_inRow.get("dom_oversea_netprice_diff_rate"),
                    v_inRow.get("equipment_grade_code"),
                    v_inRow.get("equipment_type_code"),
                    v_inRow.get("vendor_pool_use_flag"),
                    v_inRow.get("vendor_pool_desc"),
                    v_inRow.get("vendor_pool_history_desc"),
                    v_inRow.get("parent_vendor_pool_code"),
                    v_inRow.get("leaf_flag"),
                    v_inRow.get("level_number"),
                    v_inRow.get("display_sequence"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")
                };
                    
                batchMst.add(values);
            }
        }

        int[] updateCountsMst = jdbc.batchUpdate(v_sql_insertTableMst, batchMst);                        

        log.info("### insertMst Success ###");

        // Vendor Pool Supplier Local Temp Table 생성
        jdbc.execute(v_sql_createTableSupplier.toString());

        // Vendor Pool Supplier Local Temp Table에 insert            
        List<Object[]> batchSupp = new ArrayList<Object[]>();
        if(!v_inSupplier.isEmpty() && v_inSupplier.size() > 0){
            for(VpSuppilerType v_inRow : v_inSupplier){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("supeval_target_flag"),
                    v_inRow.get("supplier_op_plan_review_flag"),
                    v_inRow.get("supeval_control_flag"),
                    v_inRow.get("supeval_control_start_date"),
                    v_inRow.get("supeval_control_end_date"),
                    v_inRow.get("supeval_restrict_start_date"),
                    v_inRow.get("supeval_restrict_end_date"),
                    v_inRow.get("inp_code"),
                    v_inRow.get("supplier_rm_control_flag"),
                    v_inRow.get("supplier_base_portion_rate"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")
                };
                    
                batchSupp.add(values);
            }
        }

        int[] updateCountsSupp = jdbc.batchUpdate(v_sql_insertTableSupplier, batchSupp);                          

        log.info("### insertSupplier Success ###");

        // Vendor Pool Item Local Temp Table 생성
        jdbc.execute(v_sql_createTableItem.toString());

        // Vendor Pool Item Local Temp Table에 insert
        List<Object[]> batchItem = new ArrayList<Object[]>();
        if(!v_inItem.isEmpty() && v_inItem.size() > 0){
            for(VpItemType v_inRow : v_inItem){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),    
                    v_inRow.get("crud_type_code")  
                };
                    
                batchItem.add(values);
            }
        }

        int[] updateCountsItem = jdbc.batchUpdate(v_sql_insertTableItem, batchItem);                                      

        log.info("### insertItem Success ###");

        // Vendor Pool Manager Local Temp Table 생성
        jdbc.execute(v_sql_createTableManager.toString());

        // Vendor Pool Manager Local Temp Table에 insert
        List<Object[]> batchManager = new ArrayList<Object[]>();
        if(!v_inManager.isEmpty() && v_inManager.size() > 0){
            for(VpManagerType v_inRow : v_inManager){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("vendor_pool_person_empno"),
                    v_inRow.get("vendor_pool_person_role_text"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")                    
                };
                    
                batchManager.add(values);
            }
        }

        int[] updateCountsManager = jdbc.batchUpdate(v_sql_insertTableManager, batchManager);            

        log.info("### insertManager Success ###");

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));
        paramList.add(new SqlParameter("I_USER_NO", Types.VARCHAR));       
        
        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_MSG", new RowMapper<VpOutType>(){
            @Override
            public VpOutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                VpOutType v_row = VpOutType.create();
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
                callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                callableStatement.setString("I_USER_NO", context.getInputData().getUserNo());
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableMst);
        jdbc.execute(v_sql_dropTableSupplier);
        jdbc.execute(v_sql_dropTableItem);
        jdbc.execute(v_sql_dropTableManager);

        /*while (resultMap.next()){
            VpOutType v_row = VpOutType.create();
            v_row.setReturnCode(resultMap.getString("return_code"));
            v_row.setReturnMsg(resultMap.getString("return_msg"));                

            log.info(resultMap.getString("return_code"));
            log.info(resultMap.getString("return_msg"));

            if( "NG".equals(resultMap.getString("return_code"))){
                log.info("### Call Proc Error!!  ###");
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, resultMap.getString("return_msg"));
            }
            v_result.add(v_row);              
        }*/        
        //log.info(v_rs.getString("return_code"));
        //log.info(v_rs.getString("return_msg"));        
        //v_result.setReturnCode(resultMap.getReturnCode());
        //v_result.setReturnMsg(resultMap.getReturnMsg());
        
        context.setResult(v_result);
        context.setCompleted();            		
    }




    @Transactional(rollbackFor = SQLException.class)
    @On(event=VpMappingMngProcContext.CDS_NAME)
    public void onVpMappingMngProc(VpMappingMngProcContext context) {

        log.info("### onVpMappingChangeTestProc 1건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MST (");
        v_sql_createTableMst.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableMst.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableMst.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableMst.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableMst.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableMst.append("VENDOR_POOL_LOCAL_NAME NVARCHAR(240),");
        v_sql_createTableMst.append("VENDOR_POOL_ENGLISH_NAME NVARCHAR(240),");
        v_sql_createTableMst.append("REPR_DEPARTMENT_CODE NVARCHAR(50),");
        v_sql_createTableMst.append("OPERATION_UNIT_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("INP_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MTLMOB_BASE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("REGULAR_EVALUATION_FLAG BOOLEAN,");
        v_sql_createTableMst.append("INDUSTRY_CLASS_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("SD_EXCEPTION_FLAG BOOLEAN,");
        v_sql_createTableMst.append("VENDOR_POOL_APPLY_EXCEPTION_FLAG BOOLEAN,");
        v_sql_createTableMst.append("MAKER_MATERIAL_CODE_MNGT_FLAG BOOLEAN,");
        v_sql_createTableMst.append("DOMESTIC_NET_PRICE_DIFF_RATE DECIMAL,");
        v_sql_createTableMst.append("DOM_OVERSEA_NETPRICE_DIFF_RATE DECIMAL,");
        v_sql_createTableMst.append("EQUIPMENT_GRADE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("EQUIPMENT_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("VENDOR_POOL_USE_FLAG BOOLEAN,");
        v_sql_createTableMst.append("VENDOR_POOL_DESC NVARCHAR(3000),");
        v_sql_createTableMst.append("VENDOR_POOL_HISTORY_DESC NVARCHAR(3000),");
        v_sql_createTableMst.append("PARENT_VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableMst.append("LEAF_FLAG BOOLEAN,");
        v_sql_createTableMst.append("LEVEL_NUMBER DECIMAL,");
        v_sql_createTableMst.append("DISPLAY_SEQUENCE BIGINT,");
        v_sql_createTableMst.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableMst.append("APPROVAL_NUMBER NVARCHAR(50),"); 
        v_sql_createTableMst.append("CRUD_TYPE_CODE NVARCHAR(2))");         
        
        String v_sql_dropTableMst = "DROP TABLE #LOCAL_TEMP_MST";                

        StringBuffer v_sql_createTableSupplier = new StringBuffer();
        v_sql_createTableSupplier.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SUPPLIER (");        
        v_sql_createTableSupplier.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableSupplier.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableSupplier.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableSupplier.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableSupplier.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableSupplier.append("SUPPLIER_CODE NVARCHAR(15),");
        v_sql_createTableSupplier.append("SUPEVAL_TARGET_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPPLIER_OP_PLAN_REVIEW_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPEVAL_CONTROL_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPEVAL_CONTROL_START_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("SUPEVAL_CONTROL_END_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("SUPEVAL_RESTRICT_START_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("SUPEVAL_RESTRICT_END_DATE NVARCHAR(8),");
        v_sql_createTableSupplier.append("INP_CODE NVARCHAR(30),");
        v_sql_createTableSupplier.append("SUPPLIER_RM_CONTROL_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("SUPPLIER_BASE_PORTION_RATE DECIMAL,");
        v_sql_createTableSupplier.append("VENDOR_POOL_MAPPING_USE_FLAG BOOLEAN,");
        v_sql_createTableSupplier.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableSupplier.append("APPROVAL_NUMBER NVARCHAR(50),");
        v_sql_createTableSupplier.append("CRUD_TYPE_CODE NVARCHAR(2))"); 

        String v_sql_dropTableSupplier = "DROP TABLE #LOCAL_TEMP_SUPPLIER";                      

        StringBuffer v_sql_createTableItem = new StringBuffer();
        v_sql_createTableItem.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_ITEM (");        
        v_sql_createTableItem.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableItem.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableItem.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableItem.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableItem.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableItem.append("MATERIAL_CODE NVARCHAR(40),");
        v_sql_createTableItem.append("VENDOR_POOL_MAPPING_USE_FLAG BOOLEAN,");
        v_sql_createTableItem.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableItem.append("APPROVAL_NUMBER NVARCHAR(50),");
        v_sql_createTableItem.append("CRUD_TYPE_CODE NVARCHAR(2))"); 
        
        String v_sql_dropTableItem = "DROP TABLE #LOCAL_TEMP_ITEM";                

        StringBuffer v_sql_createTableManager = new StringBuffer();
        v_sql_createTableManager.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MANAGER (");        
        v_sql_createTableManager.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableManager.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTableManager.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTableManager.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTableManager.append("VENDOR_POOL_CODE NVARCHAR(20),");
        v_sql_createTableManager.append("VENDOR_POOL_PERSON_EMPNO NVARCHAR(30),");
        v_sql_createTableManager.append("VENDOR_POOL_PERSON_ROLE_TEXT NVARCHAR(50),");
        v_sql_createTableManager.append("VENDOR_POOL_MAPPING_USE_FLAG BOOLEAN,");
        v_sql_createTableManager.append("REGISTER_REASON NVARCHAR(50),");
        v_sql_createTableManager.append("APPROVAL_NUMBER NVARCHAR(50),");
        v_sql_createTableManager.append("CRUD_TYPE_CODE NVARCHAR(2))"); 

        String v_sql_dropTableManager = "DROP TABLE #LOCAL_TEMP_MANAGER";        

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_MST VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableSupplier = "INSERT INTO #LOCAL_TEMP_SUPPLIER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableItem = "INSERT INTO #LOCAL_TEMP_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableManager = "INSERT INTO #LOCAL_TEMP_MANAGER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL PG_VP_MAPPING_MANAGE_PROC(");        
            v_sql_callProc.append("I_MST => #LOCAL_TEMP_MST,");        
            v_sql_callProc.append("I_SUP => #LOCAL_TEMP_SUPPLIER,");        
            v_sql_callProc.append("I_ITM => #LOCAL_TEMP_ITEM, ");        
            v_sql_callProc.append("I_MAN => #LOCAL_TEMP_MANAGER,");        
            v_sql_callProc.append("I_USER_ID => ?,");        
            v_sql_callProc.append("I_USER_NO => ?,");        
            v_sql_callProc.append("O_MSG => ?)");   
            v_sql_callProc.append("O_TABLE => ?)");   

        log.info("### DB Connect Start ###");

        Collection<VpMstType> v_inMst = context.getInputData().getVpMst();
        Collection<VpSuppilerType> v_inSupplier = context.getInputData().getVpSupplier();
        Collection<VpItemType> v_inItem = context.getInputData().getVpItem();
        Collection<VpManagerType> v_inManager = context.getInputData().getVpManager();             

        Collection<VpOutObjectType> v_resultArr = new ArrayList<>();
        VpOutObjectType v_result = VpOutObjectType.create();
        VpOutType v_resultHash = VpOutType.create();
        Collection<VpOutExpMstType> v_resultTable = new ArrayList<>();        
        		            
        log.info("### Proc Start ###");            

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Mst Local Temp Table 생성            
        jdbc.execute(v_sql_createTableMst.toString());

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchMst = new ArrayList<Object[]>();
        if(!v_inMst.isEmpty() && v_inMst.size() > 0){
            for(VpMstType v_inRow : v_inMst){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("vendor_pool_local_name"),
                    v_inRow.get("vendor_pool_english_name"),
                    v_inRow.get("repr_department_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("inp_type_code"),
                    v_inRow.get("mtlmob_base_code"),
                    v_inRow.get("regular_evaluation_flag"),
                    v_inRow.get("industry_class_code"),
                    v_inRow.get("sd_exception_flag"),
                    v_inRow.get("vendor_pool_apply_exception_flag"),
                    v_inRow.get("maker_material_code_mngt_flag"),
                    v_inRow.get("domestic_net_price_diff_rate"),
                    v_inRow.get("dom_oversea_netprice_diff_rate"),
                    v_inRow.get("equipment_grade_code"),
                    v_inRow.get("equipment_type_code"),
                    v_inRow.get("vendor_pool_use_flag"),
                    v_inRow.get("vendor_pool_desc"),
                    v_inRow.get("vendor_pool_history_desc"),
                    v_inRow.get("parent_vendor_pool_code"),
                    v_inRow.get("leaf_flag"),
                    v_inRow.get("level_number"),
                    v_inRow.get("display_sequence"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")
                };
                    
                batchMst.add(values);
            }
        }

        int[] updateCountsMst = jdbc.batchUpdate(v_sql_insertTableMst, batchMst);                        

        log.info("### insertMst Success ###");

        // Vendor Pool Supplier Local Temp Table 생성
        jdbc.execute(v_sql_createTableSupplier.toString());

        // Vendor Pool Supplier Local Temp Table에 insert            
        List<Object[]> batchSupp = new ArrayList<Object[]>();
        if(!v_inSupplier.isEmpty() && v_inSupplier.size() > 0){
            for(VpSuppilerType v_inRow : v_inSupplier){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("supeval_target_flag"),
                    v_inRow.get("supplier_op_plan_review_flag"),
                    v_inRow.get("supeval_control_flag"),
                    v_inRow.get("supeval_control_start_date"),
                    v_inRow.get("supeval_control_end_date"),
                    v_inRow.get("supeval_restrict_start_date"),
                    v_inRow.get("supeval_restrict_end_date"),
                    v_inRow.get("inp_code"),
                    v_inRow.get("supplier_rm_control_flag"),
                    v_inRow.get("supplier_base_portion_rate"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")
                };
                    
                batchSupp.add(values);
            }
        }

        int[] updateCountsSupp = jdbc.batchUpdate(v_sql_insertTableSupplier, batchSupp);                          

        log.info("### insertSupplier Success ###");

        // Vendor Pool Item Local Temp Table 생성
        jdbc.execute(v_sql_createTableItem.toString());

        // Vendor Pool Item Local Temp Table에 insert
        List<Object[]> batchItem = new ArrayList<Object[]>();
        if(!v_inItem.isEmpty() && v_inItem.size() > 0){
            for(VpItemType v_inRow : v_inItem){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),    
                    v_inRow.get("crud_type_code")  
                };
                    
                batchItem.add(values);
            }
        }

        int[] updateCountsItem = jdbc.batchUpdate(v_sql_insertTableItem, batchItem);                                      

        log.info("### insertItem Success ###");

        // Vendor Pool Manager Local Temp Table 생성
        jdbc.execute(v_sql_createTableManager.toString());

        // Vendor Pool Manager Local Temp Table에 insert
        List<Object[]> batchManager = new ArrayList<Object[]>();
        if(!v_inManager.isEmpty() && v_inManager.size() > 0){
            for(VpManagerType v_inRow : v_inManager){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("vendor_pool_person_empno"),
                    v_inRow.get("vendor_pool_person_role_text"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")                    
                };
                    
                batchManager.add(values);
            }
        }

        int[] updateCountsManager = jdbc.batchUpdate(v_sql_insertTableManager, batchManager);            

        log.info("### insertManager Success ###");

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));
        paramList.add(new SqlParameter("I_USER_NO", Types.VARCHAR));       
        
        SqlReturnResultSet oReturnHash = new SqlReturnResultSet("O_MSG", new RowMapper<VpOutObjectType>(){
            @Override
            public VpOutObjectType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                VpOutObjectType v_row = VpOutObjectType.create();
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
                log.info(v_rs.getString("return_code"));
                log.info(v_rs.getString("return_msg"));  
                if("NG".equals(v_rs.getString("return_code"))){
                    log.info("### Call Proc Error!!  ###");
                    throw new ServiceException(ErrorStatuses.BAD_REQUEST, v_rs.getString("return_msg"));
                }                            
                v_resultHash.setReturnCode(v_row.getReturnCode());
                v_resultHash.setReturnMsg(v_row.getReturnMsg());
                return v_row;
            }
        });
        paramList.add(oReturnHash); 
        
        // Procedure Call
        SqlReturnResultSet oReturnTable = new SqlReturnResultSet("O_TABLE", new RowMapper<VpOutExpMstType>(){
            @Override
            public VpOutExpMstType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                VpOutExpMstType v_row = VpOutExpMstType.create();
                v_row.setParentId(v_rs.getString("parent_id"));
                v_row.setNodeId(v_rs.getString("node_id"));
                v_row.setPath(v_rs.getString("path"));
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setOrgTypeCode(v_rs.getString("org_type_code"));
                v_row.setOrgCode(v_rs.getString("org_code"));
                v_row.setVendorPoolCode(v_rs.getString("vendor_pool_code"));
                v_row.setVendorPoolLocalName(v_rs.getString("vendor_pool_local_name"));
                v_row.setVendorPoolEnglishName(v_rs.getString("vendor_pool_english_name"));
                v_row.setReprDepartmentCode(v_rs.getString("repr_department_code"));
                v_row.setOperationUnitCode(v_rs.getString("operation_unit_code"));
                v_row.setInpTypeCode(v_rs.getString("inp_type_code"));
                v_row.setMtlmobBaseCode(v_rs.getString("mtlmob_base_code"));
                v_row.setRegularEvaluationFlag(v_rs.getBoolean("regular_evaluation_flag"));
                v_row.setIndustryClassCode(v_rs.getString("industry_class_code"));
                v_row.setSdExceptionFlag(v_rs.getBoolean("sd_exception_flag"));
                v_row.setVendorPoolApplyExceptionFlag(v_rs.getBoolean("vendor_pool_apply_exception_flag"));
                v_row.setMakerMaterialCodeMngtFlag(v_rs.getBoolean("maker_material_code_mngt_flag"));
                v_row.setDomesticNetPriceDiffRate(v_rs.getBigDecimal("domestic_net_price_diff_rate"));
                v_row.setDomOverseaNetpriceDiffRate(v_rs.getBigDecimal("dom_oversea_netprice_diff_rate"));
                v_row.setEquipmentGradeCode(v_rs.getString("equipment_grade_code"));
                v_row.setEquipmentTypeCode(v_rs.getString("equipment_type_code"));
                v_row.setVendorPoolUseFlag(v_rs.getBoolean("vendor_pool_use_flag"));
                v_row.setVendorPoolDesc(v_rs.getString("vendor_pool_desc"));
                v_row.setVendorPoolHistoryDesc(v_rs.getString("vendor_pool_history_desc"));
                v_row.setParentVendorPoolCode(v_rs.getString("parent_vendor_pool_code"));
                v_row.setLeafFlag(v_rs.getBoolean("leaf_flag"));
                v_row.setLevelNumber(v_rs.getBigDecimal("level_number"));
                v_row.setDisplaySequence(v_rs.getLong("display_sequence"));
                v_row.setRegisterReason(v_rs.getString("register_reason"));
                v_row.setApprovalNumber(v_rs.getString("approval_number"));
                v_row.setInfoChangeStatus(v_rs.getString("info_change_status"));
                v_row.setVendorPoolPathSequence(v_rs.getString("vendor_pool_path_sequence"));
                v_row.setVendorPoolPathCode(v_rs.getString("vendor_pool_path_code"));
                v_row.setVendorPoolPathName(v_rs.getString("vendor_pool_path_name"));
                v_row.setHigherLevelPathName(v_rs.getString("higher_level_path_name"));
                v_row.setVendorPoolDisplayName(v_rs.getString("vendor_pool_display_name"));
                v_row.setVendorPoolLevel1Code(v_rs.getString("vendor_pool_level1_code"));
                v_row.setVendorPoolLevel2Code(v_rs.getString("vendor_pool_level2_code"));
                v_row.setVendorPoolLevel3Code(v_rs.getString("vendor_pool_level3_code"));
                v_row.setVendorPoolLevel4Code(v_rs.getString("vendor_pool_level4_code"));
                v_row.setVendorPoolLevel5Code(v_rs.getString("vendor_pool_level5_code"));
                v_row.setVendorPoolLevel1Name(v_rs.getString("vendor_pool_level1_name"));
                v_row.setVendorPoolLevel2Name(v_rs.getString("vendor_pool_level2_name"));
                v_row.setVendorPoolLevel3Name(v_rs.getString("vendor_pool_level3_name"));
                v_row.setVendorPoolLevel4Name(v_rs.getString("vendor_pool_level4_name"));
                v_row.setVendorPoolLevel5Name(v_rs.getString("vendor_pool_level5_name"));
                v_row.setHierarchyRank(v_rs.getLong("hierarchy_rank"));
                v_row.setHierarchyTreeSize(v_rs.getLong("hierarchy_tree_size"));
                v_row.setHierarchyParentRank(v_rs.getLong("hierarchy_parent_rank"));
                v_row.setHierarchyLevel(v_rs.getInt("hierarchy_level"));
                v_row.setHierarchyRootRank(v_rs.getLong("hierarchy_root_rank"));
                v_row.setHierarchyIsCycle(v_rs.getInt("hierarchy_is_cycle"));
                v_row.setHierarchyIsOrphan(v_rs.getInt("hierarchy_is_orphan"));
                v_row.setLeafYn(v_rs.getString("leaf_yn"));
                v_row.setChildLeafYn(v_rs.getString("child_leaf_yn"));
                v_resultTable.add(v_row);
                return v_row;
            }
        });

        paramList.add(oReturnTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                callableStatement.setString("I_USER_NO", context.getInputData().getUserNo());
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableMst);
        jdbc.execute(v_sql_dropTableSupplier);
        jdbc.execute(v_sql_dropTableItem);
        jdbc.execute(v_sql_dropTableManager);

        /*while (resultMap.next()){
            VpOutType v_row = VpOutType.create();
            v_row.setReturnCode(resultMap.getString("return_code"));
            v_row.setReturnMsg(resultMap.getString("return_msg"));                

            log.info(resultMap.getString("return_code"));
            log.info(resultMap.getString("return_msg"));

            if( "NG".equals(resultMap.getString("return_code"))){
                log.info("### Call Proc Error!!  ###");
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, resultMap.getString("return_msg"));
            }
            v_result.add(v_row);              
        }*/        
        //log.info(v_rs.getString("return_code"));
        //log.info(v_rs.getString("return_msg"));        
        //v_result.setReturnCode(resultMap.getReturnCode());
        //v_result.setReturnMsg(resultMap.getReturnMsg());
        
        v_result.setReturnCode(v_resultHash.getReturnCode());   
        v_result.setReturnMsg(v_resultHash.getReturnMsg());   
        v_result.setReturnVpObj(v_resultTable);
        v_resultArr.add(v_result);
        context.setResult(v_resultArr);
        context.setCompleted();            		
    }
}