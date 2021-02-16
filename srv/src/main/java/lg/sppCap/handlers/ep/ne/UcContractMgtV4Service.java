package lg.sppCap.handlers.ep.ne;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

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

import cds.gen.ep.uccontractmgtv4service.ApprovalDtlType;
import cds.gen.ep.uccontractmgtv4service.ApprovalExtraType;
import cds.gen.ep.uccontractmgtv4service.ApprovalMstType;
import cds.gen.ep.uccontractmgtv4service.ApprovalSupplierType;
import cds.gen.ep.uccontractmgtv4service.InputData;
import cds.gen.ep.uccontractmgtv4service.NetContractEndProcContext;
import cds.gen.ep.uccontractmgtv4service.OutType;
import cds.gen.ep.uccontractmgtv4service.SaveReturnType;
import cds.gen.ep.uccontractmgtv4service.UcApprovalMstCudProcContext;
import cds.gen.ep.uccontractmgtv4service.UcContractMgtV4Service_;

@Component
@ServiceName(UcContractMgtV4Service_.CDS_NAME)
public class UcContractMgtV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    //계약종료
    @Transactional(rollbackFor = SQLException.class)
	@On(event=NetContractEndProcContext.CDS_NAME)
	public void onNetContractEndProc(NetContractEndProcContext context) {

        log.info("### EP_UC_NET_CONTRACT_END_PROC 프로시저 호출시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";          

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_UC_NET_CONTRACT_END_PROC ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("NET_PRICE_CONTRACT_DOCUMENT_NO NVARCHAR(50), ")
									.append("NET_PRICE_CONTRACT_DEGREE DECIMAL, ")
									.append("DELETE_REASON NVARCHAR(3000) ")
								.append(")");

        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_UC_NET_CONTRACT_END_PROC";                                        
		String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_UC_NET_CONTRACT_END_PROC VALUES (?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL EP_UC_NET_CONTRACT_END_PROC( I_TABLE => #LOCAL_TEMP_EP_UC_NET_CONTRACT_END_PROC, O_TABLE_MESSAGE => ? )";


        Collection<OutType> v_result = new ArrayList<>(); 
        Collection<InputData> v_inDetails = context.getInputData();

        // Commit Option
        jdbc.execute(v_sql_commitOption);          

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString()); 

        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(InputData v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("net_price_contract_document_no"),
                    v_inRow.get("net_price_contract_degree"),
                    v_inRow.get("delete_reason")};
                batchD.add(values);
            }
        }    

        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);
            
        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_TABLE_MESSAGE", new RowMapper<OutType>(){
            @Override
            public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                OutType v_row = OutType.create();
                v_row.setReturncode(v_rs.getString("returncode"));
                v_row.setReturnmessage(v_rs.getString("returnmessage"));
                v_row.setSavedkey(v_rs.getString("savedkey"));
                v_result.add(v_row);
                return v_row;
            }
        });     
        
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oDTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());
                return stmt;
            }
        }, paramList);       
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableD);

        context.setResult(v_result);            
        context.setCompleted();          

        log.info("### EP_UC_NET_CONTRACT_END_PROC 프로시저 호출종료 ###");

    }   

    //단가계약 CUD
    @Transactional(rollbackFor = SQLException.class)
    @On(event = UcApprovalMstCudProcContext.CDS_NAME)
    public void onUcApprovalMstCudProc(UcApprovalMstCudProcContext context) {

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        StringBuffer v_sql_createTableM = new StringBuffer();
        v_sql_createTableM.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_M ( ")
                            .append("TENANT_ID                           NVARCHAR(5) ")
                            .append(", COMPANY_CODE                      NVARCHAR(10) ")
                            .append(", NET_PRICE_CONTRACT_DOCUMENT_NO    NVARCHAR(50) ")
                            .append(", NET_PRICE_CONTRACT_DEGREE         BIGINT ")
                            .append(", NET_PRICE_CONTRACT_TITLE          NVARCHAR(100) ")
                            .append(", NET_PRICE_CONTRACT_STATUS_CODE    NVARCHAR(30) ")
                            .append(", NET_PRICE_CONTRACT_STATUS_NAME    NVARCHAR(240) ")
                            .append(", EP_ITEM_CLASS_CODE                NVARCHAR(50) ")
                            .append(", EP_ITEM_CLASS_NAME                NVARCHAR(100) ")
                            .append(", NET_PRICE_CONTRACT_START_DATE     DATE ")
                            .append(", NET_PRICE_CONTRACT_END_DATE       DATE ")
                            .append(", QUOTATION_REFERENCE_INFO          NVARCHAR(100) ")
                            .append(", ORG_CODE                          NVARCHAR(10) ")
                            .append(", ORG_NAME                          NVARCHAR(240) ")
                            .append(", NET_PRICE_CONTRACT_CHG_TYPE_CD    NVARCHAR(30) ")
                            .append(", DELETE_REASON                     NVARCHAR(3000) ")
                            .append(", CONTRACT_WRITE_DATE               DATE ")
                            .append(", REMARK                            NVARCHAR(3000) ")
                            .append(", BUYER_EMPNO                       NVARCHAR(30) ")
                            .append(", BUYER_NAME                        NVARCHAR(240) ")
                            .append(", PURCHASING_DEPARTMENT_CODE        NVARCHAR(50) ")
                            .append(", PURCHASING_DEPARTMENT_NAME        NVARCHAR(240) ")  
                            .append(", SPECIAL_NOTE                      NCLOB ")  
                            .append(", LOCAL_CREATE_DTM                  SECONDDATE ")
                            .append(", LOCAL_UPDATE_DTM                  SECONDDATE ")
                            .append(", CREATE_USER_ID                    NVARCHAR(255) ")
                            .append(", UPDATE_USER_ID                    NVARCHAR(255) ")
                            .append(", SYSTEM_CREATE_DTM                 SECONDDATE ")
                            .append(", SYSTEM_UPDATE_DTM                 SECONDDATE ")      
                            .append(", ROW_STATE                         NVARCHAR(1) ")     
                            .append(")");     

        
        StringBuffer v_sql_createTableD = new StringBuffer();
        v_sql_createTableD.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_D ( ")
                            .append("TENANT_ID                           NVARCHAR(5) ")
                            .append(", COMPANY_CODE                      NVARCHAR(10) ")
                            .append(", NET_PRICE_CONTRACT_DOCUMENT_NO    NVARCHAR(50) ")
                            .append(", NET_PRICE_CONTRACT_DEGREE         BIGINT ")
                            .append(", NET_PRICE_CONTRACT_ITEM_NUMBER    NVARCHAR(50) ")
                            .append(", ITEM_SEQUENCE                     DECIMAL ")
                            .append(", EP_ITEM_CODE                      NVARCHAR(50) ")
                            .append(", EP_ITEM_NAME                      NVARCHAR(200) ")
                            .append(", SPEC_DESC                         NVARCHAR(1000) ")
                            .append(", CONTRACT_QUANTITY                 DECIMAL ")
                            .append(", UNIT                              NVARCHAR(3) ")
                            .append(", MATERIAL_APPLY_FLAG               BOOLEAN ")
                            .append(", LABOR_APPLY_FLAG                  BOOLEAN ")
                            .append(", CURRENCY_CODE                     NVARCHAR(15) ")
                            .append(", MATERIAL_NET_PRICE                DECIMAL ")
                            .append(", LABOR_NET_PRICE                   DECIMAL ")
                            .append(", REMARK                            NVARCHAR(3000) ")
                            .append(", ORG_TYPE_CODE                     NVARCHAR(2) ")
                            .append(", ORG_CODE                          NVARCHAR(10) ")  
                            .append(", LOCAL_CREATE_DTM                  SECONDDATE ")
                            .append(", LOCAL_UPDATE_DTM                  SECONDDATE ")
                            .append(", CREATE_USER_ID                    NVARCHAR(255) ")
                            .append(", UPDATE_USER_ID                    NVARCHAR(255) ")
                            .append(", SYSTEM_CREATE_DTM                 SECONDDATE ")
                            .append(", SYSTEM_UPDATE_DTM                 SECONDDATE ")   
                            .append(", ROW_STATE                         NVARCHAR(1) ")    
                            .append(")");          

        StringBuffer v_sql_createTableS = new StringBuffer();
        v_sql_createTableS.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_S ( ")
                            .append("TENANT_ID                           NVARCHAR(5) ")
                            .append(", COMPANY_CODE                      NVARCHAR(10) ")
                            .append(", NET_PRICE_CONTRACT_DOCUMENT_NO    NVARCHAR(50) ")
                            .append(", NET_PRICE_CONTRACT_DEGREE         BIGINT ")
                            .append(", SUPPLIER_CODE                     NVARCHAR(10) ")
                            .append(", SUPPLIER_NAME                     NVARCHAR(240) ")
                            .append(", DISTRB_RATE                       DECIMAL ")
                            .append(", APPLY_PLANT_DESC                  NVARCHAR(1000) ")
                            .append(", CONTRACT_NUMBER                   NVARCHAR(50) ")
                            .append(", REMARK                            NVARCHAR(3000) ") 
                            .append(", LOCAL_CREATE_DTM                  SECONDDATE ")
                            .append(", LOCAL_UPDATE_DTM                  SECONDDATE ")
                            .append(", CREATE_USER_ID                    NVARCHAR(255) ")
                            .append(", UPDATE_USER_ID                    NVARCHAR(255) ")
                            .append(", SYSTEM_CREATE_DTM                 SECONDDATE ")
                            .append(", SYSTEM_UPDATE_DTM                 SECONDDATE ")  
                            .append(", ROW_STATE                         NVARCHAR(1) ")  
                            .append(")");  
                            
        StringBuffer v_sql_createTableE = new StringBuffer();
        v_sql_createTableE.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_E ( ")
                            .append("TENANT_ID                           NVARCHAR(5) ")
                            .append(", COMPANY_CODE                      NVARCHAR(10) ")
                            .append(", NET_PRICE_CONTRACT_DOCUMENT_NO    NVARCHAR(50) ")
                            .append(", NET_PRICE_CONTRACT_DEGREE         BIGINT ")
                            .append(", NET_PRICE_CONTRACT_EXTRA_SEQ      DECIMAL ")
                            .append(", EXTRA_NUMBER                      NVARCHAR(30) ")
                            .append(", EXTRA_CLASS_NUMBER                NVARCHAR(30) ")
                            .append(", EXTRA_CLASS_NAME                  NVARCHAR(100) ")
                            .append(", EXTRA_NAME                        NVARCHAR(100) ")
                            .append(", BASE_EXTRA_RATE                   DECIMAL ")
                            .append(", APPLY_EXTRA_RATE                  DECIMAL ")
                            .append(", APPLY_EXTRA_DESC                  NVARCHAR(1000) ")
                            .append(", UPDATE_ENABLE_FLAG                BOOLEAN ")   
                            .append(", LOCAL_CREATE_DTM                  SECONDDATE ")
                            .append(", LOCAL_UPDATE_DTM                  SECONDDATE ")
                            .append(", CREATE_USER_ID                    NVARCHAR(255) ")
                            .append(", UPDATE_USER_ID                    NVARCHAR(255) ")
                            .append(", SYSTEM_CREATE_DTM                 SECONDDATE ")
                            .append(", SYSTEM_UPDATE_DTM                 SECONDDATE ") 
                            .append(", ROW_STATE                         NVARCHAR(1) ")  
                            .append(")"); 
                             

        String v_sql_dropableM = "DROP TABLE #LOCAL_TEMP_M";
        String v_sql_dropableD = "DROP TABLE #LOCAL_TEMP_D";
        String v_sql_dropableS = "DROP TABLE #LOCAL_TEMP_S";
        String v_sql_dropableE = "DROP TABLE #LOCAL_TEMP_E";

        String v_sql_insertTableM = "INSERT INTO #LOCAL_TEMP_M VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableS = "INSERT INTO #LOCAL_TEMP_S VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableE = "INSERT INTO #LOCAL_TEMP_E VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String v_sql_callProc = "CALL EP_UC_APPROVAL_MST_CUD_PROC(I_M_TABLE => #LOCAL_TEMP_M, I_D_TABLE => #LOCAL_TEMP_D, I_S_TABLE => #LOCAL_TEMP_S, I_E_TABLE => #LOCAL_TEMP_E, O_M_TABLE => ?, O_D_TABLE => ?, O_S_TABLE => ?, O_E_TABLE => ?)";

        Collection<ApprovalMstType> v_inMst = context.getInputData().getApprovalMstType();
        Collection<ApprovalDtlType> v_inDtl = context.getInputData().getApprovalDtlType();
        Collection<ApprovalSupplierType> v_inSupplier = context.getInputData().getApprovalSupplierType();
        Collection<ApprovalExtraType> v_inExtra = context.getInputData().getApprovalExtraType();

        SaveReturnType v_result = SaveReturnType.create();
        Collection<ApprovalMstType> v_resultM = new ArrayList<>();
        Collection<ApprovalDtlType> v_resultD = new ArrayList<>();
        Collection<ApprovalSupplierType> v_resultS = new ArrayList<>();
        Collection<ApprovalExtraType> v_resultE = new ArrayList<>();


        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableM.toString());
        jdbc.execute(v_sql_createTableD.toString());
        jdbc.execute(v_sql_createTableS.toString());
        jdbc.execute(v_sql_createTableE.toString());

        // Header Local Temp Table에 insert
        List<Object[]> batchM = new ArrayList<Object[]>();
        if(!v_inMst.isEmpty() && v_inMst.size() > 0){
            for(ApprovalMstType v_inRow : v_inMst){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),                      
                    v_inRow.get("company_code"),                   
                    v_inRow.get("net_price_contract_document_no"), 
                    v_inRow.get("net_price_contract_degree"),      
                    v_inRow.get("net_price_contract_title"),       
                    v_inRow.get("net_price_contract_status_code"), 
                    v_inRow.get("net_price_contract_status_name"), 
                    v_inRow.get("ep_item_class_code"),             
                    v_inRow.get("ep_item_class_name"),             
                    v_inRow.get("net_price_contract_start_date"),  
                    v_inRow.get("net_price_contract_end_date"),    
                    v_inRow.get("quotation_reference_info"),       
                    v_inRow.get("org_code"),                       
                    v_inRow.get("org_name"),                       
                    v_inRow.get("net_price_contract_chg_type_cd"), 
                    v_inRow.get("delete_reason"),                  
                    v_inRow.get("contract_write_date"),            
                    v_inRow.get("remark"),                         
                    v_inRow.get("buyer_empno"),                    
                    v_inRow.get("buyer_name"),                     
                    v_inRow.get("purchasing_department_code"),     
                    v_inRow.get("purchasing_department_name"),  
                    v_inRow.get("special_note"),        
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),              
                    v_inRow.get("row_state")                                          
                };
                batchM.add(values);
            }
        }

        int[] updateCountsM = jdbc.batchUpdate(v_sql_insertTableM, batchM);

        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDtl.isEmpty() && v_inDtl.size() > 0){
            for(ApprovalDtlType v_inRow : v_inDtl){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),                      
                    v_inRow.get("company_code"),                   
                    v_inRow.get("net_price_contract_document_no"), 
                    v_inRow.get("net_price_contract_degree"),      
                    v_inRow.get("net_price_contract_item_number"), 
                    v_inRow.get("item_sequence"),                  
                    v_inRow.get("ep_item_code"),                   
                    v_inRow.get("ep_item_name"),                   
                    v_inRow.get("spec_desc"),                      
                    v_inRow.get("contract_quantity"),              
                    v_inRow.get("unit"),                           
                    v_inRow.get("material_apply_flag"),            
                    v_inRow.get("labor_apply_flag"),               
                    v_inRow.get("currency_code"),                  
                    v_inRow.get("material_net_price"),             
                    v_inRow.get("labor_net_price"),                
                    v_inRow.get("remark"),                         
                    v_inRow.get("org_type_code"),                  
                    v_inRow.get("org_code"),                       
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),              
                    v_inRow.get("row_state")                      
                };
                batchD.add(values);
            }
        } 

        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);

        // Detail Local Temp Table에 insert
        List<Object[]> batchS = new ArrayList<Object[]>();
        if(!v_inSupplier.isEmpty() && v_inSupplier.size() > 0){
            for(ApprovalSupplierType v_inRow : v_inSupplier){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),                      
                    v_inRow.get("company_code"),                   
                    v_inRow.get("net_price_contract_document_no"), 
                    v_inRow.get("net_price_contract_degree"),      
                    v_inRow.get("supplier_code"),                  
                    v_inRow.get("supplier_name"),                  
                    v_inRow.get("distrb_rate"),                    
                    v_inRow.get("apply_plant_desc"),               
                    v_inRow.get("contract_number"),                
                    v_inRow.get("remark"),                         
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),              
                    v_inRow.get("row_state")                      
                };
                batchS.add(values);
            }
        } 

        int[] updateCountsS = jdbc.batchUpdate(v_sql_insertTableS, batchS);
        
        // Detail Local Temp Table에 insert
        List<Object[]> batchE = new ArrayList<Object[]>();
        if(!v_inExtra.isEmpty() && v_inExtra.size() > 0){
            for(ApprovalExtraType v_inRow : v_inExtra){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),                      
                    v_inRow.get("company_code"),                   
                    v_inRow.get("net_price_contract_document_no"), 
                    v_inRow.get("net_price_contract_degree"),      
                    v_inRow.get("net_price_contract_extra_seq"),   
                    v_inRow.get("extra_number"),                   
                    v_inRow.get("extra_class_number"),            
                    v_inRow.get("extra_class_name"),               
                    v_inRow.get("extra_name"),                     
                    v_inRow.get("base_extra_rate"),                
                    v_inRow.get("apply_extra_rate"),               
                    v_inRow.get("apply_extra_desc"),               
                    v_inRow.get("update_enable_flag"),             
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),              
                    v_inRow.get("row_state")                                          
                };
                batchE.add(values);
            }
        } 

        int[] updateCountsE = jdbc.batchUpdate(v_sql_insertTableE, batchE);        

        boolean delFlag = false;

        SqlReturnResultSet oMTable = new SqlReturnResultSet("O_M_TABLE", new RowMapper<ApprovalMstType>(){
            @Override
            public ApprovalMstType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ApprovalMstType v_row = ApprovalMstType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setNetPriceContractDocumentNo(v_rs.getString("net_price_contract_document_no"));
                v_row.setNetPriceContractDegree(v_rs.getLong("net_price_contract_degree"));
                v_row.setNetPriceContractTitle(v_rs.getString("net_price_contract_title"));
                v_row.setNetPriceContractStatusCode(v_rs.getString("net_price_contract_status_code"));
                v_row.setNetPriceContractStatusName(v_rs.getString("net_price_contract_status_name"));
                v_row.setEpItemClassCode(v_rs.getString("ep_item_class_code"));
                v_row.setEpItemClassName(v_rs.getString("ep_item_class_name"));
                v_row.setNetPriceContractStartDate(v_rs.getDate("net_price_contract_start_date").toLocalDate());
                v_row.setNetPriceContractEndDate(v_rs.getDate("net_price_contract_end_date").toLocalDate());
                v_row.setQuotationReferenceInfo(v_rs.getString("quotation_reference_info"));
                v_row.setOrgCode(v_rs.getString("org_code"));
                v_row.setOrgName(v_rs.getString("org_name"));
                v_row.setNetPriceContractChgTypeCd(v_rs.getString("net_price_contract_chg_type_cd"));
                v_row.setDeleteReason(v_rs.getString("delete_reason"));
                v_row.setContractWriteDate(v_rs.getDate("contract_write_date").toLocalDate());
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setBuyerEmpno(v_rs.getString("buyer_empno"));
                v_row.setBuyerName(v_rs.getString("buyer_name"));
                v_row.setPurchasingDepartmentCode(v_rs.getString("purchasing_department_code"));
                v_row.setPurchasingDepartmentName(v_rs.getString("purchasing_department_name"));
                v_row.setSpecialNote(v_rs.getString("special_note"));
                // v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                // v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setLocalCreateDtm(null);
                v_row.setLocalUpdateDtm(null);                
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                // v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                // v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setSystemCreateDtm(null);
                v_row.setSystemUpdateDtm(null);                
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultM.add(v_row);
                return v_row;
            }
        });

        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_D_TABLE", new RowMapper<ApprovalDtlType>(){
            @Override
            public ApprovalDtlType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ApprovalDtlType v_row = ApprovalDtlType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setNetPriceContractDocumentNo(v_rs.getString("net_price_contract_document_no"));
                v_row.setNetPriceContractDegree(v_rs.getLong("net_price_contract_degree"));
                v_row.setNetPriceContractItemNumber(v_rs.getString("net_price_contract_item_number"));
                v_row.setItemSequence(v_rs.getBigDecimal("item_sequence"));
                v_row.setEpItemCode(v_rs.getString("ep_item_code"));
                v_row.setEpItemName(v_rs.getString("ep_item_name"));
                v_row.setSpecDesc(v_rs.getString("spec_desc"));
                v_row.setContractQuantity(v_rs.getBigDecimal("contract_quantity"));
                v_row.setUnit(v_rs.getString("unit"));
                v_row.setMaterialApplyFlag(v_rs.getBoolean("material_apply_flag"));
                v_row.setLaborApplyFlag(v_rs.getBoolean("labor_apply_flag"));
                v_row.setCurrencyCode(v_rs.getString("currency_code"));
                v_row.setMaterialNetPrice(v_rs.getBigDecimal("material_net_price"));
                v_row.setLaborNetPrice(v_rs.getBigDecimal("labor_net_price"));
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setOrgTypeCode(v_rs.getString("org_type_code"));
                v_row.setOrgCode(v_rs.getString("org_code"));
                // v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                // v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setLocalCreateDtm(null);
                v_row.setLocalUpdateDtm(null);                
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                // v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                // v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setSystemCreateDtm(null);
                v_row.setSystemUpdateDtm(null);                
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultD.add(v_row);
                return v_row;
            }
        });

        SqlReturnResultSet oSTable = new SqlReturnResultSet("O_S_TABLE", new RowMapper<ApprovalSupplierType>(){
            @Override
            public ApprovalSupplierType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ApprovalSupplierType v_row = ApprovalSupplierType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setNetPriceContractDocumentNo(v_rs.getString("net_price_contract_document_no"));
                v_row.setNetPriceContractDegree(v_rs.getLong("net_price_contract_degree"));
                v_row.setSupplierCode(v_rs.getString("supplier_code"));
                v_row.setSupplierName(v_rs.getString("supplier_name"));
                v_row.setDistrbRate(v_rs.getBigDecimal("distrb_rate"));
                v_row.setApplyPlantDesc(v_rs.getString("apply_plant_desc"));
                v_row.setContractNumber(v_rs.getString("contract_number"));
                v_row.setRemark(v_rs.getString("remark"));
                // v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                // v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setLocalCreateDtm(null);
                v_row.setLocalUpdateDtm(null);                
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                // v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                // v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setSystemCreateDtm(null);
                v_row.setSystemUpdateDtm(null);     
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultS.add(v_row);
                return v_row;
            }
        });
        
        SqlReturnResultSet oETable = new SqlReturnResultSet("O_D_TABLE", new RowMapper<ApprovalExtraType>(){
            @Override
            public ApprovalExtraType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ApprovalExtraType v_row = ApprovalExtraType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setNetPriceContractDocumentNo(v_rs.getString("net_price_contract_document_no"));
                v_row.setNetPriceContractDegree(v_rs.getLong("net_price_contract_degree"));
                v_row.setNetPriceContractExtraSeq(v_rs.getBigDecimal("net_price_contract_extra_seq"));
                v_row.setExtraNumber(v_rs.getString("extra_number"));
                v_row.setExtraClassNumber(v_rs.getString("extra_class_number"));
                v_row.setExtraClassName(v_rs.getString("extra_class_name"));
                v_row.setExtraName(v_rs.getString("extra_name"));
                v_row.setBaseExtraRate(v_rs.getBigDecimal("base_extra_rate"));
                v_row.setApplyExtraRate(v_rs.getBigDecimal("apply_extra_rate"));
                // v_row.setApplyExtraRate(v_rs.getString("apply_extra_rate"));
                v_row.setApplyExtraDesc(v_rs.getString("apply_extra_desc"));
                v_row.setUpdateEnableFlag(v_rs.getBoolean("update_enable_flag"));
                // v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                // v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setLocalCreateDtm(null);
                v_row.setLocalUpdateDtm(null);                
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                // v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                // v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setSystemCreateDtm(null);
                v_row.setSystemUpdateDtm(null);     
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultE.add(v_row);
                return v_row;
            }
        });        
        
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oMTable);
        paramList.add(oDTable);
        paramList.add(oSTable);
        paramList.add(oETable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                String callProc = "";

                callProc = v_sql_callProc;
                
                CallableStatement callableStatement = connection.prepareCall(callProc);
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropableM);
        jdbc.execute(v_sql_dropableD);
        jdbc.execute(v_sql_dropableS);
        jdbc.execute(v_sql_dropableE);

        v_result.setApprovalMstType(v_resultM);
        v_result.setApprovalDtlType(v_resultD);
        v_result.setApprovalSupplierType(v_resultS);
        v_result.setApprovalExtraType(v_resultE);
  
        context.setResult(v_result);
        context.setCompleted();

    }    
    
}