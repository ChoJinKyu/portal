package lg.sppCap.handlers.ep.po;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
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

import cds.gen.ep.loimgtv4service.DelLoiPublishType;
import cds.gen.ep.loimgtv4service.DelLoiSelectionType;
//import cds.gen.ep.loimgtv4service.DeleteDetails;
//import cds.gen.ep.loimgtv4service.ReqMulDelType;
//import cds.gen.ep.loimgtv4service.ReqDelType;
import cds.gen.ep.loimgtv4service.DeleteLoiMulEntityProcContext;
import cds.gen.ep.loimgtv4service.DeleteLoiPublishProcContext;
import cds.gen.ep.loimgtv4service.DeleteLoiSupplySelectionProcContext;
import cds.gen.ep.loimgtv4service.InputData;
import cds.gen.ep.loimgtv4service.LoiDtlType;
import cds.gen.ep.loimgtv4service.LoiMgtV4Service_;
import cds.gen.ep.loimgtv4service.LoiRfqDtlOutType;
import cds.gen.ep.loimgtv4service.LoiRfqType;
import cds.gen.ep.loimgtv4service.OutType;
import cds.gen.ep.loimgtv4service.SaveLoiPublishProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiPublishType;
import cds.gen.ep.loimgtv4service.SaveLoiQuotationNumberProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiRequestMultiEntitylProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiRmkProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiSelectionType;
import cds.gen.ep.loimgtv4service.SaveLoiSupplySelectionProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiVosProcContext;
import cds.gen.ep.loimgtv4service.SaveReturnType;
import cds.gen.ep.loimgtv4service.SavedHeaders;
import cds.gen.ep.loimgtv4service.SavedReqDetails;
import cds.gen.ep.loimgtv4service.SavedSuppliers;
import cds.gen.ep.loimgtv4service.SupplierMulEntityProcContext;
import cds.gen.ep.loimgtv4service.SupplySelectionResultContext;

