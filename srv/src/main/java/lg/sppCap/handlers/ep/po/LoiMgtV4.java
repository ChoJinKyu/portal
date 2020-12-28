package lg.sppCap.handlers.ep.po;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Collection;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.ep.loimgtv4service.InputData;
import cds.gen.ep.loimgtv4service.LoiMgtV4Service_;
import cds.gen.ep.loimgtv4service.SaveLoiQuotationNumberProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiVosProcContext;

@Component
@ServiceName(LoiMgtV4Service_.CDS_NAME)
public class LoiMgtV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;
    

    // Procedure 호출해서 header 저장
    /*********************************
    {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"1", "supplier_opinion":"기타의견"}    
    *********************************/
    @On(event = SaveLoiVosProcContext.CDS_NAME)
    public void onSaveLoiVosProc(SaveLoiVosProcContext context) {
        
        log.info("### EP_SAVE_LOI_VOS_PROC 프로시저 호출시작 ###");
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL EP_SAVE_LOI_VOS_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" I_LOI_ITEM_NUMBER => ?, ")
                    .append(" I_SUPPLIER_OPINION => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        //ResultSet v_rs = null;
        StringBuffer strRsltBuf = new StringBuffer();
		try {
            
            Connection conn = jdbc.getDataSource().getConnection();
            CallableStatement statement = jdbc.getDataSource().getConnection().prepareCall(v_sql.toString());
            
            statement.setString(1, context.getTenantId());
            statement.setString(2, context.getCompanyCode());
            statement.setString(3, context.getLoiWriteNumber());
            statement.setString(4, context.getLoiItemNumber());
            statement.setString(5, context.getSupplierOpinion());
            
            int iCnt = statement.executeUpdate();

			String rsltMesg = "SUCCESS";

			strRsltBuf.append("{")
					.append("\"rsltCd\":\"000\"")
					.append(", \"rsltMesg\":\""+rsltMesg+"\"")
					.append(", \"rsltCnt\":"+iCnt+"")
					.append("}");

			context.setResult(strRsltBuf.toString());

		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			context.setResult("{\"rsltCd\":\"999\", \"rsltMesg\":\"SQLException Fail...\"}");
		} catch (Exception e) {
			e.printStackTrace();
			context.setResult("{\"rsltCd\":\"999\", \"rsltMesg\":\"Exception Fail...\"}");
		} finally {
			context.setCompleted();
		}

        log.info("### EP_SAVE_LOI_VOS_PROC 프로시저 종료 ###");

    }

	// 
	@On(event=SaveLoiQuotationNumberProcContext.CDS_NAME)
	public void onSaveLoiQuotationNumberProc(SaveLoiQuotationNumberProcContext context) {

		log.info("### EP_SAVE_LOI_QUOTATION_NUMBER_PROC 프로시저 호출시작 ###");

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

		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_EP_SAVE_LOI_QUOTATION_NUMBER VALUES (?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL EP_SAVE_LOI_QUOTATION_NUMBER_PROC( I_TABLE => #LOCAL_TEMP_EP_SAVE_LOI_QUOTATION_NUMBER, O_RTN_MSG => ? )";

		String v_result = "";
		Collection<InputData> v_inRows = context.getInputData();
		StringBuffer strRsltBuf = new StringBuffer();

		try {

			Connection conn = jdbc.getDataSource().getConnection();

			// Local Temp Table 생성
			PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
			v_statement_table.execute();

			// Local Temp Table에 insert
			PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

			if(!v_inRows.isEmpty() && v_inRows.size() > 0){
				for(InputData v_inRow : v_inRows){

					log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getLoiWriteNumber()+"###"+v_inRow.getLoiItemNumber()+"###"+v_inRow.getQuotationNumber()+"###"+v_inRow.getQuotationItemNumber());

					v_statement_insert.setString(1, v_inRow.getTenantId());
					v_statement_insert.setString(2, v_inRow.getCompanyCode());
					v_statement_insert.setString(3, v_inRow.getLoiWriteNumber());
					v_statement_insert.setString(4, v_inRow.getLoiItemNumber());
					v_statement_insert.setString(5, v_inRow.getQuotationNumber());
					v_statement_insert.setString(6, v_inRow.getQuotationItemNumber());

					//v_statement_insert.executeUpdate();
					v_statement_insert.addBatch();
				}
				// Temp Table에 Multi건 등록
				v_statement_insert.executeBatch();
			}

			// Procedure Call
			CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
			//ResultSet v_rs = v_statement_proc.executeQuery();
			int iCnt = v_statement_proc.executeUpdate();
			String rsltMesg = "SUCCESS";

			strRsltBuf.append("{")
					.append("\"rsltCd\":\"000\"")
					.append(", \"rsltMesg\":\""+rsltMesg+"\"")
					.append(", \"rsltCnt\":"+iCnt+"")
					.append("}");

			context.setResult(strRsltBuf.toString());

		} catch (SQLException sqlE) {
			sqlE.printStackTrace();
			context.setResult("{\"rsltCd\":\"999\", \"rsltMesg\":\"SQLException Fail...\"}");
		} catch (Exception e) {
			e.printStackTrace();
			context.setResult("{\"rsltCd\":\"999\", \"rsltMesg\":\"Exception Fail...\"}");
		} finally {
			context.setCompleted();
		}

	}    

}