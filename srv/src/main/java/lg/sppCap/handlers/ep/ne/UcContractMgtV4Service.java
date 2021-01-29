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

import cds.gen.ep.uccontractmgtv4service.InputData;
import cds.gen.ep.uccontractmgtv4service.NetContractEndProcContext;
import cds.gen.ep.uccontractmgtv4service.OutType;
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
    
}