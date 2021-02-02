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

import cds.gen.ep.ucquotationmgtv4service.*;

@Component
@ServiceName(UcQuotationMgtV4Service_.CDS_NAME)
public class UcQuotationMgtV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    //품목정보 저장
    @Transactional(rollbackFor = SQLException.class)
	@On(event=SaveUcQuotationDtlProcContext.CDS_NAME)
	public void onSaveUcQuotationDtlProc(SaveUcQuotationDtlProcContext context) {

        log.info("### EP_UC_QUOTATION_HD_SAVE_PROC 프로시저 호출시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";          

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
                                    .append("CONST_QUOTATION_NUMBER NVARCHAR(30), ")
                                    .append("CONST_QUOTATION_ITEM_NUMBER NVARCHAR(30), ")
                                    .append("ITEM_SEQUENCE DECIMAL, ")
                                    .append("EP_ITEM_CODE NVARCHAR(50), ")
                                    .append("ITEM_DESC NVARCHAR(200), ")
                                    .append("SPEC_DESC NVARCHAR(1000), ")
                                    .append("QUOTATION_QUANTITY DECIMAL, ")
                                    .append("EXTRA_RATE DECIMAL, ")
                                    .append("UNIT NVARCHAR(3), ")
                                    .append("CURRENCY_CODE NVARCHAR(15), ")
                                    .append("MATERIAL_APPLY_FLAG BOOLEAN, ")
                                    .append("LABOR_APPLY_FLAG BOOLEAN, ")
                                    .append("NET_PRICE_CHANGE_ALLOW_FLAG BOOLEAN, ")
                                    .append("BASE_MATERIAL_NET_PRICE DECIMAL, ")
                                    .append("BASE_LABOR_NET_PRICE DECIMAL, ")
                                    .append("MATERIAL_NET_PRICE DECIMAL, ")
                                    .append("MATERIAL_AMOUNT DECIMAL, ")
                                    .append("LABOR_NET_PRICE DECIMAL, ")
                                    .append("LABOR_AMOUNT DECIMAL, ")
                                    .append("SUM_AMOUNT DECIMAL, ")
                                    .append("REMARK NVARCHAR(3000), ")
                                    .append("NET_PRICE_CONTRACT_DOCUMENT_NO NVARCHAR(50), ")
                                    .append("NET_PRICE_CONTRACT_DEGREE DECIMAL, ")
                                    .append("NET_PRICE_CONTRACT_ITEM_NUMBER NVARCHAR(50), ")
                                    .append("SUPPLIER_ITEM_CREATE_FLAG BOOLEAN ")
								.append(")");

        String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC";                                        
		String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?)";
		String v_sql_callProc = "CALL EP_UC_QUOTATION_HD_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC, O_TABLE_MESSAGE => ? )";


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
                log.info("tenant_id="+v_inRow.get("tenant_id"));
                log.info("company_code="+v_inRow.get("company_code"));
                log.info("const_quotation_number="+v_inRow.get("const_quotation_number"));
                log.info("const_quotation_item_number="+v_inRow.get("const_quotation_item_number"));
                log.info("item_sequence="+v_inRow.get("item_sequence"));
                log.info("ep_item_code="+v_inRow.get("ep_item_code"));
                log.info("item_desc="+v_inRow.get("item_desc"));
                log.info("spec_desc="+v_inRow.get("spec_desc"));
                log.info("quotation_quantity="+v_inRow.get("quotation_quantity"));
                log.info("unit="+v_inRow.get("unit"));
                log.info("currency_code="+v_inRow.get("currency_code"));
                log.info("material_apply_flag="+v_inRow.get("material_apply_flag"));
                log.info("labor_apply_flag="+v_inRow.get("labor_apply_flag"));
                log.info("net_price_change_allow_flag="+v_inRow.get("net_price_change_allow_flag"));
                log.info("base_material_net_price="+v_inRow.get("base_material_net_price"));
                log.info("base_labor_net_price="+v_inRow.get("base_labor_net_price"));
                log.info("material_net_price="+v_inRow.get("material_net_price"));
                log.info("material_amount="+v_inRow.get("material_amount"));
                log.info("labor_net_price="+v_inRow.get("labor_net_price"));
                log.info("labor_amount="+v_inRow.get("labor_amount"));
                log.info("sum_amount="+v_inRow.get("sum_amount"));
                log.info("remark="+v_inRow.get("remark"));
                log.info("net_price_contract_document_no="+v_inRow.get("net_price_contract_document_no"));
                log.info("net_price_contract_degree="+v_inRow.get("net_price_contract_degree"));
                log.info("net_price_contract_item_number="+v_inRow.get("net_price_contract_item_number"));
                log.info("supplier_item_create_flag="+v_inRow.get("supplier_item_create_flag"));

                Object[] values = new Object[] {
                    
                    
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("const_quotation_number"),
                    v_inRow.get("const_quotation_item_number"),
                    v_inRow.get("item_sequence"),
                    v_inRow.get("ep_item_code"),
                    v_inRow.get("item_desc"),
                    v_inRow.get("spec_desc"),
                    v_inRow.get("quotation_quantity"),
                    v_inRow.get("extra_rate"),
                    v_inRow.get("unit"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("material_apply_flag"),
                    v_inRow.get("labor_apply_flag"),
                    v_inRow.get("net_price_change_allow_flag"),
                    v_inRow.get("base_material_net_price"),
                    v_inRow.get("base_labor_net_price"),
                    v_inRow.get("material_net_price"),
                    v_inRow.get("material_amount"),
                    v_inRow.get("labor_net_price"),
                    v_inRow.get("labor_amount"),
                    v_inRow.get("sum_amount"),
                    v_inRow.get("remark"),
                    v_inRow.get("net_price_contract_document_no"),
                    v_inRow.get("net_price_contract_degree"),
                    v_inRow.get("net_price_contract_item_number"),
                    v_inRow.get("supplier_item_create_flag")};
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

        log.info("### EP_UC_QUOTATION_HD_SAVE_PROC 프로시저 호출종료 ###");

    }   
    
}