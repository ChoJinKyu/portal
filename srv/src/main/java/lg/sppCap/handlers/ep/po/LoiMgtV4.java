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

import cds.gen.ep.loimgtv4service.DeleteLoiSupplySelectionProcContext;
import cds.gen.ep.loimgtv4service.HdSaveType;
import cds.gen.ep.loimgtv4service.InputData;
import cds.gen.ep.loimgtv4service.LoiMgtV4Service_;
import cds.gen.ep.loimgtv4service.LssDelType;
import cds.gen.ep.loimgtv4service.SaveLoiQuotationNumberProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiRmkProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiSupplySelectionProcContext;
import cds.gen.ep.loimgtv4service.SaveLoiVosProcContext;
import cds.gen.ep.loimgtv4service.SavedDetails;

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

    //비고 저장
    @On(event = SaveLoiRmkProcContext.CDS_NAME)
    public void onSaveLoiRmkProc(SaveLoiRmkProcContext context) {
        
        log.info("### EP_SAVE_LOI_RMK_PROC 프로시저 호출시작 ###");
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL EP_SAVE_LOI_RMK_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" I_LOI_ITEM_NUMBER => ?, ")
                    .append(" I_REMARK => ?, ")
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
            statement.setString(5, context.getRemark());
            
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

        log.info("### EP_SAVE_LOI_RMK_PROC 프로시저 종료 ###");

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
    
    //LOI 업체선정 품의
    @On(event = SaveLoiSupplySelectionProcContext.CDS_NAME)
    public void onSaveLoiSupplySelectionProc(SaveLoiSupplySelectionProcContext context) {

        log.info("### EP_SAVE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출시작 ###");

        
        HdSaveType v_indata = context.getInputData();
        // Collection<HdSaveType> v_results = new ArrayList<>();

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_SAVE_LOI_SUPPLY_SELECTION ( ")
                            .append("TENANT_ID NVARCHAR(5), ")
                            .append("COMPANY_CODE NVARCHAR(10), ")
                            .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                            .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                        .append(")");
        
        String v_sql_truncateTableD = "TRUNCATE TABLE #LOCAL_TEMP_EP_SAVE_LOI_SUPPLY_SELECTION";        
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
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        StringBuffer strRsltBuf = new StringBuffer();  
        //int uCnt = 0;              

        try {

            Connection conn = jdbc.getDataSource().getConnection();

            // Detail Local Temp Table 생성
            PreparedStatement v_statement_tableD = conn.prepareStatement(v_sql_createTable.toString());
            v_statement_tableD.execute();

            //for(HdSaveType v_indata :  v_inMultiData){

            log.info("###getDetails().size()===="+v_indata.getDetails().size());

            Collection<SavedDetails> v_inDetails = v_indata.getDetails();
            // HdSaveType v_result = HdSaveType.create();
            // Collection<SavedDetails> v_resultDetails = new ArrayList<>();

            log.info("###getTenantId===="+v_indata.getTenantId());
            log.info("###getCompanyCode===="+v_indata.getCompanyCode());
            log.info("###getLoiSelectionNumber11===="+v_indata.getLoiSelectionNumber());
            log.info("###getLoiSelectionNumber22===="+v_indata.get("loi_selection_number"));

            // Detail Local Temp Table에 insert
            PreparedStatement v_statement_insertD = conn.prepareStatement(v_sql_insertTableD);

            if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
                for(SavedDetails v_inRow : v_inDetails){

                    log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getLoiWriteNumber()+"###"+v_inRow.getLoiItemNumber());

                    v_statement_insertD.setObject(1, v_inRow.getTenantId());
                    v_statement_insertD.setObject(2, v_inRow.getCompanyCode());
                    v_statement_insertD.setObject(3, v_inRow.getLoiWriteNumber());
                    v_statement_insertD.setObject(4, v_inRow.getLoiItemNumber());
                    v_statement_insertD.addBatch();
                }
                v_statement_insertD.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
            v_statement_proc.setObject(1, v_indata.get("tenant_id"));
            v_statement_proc.setObject(2, v_indata.get("company_code"));
            v_statement_proc.setObject(3, v_indata.get("loi_selection_number"));
            v_statement_proc.setObject(4, v_indata.get("loi_selection_title"));
            v_statement_proc.setObject(5, v_indata.get("loi_selection_status_code"));
            v_statement_proc.setObject(6, v_indata.get("special_note"));
            v_statement_proc.setObject(7, v_indata.get("attch_group_number"));
            v_statement_proc.setObject(8, v_indata.get("approval_number"));
            v_statement_proc.setObject(9, v_indata.get("buyer_empno"));
            v_statement_proc.setObject(10, v_indata.get("purchasing_department_code"));
            v_statement_proc.setObject(11, v_indata.get("remark"));
            v_statement_proc.setObject(12, v_indata.get("org_type_code"));
            v_statement_proc.setObject(13, v_indata.get("org_code"));
            v_statement_proc.setObject(14, v_indata.get("user_id"));

            int dCnt = v_statement_proc.executeUpdate();
            log.info("###dCnt===="+dCnt);

            // v_result.setDetails(v_resultDetails);
            // v_results.add(v_result);

            // Detail Local Temp Table trunc
            PreparedStatement v_statement_trunc_tableD = conn.prepareStatement(v_sql_truncateTableD);
            v_statement_trunc_tableD.execute();

            //uCnt += dCnt;

            //}

			String rsltMesg = "SUCCESS";

			strRsltBuf.append("{")
					.append("\"rsltCd\":\"000\"")
					.append(", \"rsltMesg\":\""+rsltMesg+"\"")
					.append(", \"rsltCnt\":"+dCnt+"")
					.append("}");

            context.setResult(strRsltBuf.toString());
            log.info("### EP_SAVE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출종료 ###");

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

    //LOI 업체선정 품의 삭제
    @On(event = DeleteLoiSupplySelectionProcContext.CDS_NAME)
    public void onDeleteLoiSupplySelectionProc(DeleteLoiSupplySelectionProcContext context) {

        log.info("### EP_DELETE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출시작 ###");

        
        LssDelType v_indata = context.getInputData();
        // Collection<HdSaveType> v_results = new ArrayList<>();

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION ( ")
                            .append("TENANT_ID NVARCHAR(5), ")
                            .append("COMPANY_CODE NVARCHAR(10), ")
                            .append("LOI_WRITE_NUMBER NVARCHAR(50), ")
                            .append("LOI_ITEM_NUMBER NVARCHAR(50) ")
                        .append(")");
        
        String v_sql_truncateTableD = "TRUNCATE TABLE #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION VALUES (?, ?, ?, ?)";

        v_sql_callProc.append("CALL EP_DELETE_LOI_SUPPLY_SELECTION_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_SELECTION_NUMBER => ?, ")
                    .append(" I_USER_ID => ?, ")
                    .append(" I_TABLE => #LOCAL_TEMP_EP_DELETE_LOI_SUPPLY_SELECTION, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        StringBuffer strRsltBuf = new StringBuffer();  
        //int uCnt = 0;              

        try {

            Connection conn = jdbc.getDataSource().getConnection();

            // Detail Local Temp Table 생성
            PreparedStatement v_statement_tableD = conn.prepareStatement(v_sql_createTable.toString());
            v_statement_tableD.execute();

            //for(HdSaveType v_indata :  v_inMultiData){

            log.info("###getDetails().size()===="+v_indata.getDetails().size());

            Collection<SavedDetails> v_inDetails = v_indata.getDetails();
            // HdSaveType v_result = HdSaveType.create();
            // Collection<SavedDetails> v_resultDetails = new ArrayList<>();

            log.info("###getTenantId===="+v_indata.getTenantId());
            log.info("###getCompanyCode===="+v_indata.getCompanyCode());
            log.info("###getLoiSelectionNumber11===="+v_indata.getLoiSelectionNumber());
            log.info("###getLoiSelectionNumber22===="+v_indata.get("loi_selection_number"));

            // Detail Local Temp Table에 insert
            PreparedStatement v_statement_insertD = conn.prepareStatement(v_sql_insertTableD);

            if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
                for(SavedDetails v_inRow : v_inDetails){

                    log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getLoiWriteNumber()+"###"+v_inRow.getLoiItemNumber());

                    v_statement_insertD.setObject(1, v_inRow.getTenantId());
                    v_statement_insertD.setObject(2, v_inRow.getCompanyCode());
                    v_statement_insertD.setObject(3, v_inRow.getLoiWriteNumber());
                    v_statement_insertD.setObject(4, v_inRow.getLoiItemNumber());
                    v_statement_insertD.addBatch();
                }
                v_statement_insertD.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
            v_statement_proc.setObject(1, v_indata.get("tenant_id"));
            v_statement_proc.setObject(2, v_indata.get("company_code"));
            v_statement_proc.setObject(3, v_indata.get("loi_selection_number"));
            v_statement_proc.setObject(4, v_indata.get("user_id"));

            int dCnt = v_statement_proc.executeUpdate();
            log.info("###dCnt===="+dCnt);

            // v_result.setDetails(v_resultDetails);
            // v_results.add(v_result);

            // Detail Local Temp Table trunc
            PreparedStatement v_statement_trunc_tableD = conn.prepareStatement(v_sql_truncateTableD);
            v_statement_trunc_tableD.execute();

            //uCnt += dCnt;

            //}

			String rsltMesg = "SUCCESS";

			strRsltBuf.append("{")
					.append("\"rsltCd\":\"000\"")
					.append(", \"rsltMesg\":\""+rsltMesg+"\"")
					.append(", \"rsltCnt\":"+dCnt+"")
					.append("}");

            context.setResult(strRsltBuf.toString());
            log.info("### EP_DELETE_LOI_SUPPLY_SELECTION_PROC 프로시저 호출종료 ###");

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