@Component
@ServiceName(LoiMgtV4Service_.CDS_NAME)
public class LoiMgtV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveLoiVosProcContext.CDS_NAME)
    public void onSaveLoiVosProc(SaveLoiVosProcContext context) {
        
        log.info("### EP_SAVE_LOI_VOS_PROC 프로시저 호출시작 ###");
        
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL EP_SAVE_LOI_VOS_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" I_LOI_ITEM_NUMBER => ?, ")
                    .append(" I_SUPPLIER_OPINION => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        String resultMessage = "";

        jdbc.update(v_sql.toString()
        , context.getTenantId()
        , context.getCompanyCode()
        , context.getLoiWriteNumber()
        , context.getLoiItemNumber()
        , context.getSupplierOpinion()
        , resultMessage
        );

        context.setResult("SUCCESS");
        context.setCompleted();

        log.info("### EP_SAVE_LOI_VOS_PROC 프로시저 종료 ###");

    }    

    //비고 저장
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveLoiRmkProcContext.CDS_NAME)
    public void onSaveLoiRmkProc(SaveLoiRmkProcContext context) {
        
        log.info("### EP_SAVE_LOI_RMK_PROC 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";        
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL EP_SAVE_LOI_RMK_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" I_LOI_ITEM_NUMBER => ?, ")
                    .append(" I_REMARK => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        // Commit Option
        jdbc.execute(v_sql_commitOption); 
        
        String resultMessage = "";

        jdbc.update(v_sql.toString(),
                            context.getTenantId()
                            , context.getCompanyCode()
                            , context.getLoiWriteNumber()
                            , context.getLoiItemNumber()
                            , context.getRemark()
                            , resultMessage
                            );

        context.setResult("SUCCESS");
        context.setCompleted();                            

        log.info("### EP_SAVE_LOI_RMK_PROC 프로시저 종료 ###");

    }

    //견적번호 저장 
    @Transactional(rollbackFor = SQLException.class)
	@On(event=SaveLoiQuotationNumberProcContext.CDS_NAME)
	public void onSaveLoiQuotationNumberProc(SaveLoiQuotationNumberProcContext context) {

        log.info("### EP_SAVE_LOI_QUOTATION_NUMBER_PROC 프로시저 호출시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";          

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_SAVE_LOI_QUOTATION_NUMBER ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("LOI_WRITE_NUMBER NVARCHAR(50), ")
									.append("LOI_ITEM_NUMBER NVARCHAR(50), ")
									.append("QUOTATION_NUMBER DECIMAL, ")
									.append("QUOTATION_ITEM_NUMBER DECIMAL ")
								.append(")");

        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_SAVE_LOI_QUOTATION_NUMBER";                                        
		String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_SAVE_LOI_QUOTATION_NUMBER VALUES (?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL EP_SAVE_LOI_QUOTATION_NUMBER_PROC( I_TABLE => #LOCAL_TEMP_EP_SAVE_LOI_QUOTATION_NUMBER, O_TABLE_MESSAGE => ? )";


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
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number"),
                    v_inRow.get("quotation_number"),
                    v_inRow.get("quotation_item_number")};
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

        log.info("### EP_SAVE_LOI_QUOTATION_NUMBER_PROC 프로시저 호출종료 ###");

    }   
    
    //업체선정품의 업체선정결과
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SupplySelectionResultContext.CDS_NAME)
    public void onSupplySelectionResult(SupplySelectionResultContext context) {

        log.info("### EP_SUPPLY_SELECTION_RESULT 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        //String v_sql_createTableH = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_H (HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        //String v_sql_createTableD = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (DETAIL_ID BIGINT, HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";

        StringBuffer v_sql_createTableH = new StringBuffer();
		v_sql_createTableH.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_R ( ")
									.append("QUOTATION_NUMBER NVARCHAR(100), ")
									.append("QUOTATION_ITEM_NUMBER NVARCHAR(100)")
                                .append(")");

        StringBuffer v_sql_createTableD = new StringBuffer();
		v_sql_createTableD.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_D ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                                    .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                                .append(")");   


        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_R";
        String v_sql_dropableD = "DROP TABLE #LOCAL_TEMP_D";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_R VALUES (?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?)";

        String v_sql_callProc = "CALL EP_SUPPLY_SELECTION_RESULT(I_RFQ_TABLE => #LOCAL_TEMP_R, I_DTL_TABLE => #LOCAL_TEMP_D, O_TABLE => ?)";

        Collection<LoiRfqType> v_inHeaders = context.getInputData().getLoiRfqType();
        Collection<LoiDtlType> v_inDetails = context.getInputData().getLoiDtlType();
 
        //LoiRfqDtlOutType v_result = LoiRfqDtlOutType.create();
        Collection<LoiRfqDtlOutType> v_result = new ArrayList<>(); 
        // Collection<SavedHeaders> v_resultH = new ArrayList<>();
        // Collection<SavedReqDetails> v_resultD = new ArrayList<>();

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableH.toString());
        jdbc.execute(v_sql_createTableD.toString());

        // Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
            for(LoiRfqType v_inRow : v_inHeaders){
                log.info("quotation_number="+v_inRow.get("quotation_number"));
                log.info("quotation_item_number="+v_inRow.get("quotation_item_number"));
                Object[] values = new Object[] {
                    v_inRow.get("quotation_number"),
                    v_inRow.get("quotation_item_number")
                };
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTableH, batchH);

        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(LoiDtlType v_inRow : v_inDetails){
                log.info("loi_item_number="+v_inRow.get("loi_item_number"));
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number")
                };
                batchD.add(values);
            }
        } 
        log.info("111111111111111111111111r=");
        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);

        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<LoiRfqDtlOutType>(){
            @Override
            public LoiRfqDtlOutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                LoiRfqDtlOutType v_row = LoiRfqDtlOutType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setLoiWriteNumber(v_rs.getString("loi_write_number"));
                v_row.setLoiItemNumber(v_rs.getString("loi_item_number"));
                v_row.setItemSequence(v_rs.getBigDecimal("item_sequence"));
                v_row.setOfflineFlag(v_rs.getBoolean("offline_flag"));
                v_row.setPlantCode(v_rs.getString("plant_code"));
                v_row.setPlantName(v_rs.getString("plant_name"));
                v_row.setItemDesc(v_rs.getString("item_desc"));
                v_row.setSpecDesc(v_rs.getString("spec_desc"));
                v_row.setUnit(v_rs.getString("unit"));
                v_row.setRequestQuantity(v_rs.getBigDecimal("request_quantity"));
                v_row.setCurrencyCode(v_rs.getString("currency_code"));
                v_row.setRequestAmount(v_rs.getBigDecimal("request_amount"));
                v_row.setSelectionResult(v_rs.getString("selection_result"));
                v_row.setSupplierCode(v_rs.getString("supplier_code"));
                v_row.setSupplierName(v_rs.getString("supplier_name"));
                v_row.setQuotationAmount(v_rs.getBigDecimal("quotation_amount"));
                v_row.setDeliveryRequestDate(v_rs.getString("delivery_request_date"));
                v_row.setQuotationDueDate(v_rs.getString("quotation_due_date"));
                // v_row.setDeliveryRequestDate(v_rs.getDate("delivery_request_date").toLocalDate());
                // v_row.setQuotationDueDate(v_rs.getDate("quotation_due_date").toLocalDate());
                v_row.setQuotationRemark(v_rs.getString("quotation_remark"));
                v_row.setOfflineSelectionSupplierCode(v_rs.getString("offline_selection_supplier_code"));
                v_row.setOfflineSelectionSupplierName(v_rs.getString("offline_selection_supplier_name"));
                v_row.setOfflineQuotationAmount(v_rs.getBigDecimal("offline_quotation_amount"));
                v_row.setOfflineQuotationDueDate(v_rs.getString("offline_quotation_due_date"));
                // v_row.setOfflineQuotationDueDate(v_rs.getDate("offline_quotation_due_date").toLocalDate());
                v_row.setOfflineQuotationRemark(v_rs.getString("offline_quotation_remark"));
                
                v_result.add(v_row);
                return v_row;
            }
        });

        log.info("22222222222222222222222=");
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

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
        jdbc.execute(v_sql_dropableH);
        jdbc.execute(v_sql_dropableD);

        context.setResult(v_result);
        context.setCompleted();

        log.info("### EP_SUPPLY_SELECTION_RESULT 프로시저 호출종료 ###");

    }    
    
    //LOI 업체선정 품의
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveLoiSupplySelectionProcContext.CDS_NAME)
    public void onSaveLoiSupplySelectionProc(SaveLoiSupplySelectionProcContext context) {

        log.info("### EP_SAVE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";           

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_SAVE_LOI_SUPPLY_SELECTION ( ")
                            .append("TENANT_ID NVARCHAR(5), ")
                            .append("COMPANY_CODE NVARCHAR(10), ")
                            .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                            .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                        .append(")");
        
        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_SAVE_LOI_SUPPLY_SELECTION";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_SAVE_LOI_SUPPLY_SELECTION VALUES (?, ?, ?, ?)";

        v_sql_callProc.append("CALL EP_SAVE_LOI_SUPPLY_SELECTION_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_SELECTION_NUMBER => ?, ")
                    .append(" I_LOI_SELECTION_TITLE => ?, ")
                    .append(" I_LOI_SELECTION_STATUS_CODE => ?, ")
                    .append(" I_SPECIAL_NOTE => ?, ")
                    .append(" I_ATTCH_GROUP_NUMBER => ?, ")
                    .append(" I_APPROVAL_NUMBER => ?, ")
                    .append(" I_BUYER_EMPNO => ?, ")
                    .append(" I_PURCHASING_DEPARTMENT_CODE => ?, ")
                    .append(" I_REMARK => ?, ")
                    .append(" I_ORG_TYPE_CODE => ?, ")
                    .append(" I_ORG_CODE => ?, ")
                    .append(" I_USER_ID => ?, ")
                    .append(" I_TABLE => #LOCAL_TEMP_EP_SAVE_LOI_SUPPLY_SELECTION, ")
                    .append(" O_TABLE_MESSAGE => ? ")
                .append(" )");        

        SaveLoiSelectionType v_indata = context.getInputData();
        Collection<OutType> v_result = new ArrayList<>(); 
        Collection<LoiDtlType> v_inDetails = v_indata.getDetails();

        // log.info("###getTenantId===="+v_indata.getTenantId());

        // Commit Option
        jdbc.execute(v_sql_commitOption);     
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());    
    
        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(LoiDtlType v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number")};
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

        paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_SELECTION_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_SELECTION_TITLE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_SELECTION_STATUS_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_SPECIAL_NOTE", Types.NCLOB));
        paramList.add(new SqlParameter("I_ATTCH_GROUP_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_APPROVAL_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_BUYER_EMPNO", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_PURCHASING_DEPARTMENT_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_REMARK", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ORG_TYPE_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ORG_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
        paramList.add(oDTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());
                stmt.setObject(1, v_indata.get("tenant_id"));
                stmt.setObject(2, v_indata.get("company_code"));
                stmt.setObject(3, v_indata.get("loi_selection_number"));
                stmt.setObject(4, v_indata.get("loi_selection_title"));
                stmt.setObject(5, v_indata.get("loi_selection_status_code"));
                stmt.setObject(6, v_indata.get("special_note"));
                stmt.setObject(7, v_indata.get("attch_group_number"));
                stmt.setObject(8, v_indata.get("approval_number"));
                stmt.setObject(9, v_indata.get("buyer_empno"));
                stmt.setObject(10, v_indata.get("purchasing_department_code"));
                stmt.setObject(11, v_indata.get("remark"));
                stmt.setObject(12, v_indata.get("org_type_code"));
                stmt.setObject(13, v_indata.get("org_code"));
                stmt.setObject(14, v_indata.get("user_id"));
                return stmt;
            }
        }, paramList);       
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableD);

        context.setResult(v_result);            
        context.setCompleted();         
        
        log.info("### EP_SAVE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출종료 ###");

    }    

    //LOI 업체선정 품의 삭제
    @Transactional(rollbackFor = SQLException.class)
    @On(event = DeleteLoiSupplySelectionProcContext.CDS_NAME)
    public void onDeleteLoiSupplySelectionProc(DeleteLoiSupplySelectionProcContext context) {

        log.info("### EP_DELETE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출시작 ###");

        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION ( ")
                            .append("TENANT_ID NVARCHAR(5), ")
                            .append("COMPANY_CODE NVARCHAR(10), ")
                            .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                            .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                        .append(")");
        
        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION VALUES (?, ?, ?, ?)";

        v_sql_callProc.append("CALL EP_DELETE_LOI_SUPPLY_SELECTION_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_SELECTION_NUMBER => ?, ")
                    .append(" I_USER_ID => ?, ")
                    .append(" I_TABLE => #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION, ")
                    .append(" O_TABLE_MESSAGE => ? ")
                .append(" )");        

        DelLoiSelectionType v_indata = context.getInputData();
        Collection<OutType> v_result = new ArrayList<>(); 
        Collection<LoiDtlType> v_inDetails = v_indata.getDetails();

        // log.info("###getTenantId===="+v_indata.getTenantId());

        // Commit Option
        jdbc.execute(v_sql_commitOption);     
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());    
    
        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(LoiDtlType v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number")};
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

        paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_SELECTION_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
        paramList.add(oDTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());
                stmt.setObject(1, v_indata.get("tenant_id"));
                stmt.setObject(2, v_indata.get("company_code"));
                stmt.setObject(3, v_indata.get("loi_selection_number"));
                stmt.setObject(4, v_indata.get("user_id"));
                return stmt;
            }
        }, paramList);       
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableD);

        context.setResult(v_result);            
        context.setCompleted();      
        
        log.info("### EP_DELETE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출종료 ###");

    }    

    //LOI 발행품의
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveLoiPublishProcContext.CDS_NAME)
    public void onSaveLoiPublishProc(SaveLoiPublishProcContext context) {

        log.info("### EP_SAVE_LOI_PUBLISH_PROC 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";        

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_SAVE_LOI_PUBLISH ( ")
                            .append("TENANT_ID NVARCHAR(5), ")
                            .append("COMPANY_CODE NVARCHAR(10), ")
                            .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                            .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                        .append(")");
        
        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_SAVE_LOI_PUBLISH";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_SAVE_LOI_PUBLISH VALUES (?, ?, ?, ?)";

        v_sql_callProc.append("CALL EP_SAVE_LOI_PUBLISH_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_PUBLISH_NUMBER => ?, ")
                    .append(" I_LOI_PUBLISH_TITLE => ?, ")
                    .append(" I_LOI_PUBLISH_STATUS_CODE => ?, ")
                    .append(" I_SUPPLIER_CODE => ?, ")
                    .append(" I_CONTRACT_FORMAT_ID => ?, ")
                    .append(" I_OFFLINE_FLAG => ?, ")
                    .append(" I_CONTRACT_DATE => ?, ")
                    .append(" I_ADDITIONAL_CONDITION_DESC => ?, ")
                    .append(" I_SPECIAL_NOTE => ?, ")
                    .append(" I_ATTCH_GROUP_NUMBER => ?, ")
                    .append(" I_APPROVAL_NUMBER => ?, ")
                    .append(" I_BUYER_EMPNO => ?, ")
                    .append(" I_PURCHASING_DEPARTMENT_CODE => ?, ")
                    .append(" I_REMARK => ?, ")
                    .append(" I_ORG_TYPE_CODE => ?, ")
                    .append(" I_ORG_CODE => ?, ")
                    .append(" I_USER_ID => ?, ")
                    .append(" I_TABLE => #LOCAL_TEMP_EP_SAVE_LOI_PUBLISH, ")
                    .append(" O_TABLE_MESSAGE => ? ")
                .append(" )");        

        SaveLoiPublishType v_indata = context.getInputData();
        Collection<OutType> v_result = new ArrayList<>(); 
        Collection<LoiDtlType> v_inDetails = v_indata.getDetails();

        // log.info("###getTenantId===="+v_indata.getTenantId());

        // Commit Option
        jdbc.execute(v_sql_commitOption);     
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());    
    
        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(LoiDtlType v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number")};
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

        paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_PUBLISH_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_PUBLISH_TITLE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_PUBLISH_STATUS_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_SUPPLIER_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_CONTRACT_FORMAT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_OFFLINE_FLAG", Types.BOOLEAN));
        paramList.add(new SqlParameter("I_CONTRACT_DATE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ADDITIONAL_CONDITION_DESC", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_SPECIAL_NOTE", Types.NCLOB));
        paramList.add(new SqlParameter("I_ATTCH_GROUP_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_APPROVAL_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_BUYER_EMPNO", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_PURCHASING_DEPARTMENT_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_REMARK", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ORG_TYPE_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ORG_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
        paramList.add(oDTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmnt = con.prepareCall(v_sql_callProc.toString());
                stmnt.setObject(1, v_indata.get("tenant_id"));
                stmnt.setObject(2, v_indata.get("company_code"));
                stmnt.setObject(3, v_indata.get("loi_publish_number"));
                stmnt.setObject(4, v_indata.get("loi_publish_title"));
                stmnt.setObject(5, v_indata.get("loi_publish_status_code"));
                stmnt.setObject(6, v_indata.get("supplier_code"));
                stmnt.setObject(7, v_indata.get("contract_format_id"));
                stmnt.setObject(8, v_indata.get("offline_flag"));
                stmnt.setObject(9, v_indata.get("contract_date"));
                stmnt.setObject(10, v_indata.get("additional_condition_desc"));
                stmnt.setObject(11, v_indata.get("special_note"));
                stmnt.setObject(12, v_indata.get("attch_group_number"));
                stmnt.setObject(13, v_indata.get("approval_number"));
                stmnt.setObject(14, v_indata.get("buyer_empno"));
                stmnt.setObject(15, v_indata.get("purchasing_department_code"));
                stmnt.setObject(16, v_indata.get("remark"));
                stmnt.setObject(17, v_indata.get("org_type_code"));
                stmnt.setObject(18, v_indata.get("org_code"));
                stmnt.setObject(19, v_indata.get("user_id"));  
   
                return stmnt;
            }
        }, paramList);       
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableD);

        context.setResult(v_result);            
        context.setCompleted();            

        log.info("### EP_SAVE_LOI_PUBLISH_PROC 프로시저 호출종료 ###");

    }    

    //LOI 발행품의 삭제
    @Transactional(rollbackFor = SQLException.class)
    @On(event = DeleteLoiPublishProcContext.CDS_NAME)
    public void onDeleteLoiPublishProc(DeleteLoiPublishProcContext context) {

        log.info("### EP_DELETE_LOI_PUBLISH_PROC 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;"; 

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_DELETE_LOI_PUBLISH ( ")
                            .append("TENANT_ID NVARCHAR(5), ")
                            .append("COMPANY_CODE NVARCHAR(10), ")
                            .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                            .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                        .append(")");
        
        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_DELETE_LOI_PUBLISH";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_DELETE_LOI_PUBLISH VALUES (?, ?, ?, ?)";

        v_sql_callProc.append("CALL EP_DELETE_LOI_PUBLISH_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_PUBLISH_NUMBER => ?, ")
                    .append(" I_USER_ID => ?, ")
                    .append(" I_TABLE => #LOCAL_TEMP_EP_DELETE_LOI_PUBLISH, ")
                    .append(" O_TABLE_MESSAGE => ? ")
                .append(" )");        

        DelLoiPublishType v_indata = context.getInputData();                
        Collection<OutType> v_result = new ArrayList<>(); 
        Collection<LoiDtlType> v_inDetails = v_indata.getDetails();

        // Commit Option
        jdbc.execute(v_sql_commitOption);     
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());    
    
        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(LoiDtlType v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number")};
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

        paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_LOI_PUBLISH_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
        paramList.add(oDTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmnt = con.prepareCall(v_sql_callProc.toString());
                stmnt.setObject(1, v_indata.get("tenant_id"));
                stmnt.setObject(2, v_indata.get("company_code"));
                stmnt.setObject(3, v_indata.get("loi_publish_number"));
                stmnt.setObject(4, v_indata.get("user_id"));  
   
                return stmnt;
            }
        }, paramList);       
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableD);

        context.setResult(v_result);            
        context.setCompleted();      
        
        log.info("### EP_DELETE_LOI_PUBLISH_PROC 프로시저 호출종료 ###");

    }        

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveLoiRequestMultiEntitylProcContext.CDS_NAME)
    public void onSaveLoiRequestMultiEntitylProc(SaveLoiRequestMultiEntitylProcContext context) {

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        //String v_sql_createTableH = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_H (HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        //String v_sql_createTableD = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (DETAIL_ID BIGINT, HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";

        StringBuffer v_sql_createTableH = new StringBuffer();
		v_sql_createTableH.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_H ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
                                    .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                                    .append("LOI_NUMBER NVARCHAR(50), ")
                                    .append("LOI_REQUEST_TITLE NVARCHAR(100), ")
                                    .append("LOI_PUBLISH_PURPOSE_DESC NVARCHAR(1000), ")
                                    .append("SPECIAL_NOTE NCLOB, ")
                                    .append("REQUESTOR_EMPNO NVARCHAR(30), ")
                                    .append("REQUEST_DEPARTMENT_CODE NVARCHAR(50), ")
                                    //.append("REQUEST_DATE DATE ")
                                    .append("LOI_REQUEST_STATUS_CODE NVARCHAR(30) ")
                                .append(")");

        
        StringBuffer v_sql_createTableD = new StringBuffer();
		v_sql_createTableD.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_D ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                                    .append("LOI_ITEM_NUMBER NVARCHAR(50), ")
                                    .append("ITEM_SEQUENCE DECIMAL, ")
                                    .append("PLANT_CODE NVARCHAR(10), ")
                                    .append("EP_ITEM_CODE NVARCHAR(50), ")
									.append("ITEM_DESC NVARCHAR(200), ")
                                    .append("UNIT NVARCHAR(3), ")
                                    .append("REQUEST_NET_PRICE DECIMAL, ")
                                    .append("REQUEST_QUANTITY DECIMAL, ")
                                    .append("CURRENCY_CODE NVARCHAR(15), ")
                                    .append("SPEC_DESC NVARCHAR(1000), ")
                                    .append("DELIVERY_REQUEST_DATE NVARCHAR(50), ")
                                    .append("REQUEST_AMOUNT DECIMAL, ")
                                    .append("SUPPLIER_CODE NVARCHAR(100), ") 
                                    .append("BUYER_EMPNO NVARCHAR(30), ")
                                    .append("PURCHASING_DEPARTMENT_CODE NVARCHAR(50), ")
                                    .append("REMARK NVARCHAR(3000), ")
                                    .append("ROW_STATE NVARCHAR(5) ")
                                .append(")");   


        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_H";
        String v_sql_dropableD = "DROP TABLE #LOCAL_TEMP_D";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_H VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String v_sql_callProc = "CALL EP_PO_LOI_REQUEST_HD_SAVE_PROC(I_H_TABLE => #LOCAL_TEMP_H, I_D_TABLE => #LOCAL_TEMP_D, O_H_TABLE => ?, O_D_TABLE => ?)";

        Collection<SavedHeaders> v_inHeaders = context.getInputData().getSavedHeaders();
        Collection<SavedReqDetails> v_inDetails = context.getInputData().getSavedReqDetails();
 
        SaveReturnType v_result = SaveReturnType.create();
        Collection<SavedHeaders> v_resultH = new ArrayList<>();
        Collection<SavedReqDetails> v_resultD = new ArrayList<>();


        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableH.toString());
        jdbc.execute(v_sql_createTableD.toString());

        // Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
            for(SavedHeaders v_inRow : v_inHeaders){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_number"),
                    v_inRow.get("loi_request_title"),
                    v_inRow.get("loi_publish_purpose_desc"),
                    v_inRow.get("special_note"),
                    v_inRow.get("requestor_empno"),
                    v_inRow.get("request_department_code"),
                    //v_inRow.get("request_date")
                    v_inRow.get("loi_request_status_code")
                };
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTableH, batchH);

        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(SavedReqDetails v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number"),
                    v_inRow.get("item_sequence"),
                    v_inRow.get("plant_code"),
                    v_inRow.get("ep_item_code"),
                    v_inRow.get("item_desc"),
                    v_inRow.get("unit"),
                    v_inRow.get("request_net_price"),
                    v_inRow.get("request_quantity"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("spec_desc"),
                    v_inRow.get("delivery_request_date"),
                    v_inRow.get("request_amount"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("buyer_empno"),
                    v_inRow.get("purchasing_department_code"),                    
                    v_inRow.get("remark"),
                    v_inRow.get("row_state")
                };
                batchD.add(values);
            }
        } 

        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);

        boolean delFlag = false;

        SqlReturnResultSet oHTable = new SqlReturnResultSet("O_H_TABLE", new RowMapper<SavedHeaders>(){
            @Override
            public SavedHeaders mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedHeaders v_row = SavedHeaders.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setLoiWriteNumber(v_rs.getString("loi_write_number"));
                v_row.setLoiNumber(v_rs.getString("loi_number"));
                v_row.setLoiRequestTitle(v_rs.getString("loi_request_title"));
                v_row.setLoiPublishPurposeDesc(v_rs.getString("loi_publish_purpose_desc"));
                v_row.setSpecialNote(v_rs.getString("special_note"));
                v_row.setRequestorEmpno(v_rs.getString("requestor_empno"));
                v_row.setRequestDepartmentCode(v_rs.getString("request_department_code"));
                v_row.setLoiRequestStatusCode(v_rs.getString("loi_request_status_code"));
                v_resultH.add(v_row);
                return v_row;
            }
        });

        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_D_TABLE", new RowMapper<SavedReqDetails>(){
            @Override
            public SavedReqDetails mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedReqDetails v_row = SavedReqDetails.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setLoiWriteNumber(v_rs.getString("loi_write_number"));
                v_row.setLoiItemNumber(v_rs.getString("loi_item_number"));
                v_row.setItemSequence(v_rs.getString("item_sequence"));
                v_row.setPlantCode(v_rs.getString("plant_code"));
                v_row.setEpItemCode(v_rs.getString("ep_item_code"));
                v_row.setItemDesc(v_rs.getString("item_desc"));
                v_row.setUnit(v_rs.getString("unit"));
                v_row.setRequestNetPrice(v_rs.getString("request_net_price"));
                v_row.setRequestQuantity(v_rs.getString("request_quantity"));
                v_row.setCurrencyCode(v_rs.getString("currency_code"));
                v_row.setSpecDesc(v_rs.getString("spec_desc"));
                v_row.setDeliveryRequestDate(v_rs.getString("delivery_request_date"));
                v_row.setRequestAmount(v_rs.getString("request_amount"));
                v_row.setSupplierCode(v_rs.getString("supplier_code"));
                v_row.setBuyerEmpno(v_rs.getString("buyer_empno"));
                v_row.setPurchasingDepartmentCode(v_rs.getString("purchasing_department_code"));
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultD.add(v_row);
                return v_row;
            }
        });

        
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oHTable);
        paramList.add(oDTable);

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
        jdbc.execute(v_sql_dropableH);
        jdbc.execute(v_sql_dropableD);

        v_result.setSavedHeaders(v_resultH);
        v_result.setSavedReqDetails(v_resultD);
  
        context.setResult(v_result);
        context.setCompleted();

    }

    //LOI 발행요청 삭제
    @Transactional(rollbackFor = SQLException.class)
    @On(event = DeleteLoiMulEntityProcContext.CDS_NAME)
    public void onDeleteLoiMulEntityProc(DeleteLoiMulEntityProcContext context) {

        log.info("### EP_PO_LOI_REQUEST_HD_DELETE_PROC 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";   

        StringBuffer v_sql = new StringBuffer();  
        v_sql.append("CALL EP_PO_LOI_REQUEST_HD_DELETE_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");  

        // Commit Option
        jdbc.execute(v_sql_commitOption); 
        
        String resultMessage = "";

        jdbc.update(v_sql.toString(),
                    context.getTenantId()
                    , context.getCompanyCode()
                    , context.getLoiWriteNumber()
                    , resultMessage
                    );

        context.setResult("SUCCESS");
        context.setCompleted();                            

        log.info("### EP_PO_LOI_REQUEST_HD_DELETE_PROC 프로시저 종료 ###");

    }    

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SupplierMulEntityProcContext.CDS_NAME)    
    public void onSupplierMulEntityProc(SupplierMulEntityProcContext context) {

        log.info("### EP_PO_SUPPLIER_SAVE_PROC 프로시저 호출시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("LOI_WRITE_NUMBER NVARCHAR(50), ")
									.append("LOI_ITEM_NUMBER NVARCHAR(50), ")
                                    .append("SUPPLIER_CODE NVARCHAR(15), ")
                                    .append("ROW_STATE NVARCHAR(5) ")
								.append(")");

        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE";
        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE VALUES (?, ?, ?, ?, ?, ?)";
        String v_sql_callProc = "CALL EP_PO_SUPPLIER_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE, O_RTN_MSG => ? )";

        Collection<SavedSuppliers> v_inRows = context.getInputData();
        StringBuffer strRsltBuf = new StringBuffer(); 

        //ResultForexItems v_result = ResultForexItems.create();
        //Collection<ResultForexItems> v_resultH = new ArrayList<>();


        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());


        // Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inRows.isEmpty() && v_inRows.size() > 0){
            for(SavedSuppliers v_inRow : v_inRows){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("loi_write_number"),
                    v_inRow.get("loi_item_number"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("row_state")
                };
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTable, batchH);


        boolean delFlag = false;

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        //paramList.add(oTable);

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
        jdbc.execute(v_sql_dropableH);

        String rsltMesg = "SUCCESS";

		context.setResult(rsltMesg);
        context.setCompleted();

    }

}