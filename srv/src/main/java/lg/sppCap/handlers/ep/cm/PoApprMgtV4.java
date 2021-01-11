package lg.sppCap.handlers.ep.cm;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.Collection;
import java.util.ArrayList;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.ep.poapprmgtv4service.*;

@Component
@ServiceName(PoApprMgtV4Service_.CDS_NAME)
public class PoApprMgtV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;
    

    // Procedure 호출해서 외환신고품목 저장
    @On(event = SavePoForexDeclarationProcContext.CDS_NAME)
    public void onSavePoForexDeclaration(SavePoForexDeclarationProcContext context) {

		log.info("### EP_PO_FOREX_DECLARATION_SAVE_PROC 프로시저 호출 시작 ###");

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_PO_FOREX_DECLARATION ( ")
                         .append("TENANT_ID	NVARCHAR(5) ")
                         .append(", COMPANY_CODE NVARCHAR(10) ")
                         .append(", PO_NUMBER NVARCHAR(50) ")
                         .append(", FOREX_DECLARE_STATUS_CODE NVARCHAR(30) ")
                         //.append(", DECLARE_SCHEDULED_DATE DATE ")
                         //.append(", DECLARE_DATE DATE")
                         .append(", DECLARE_SCHEDULED_DATE NVARCHAR(50) ")
                         .append(", DECLARE_DATE NVARCHAR(50)")
                         .append(", ATTCH_GROUP_NUMBER NVARCHAR(100) ")
                         .append(", REMARK NVARCHAR(3000) ")
                         .append(", UPDATE_USER_ID NVARCHAR(255) ")
                         .append(")");

		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_EP_PO_FOREX_DECLARATION VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL EP_PO_FOREX_DECLARATION_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_PO_FOREX_DECLARATION, O_TABLE => ? )";

		Collection<ResultForexItems> v_result = new ArrayList<>();
        Collection<SavedForexItems> v_inRows = context.getForexItems();
        

         log.info("###111111===="+context.getForexItems()); 
         log.info("###v_inRows.size(===="+v_inRows.size()); 


        ResultSet v_rs = null;
		try {

			Connection conn = jdbc.getDataSource().getConnection();

			// Local Temp Table 생성
			PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
			v_statement_table.execute();

			// Local Temp Table에 insert
			PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

			if(!v_inRows.isEmpty() && v_inRows.size() > 0){
				for(SavedForexItems v_inRow : v_inRows){

					log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getPoNumber()+"###");

					v_statement_insert.setString(1, v_inRow.getTenantId());
					v_statement_insert.setString(2, v_inRow.getCompanyCode());
					v_statement_insert.setString(3, v_inRow.getPoNumber());
					v_statement_insert.setString(4, v_inRow.getForexDeclareStatusCode());
					v_statement_insert.setObject(5, v_inRow.getDeclareScheduledDate());
                    v_statement_insert.setObject(6, v_inRow.getDeclareDate());
					v_statement_insert.setString(7, v_inRow.getAttchGroupNumber());
					v_statement_insert.setString(8, v_inRow.getRemark());
					v_statement_insert.setString(9, v_inRow.getUpdateUserId());                    

					v_statement_insert.addBatch();
				}
				// Temp Table에 Multi건 등록
				v_statement_insert.executeBatch();
			}

			// Procedure Call
			CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
			v_rs = v_statement_proc.executeQuery();
        
            while(v_rs.next()) {
                ResultForexItems v_resultDetail = ResultForexItems.create();
                v_resultDetail.setTenantId(v_rs.getString("TENANT_ID"));
                v_resultDetail.setCompanyCode(v_rs.getString("COMPANY_CODE"));
                v_resultDetail.setPoNumber(v_rs.getString("PO_NUMBER"));
                v_resultDetail.setResultCode(v_rs.getString("RESULT_CODE"));
                v_result.add(v_resultDetail);
            }

            context.setResult(v_result);
            //context.setCompleted();

		} catch (SQLException sqlE) {
			sqlE.printStackTrace();

		} catch (Exception e) {
			e.printStackTrace();

		} finally {
			context.setCompleted();
		}

	}    

}