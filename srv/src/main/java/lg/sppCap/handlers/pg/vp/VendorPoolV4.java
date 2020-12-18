package lg.sppCap.handlers.xx;

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

import cds.gen.pg.vpVendorPoolChangeProcCallV4Service.*;

@Component
@ServiceName(VpVendorPoolChangeProcCallV4Service_.CDS_NAME)
public class VendorPoolV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;   

    // Procedure 호출해서 header/Detail 저장
    // Header, Detail 둘다 multi
    /*********************************
    {
        "inputData" : {
            "savedHeaders" : [
                {"header_id" : 108, "cd": "eeee1122222", "name": "eeee11"},
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

    @On(event = VpVendorPoolChangeProcContext.CDS_NAME)
    public void onVpVendorPoolChangeProc(VpVendorPoolChangeProcContext context) {

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
        v_sql_createTableMst.append("APPROVAL_NUMBER NVARCHAR(50))");

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
        v_sql_createTableSupplier.append("APPROVAL_NUMBER NVARCHAR(50))");

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
        v_sql_createTableItem.append("APPROVAL_NUMBER NVARCHAR(50))");

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
        v_sql_createTableManager.append("APPROVAL_NUMBER NVARCHAR(50))");

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_MST VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableSupplier = "INSERT INTO #LOCAL_TEMP_SUPPLIER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableItem = "INSERT INTO #LOCAL_TEMP_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableManager = "INSERT INTO #LOCAL_TEMP_MANAGER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL PG_VP_VENDOR_POOL_CHANGE_PROC(");        
            v_sql_callProc.append("I_MST => #LOCAL_TEMP_MST,");        
            v_sql_callProc.append("I_SUP => #LOCAL_TEMP_SUPPLIER,");        
            v_sql_callProc.append("I_ITM => #LOCAL_TEMP_ITEM, ");        
            v_sql_callProc.append("I_MAN => #LOCAL_TEMP_MANAGER,");        
            v_sql_callProc.append("I_USER_ID => ?,");        
            v_sql_callProc.append("I_USER_NO => ?,");        
            v_sql_callProc.append("O_MSG => ?)");                    

        Collection<VpMstType> v_inMst = context.getInputData().getVpMstType();
        Collection<VpSuppilerType> v_inSupplier = context.getInputData().getVpSuppilerType();
        Collection<VpItemType> v_inItem = context.getInputData().getVpItemType();
        Collection<VpManagerType> v_inManager = context.getInputData().getVpManagerType();
        Collection<VpOutType> v_result = new ArrayList<>();

        ResultSet v_rs = null;

		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Vendor Pool Mst Local Temp Table 생성
            PreparedStatement v_statement_tableMst = conn.prepareStatement(v_sql_createTableMst);
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
            PreparedStatement v_statement_tableSupplier = conn.prepareStatement(v_sql_createTableSupplier);
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
            PreparedStatement v_statement_tableItem = conn.prepareStatement(v_sql_createTableItem);
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
            PreparedStatement v_statement_tableManager = conn.prepareStatement(v_sql_createTableManager);
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
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);

            v_statement_proc.setString(1, context.getUserId());
            v_statement_proc.setString(2, context.getUserNo());
            v_rs = v_statement_proc.executeQuery();
            

            //VpOutType

            // Procedure Out put 담기
            while (v_rs.next()){
                VpOutType v_row = VpOutType.create();
                v_row.setReturnCode(v_rs.getLong("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));                
                v_result.add(v_row);
            }

            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }
    }
}