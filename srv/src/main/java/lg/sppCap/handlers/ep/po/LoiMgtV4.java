package lg.sppCap.handlers.ep.po;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collection;
import java.util.stream.Stream;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.transaction.annotation.Transactional;

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
import cds.gen.ep.loimgtv4service.SavedHeaders;
import cds.gen.ep.loimgtv4service.SavedReqDetails;
import cds.gen.ep.loimgtv4service.SaveReturnType;
import cds.gen.ep.loimgtv4service.SaveLoiRequestMultiEntitylProcContext;
//import cds.gen.ep.loimgtv4service.DeleteDetails;
import cds.gen.ep.loimgtv4service.ReqMulDelType;
//import cds.gen.ep.loimgtv4service.ReqDelType;
import cds.gen.ep.loimgtv4service.DeleteLoiMulEntityProcContext;
import cds.gen.ep.loimgtv4service.SavedSuppliers;
import cds.gen.ep.loimgtv4service.SupplierMulEntityProcContext;


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
									.append("EP_ITEM_CODE NVARCHAR(50), ")
									.append("ITEM_DESC NVARCHAR(200), ")
                                    .append("UNIT NVARCHAR(3), ")
                                    .append("REQUEST_QUANTITY DECIMAL, ")
                                    .append("CURRENCY_CODE NVARCHAR(15), ")
                                    .append("REQUEST_AMOUNT DECIMAL, ")
                                    .append("SUPPLIER_CODE NVARCHAR(100), ") 
                                    .append("BUYER_EMPNO NVARCHAR(30), ")
                                    .append("REMARK NVARCHAR(3000), ")
                                    .append("ROW_STATE NVARCHAR(5) ")
                                .append(")");   


        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_H";
        String v_sql_dropableD = "DROP TABLE #LOCAL_TEMP_D";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_H VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String v_sql_callProc = "CALL EP_PO_LOI_REQUEST_HD_SAVE_PROC(I_H_TABLE => #LOCAL_TEMP_H, I_D_TABLE => #LOCAL_TEMP_D, O_D_TABLE => ?)";

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
                    v_inRow.get("ep_item_code"),
                    v_inRow.get("item_desc"),
                    v_inRow.get("unit"),
                    v_inRow.get("request_quantity"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("request_amount"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("buyer_empno"),
                    v_inRow.get("remark"),
                    v_inRow.get("row_state")
                };
                batchD.add(values);
            }
        } 

        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);

        boolean delFlag = false;

        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_D_TABLE", new RowMapper<SavedReqDetails>(){
            @Override
            public SavedReqDetails mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedReqDetails v_row = SavedReqDetails.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setLoiWriteNumber(v_rs.getString("loi_write_number"));
                v_row.setLoiItemNumber(v_rs.getString("loi_item_number"));
                v_row.setItemSequence(v_rs.getString("item_sequence"));
                v_row.setEpItemCode(v_rs.getString("ep_item_code"));
                v_row.setItemDesc(v_rs.getString("item_desc"));
                v_row.setUnit(v_rs.getString("unit"));
                v_row.setRequestQuantity(v_rs.getString("request_quantity"));
                v_row.setCurrencyCode(v_rs.getString("currency_code"));
                v_row.setRequestAmount(v_rs.getString("request_amount"));
                v_row.setSupplierCode(v_rs.getString("supplier_code"));
                v_row.setBuyerEmpno(v_rs.getString("buyer_empno"));
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultD.add(v_row);
                return v_row;
            }
        });

        
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
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
    @On(event = DeleteLoiMulEntityProcContext.CDS_NAME)
    public void onDeleteLoiMulEntityProc(DeleteLoiMulEntityProcContext context) {

        log.info("### EP_PO_LOI_REQUEST_HD_DELETE_PROC 프로시저 호출시작 ###");
        
        ReqMulDelType v_indata = context.getInputData();
        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_callProc.append("CALL EP_PO_LOI_REQUEST_HD_DELETE_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        StringBuffer strRsltBuf = new StringBuffer();  
 
        try {

            Connection conn = jdbc.getDataSource().getConnection();

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
            v_statement_proc.setObject(1, v_indata.get("tenant_id"));
            v_statement_proc.setObject(2, v_indata.get("company_code"));
            v_statement_proc.setObject(3, v_indata.get("loi_write_number"));

            int dCnt = v_statement_proc.executeUpdate();
            log.info("###dCnt===="+dCnt);

			String rsltMesg = "SUCCESS";

			strRsltBuf.append("{")
					.append("\"rsltCd\":\"000\"")
					.append(", \"rsltMesg\":\""+rsltMesg+"\"")
					.append(", \"rsltCnt\":"+dCnt+"")
					.append("}");

            context.setResult(strRsltBuf.toString());
            log.info("### EP_PO_LOI_REQUEST_HD_DELETE_PROC 프로시저 호출종료 ###");

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


    @On(event = SupplierMulEntityProcContext.CDS_NAME)    
    public void onSupplierMulEntityProc(SupplierMulEntityProcContext context) {

		log.info("### EP_PO_SUPPLIER_SAVE_PROC 프로시저 호출시작 ###");

		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("LOI_WRITE_NUMBER NVARCHAR(50), ")
									.append("LOI_ITEM_NUMBER NVARCHAR(50), ")
									.append("SUPPLIER_CODE NVARCHAR(15) ")
								.append(")");

		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE VALUES (?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL EP_PO_SUPPLIER_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_PO_SUPPLIER_SAVE, O_RTN_MSG => ? )";

		String v_result = "";
		Collection<SavedSuppliers> v_inRows = context.getInputData();
        StringBuffer strRsltBuf = new StringBuffer();

		try {

			Connection conn = jdbc.getDataSource().getConnection();

			// Local Temp Table 생성
			PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
			v_statement_table.execute();

			// Local Temp Table에 insert
			PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

			if(!v_inRows.isEmpty() && v_inRows.size() > 0){
				for(SavedSuppliers v_inRow : v_inRows){

					log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getLoiWriteNumber()+"###"+v_inRow.getLoiItemNumber()+"###"+v_inRow.getSupplierCode());

                    v_statement_insert.setString(1, v_inRow.getTenantId());
	 				v_statement_insert.setString(2, v_inRow.getCompanyCode());
	 				v_statement_insert.setString(3, v_inRow.getLoiWriteNumber());
	 				v_statement_insert.setString(4, v_inRow.getLoiItemNumber());
                    v_statement_insert.setString(5, v_inRow.getSupplierCode());
                     

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