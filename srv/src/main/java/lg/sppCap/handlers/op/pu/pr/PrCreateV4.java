package lg.sppCap.handlers.op.pu.pr;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;
import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
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
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.Insert;

import lg.sppCap.util.StringUtil;

import cds.gen.op.prcreatev4service.*;

@Component
@ServiceName(PrCreateV4Service_.CDS_NAME)
public class PrCreateV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    // Procedure 호출해서 header/Detail 저장
    // (단일 Header에 multi Detail) 가 multi
    /*********************************
    {
        "inputData": [
            {
                "header_id" : 103,
                "cd" : "CD103",
                "name": "NAME103",
                "details": [
                    {"detail_id" : 1003, "header_id" : 103, "cd" : "CD1003", "name": "NAME1003"},
                    {"detail_id" : 1004, "header_id" : 103, "cd" : "CD1004", "name": "NAME1004"}
                ]
            },
            {
                "header_id" : 104,
                "cd" : "CD104",
                "name": "NAME104",
                "details": [
                    {"detail_id" : 1005, "header_id" : 104, "cd" : "CD1003", "name": "NAME1005"},
                    {"detail_id" : 1006, "header_id" : 104, "cd" : "CD1004", "name": "NAME1006"}
                ]
            }
        ]
    }
    *********************************/

    @On(event = SavePrCreateProcContext.CDS_NAME)
    public void onSavePrCreateProc(SavePrCreateProcContext context) {

        System.out.println("#################### onSavePrCreateProc START ");

        Collection<PrCreateSaveType> v_inMultiData = context.getInputData();
        Collection<OutType> v_result = new ArrayList<>();

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        //String v_sql_createTableD = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (DETAIL_ID BIGINT, HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        //String v_sql_truncateTableD = "TRUNCATE TABLE #LOCAL_TEMP_D";        
        //String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?)";
        //String v_sql_callProc = "CALL OP_PU_PR_CREATE_SAVE_PROC(HEADER_ID => ?, CD => ?, NAME => ?, I_D_TABLE => #LOCAL_TEMP_D, O_H_TABLE => ?, O_D_TABLE => ?)";
        
        StringBuffer v_sql_createTableM = new StringBuffer();
        v_sql_createTableM.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_M (")    
        .append("TENANT_ID NVARCHAR(5),")
        .append("COMPANY_CODE NVARCHAR(10),")
        .append("PR_NUMBER NVARCHAR(50),")
        .append("PR_TYPE_CODE NVARCHAR(30),")
        .append("PR_TYPE_CODE_2 NVARCHAR(30),")
        .append("PR_TYPE_CODE_3 NVARCHAR(40),")
        .append("PR_TEMPLATE_NUMBER NVARCHAR(10),")
        .append("PR_CREATE_SYSTEM_CODE NVARCHAR(30),")
        .append("PR_DESC NVARCHAR(100),")
        .append("UPDATE_USER_ID NVARCHAR(255)")
        .append(")");   
        
        StringBuffer v_sql_createTableD = new StringBuffer();
        v_sql_createTableD.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (")    
        .append("TENANT_ID NVARCHAR(5),")
        .append("COMPANY_CODE NVARCHAR(10),")
        .append("PR_NUMBER NVARCHAR(50),")
        .append("PR_ITEM_NUMBER NVARCHAR(10),")
        .append("ORG_TYPE_CODE NVARCHAR(2), ")
		.append("ORG_CODE NVARCHAR(10), ")
		.append("MATERIAL_CODE NVARCHAR(40), ")
		.append("MATERIAL_GROUP_CODE NVARCHAR(10),")
		.append("PR_DESC NVARCHAR(100),")
		.append("PR_QUANTITY NVARCHAR(34),")
		.append("PR_UNIT NVARCHAR(3),")
        .append("UPDATE_USER_ID NVARCHAR(255)")
        .append(")"); 


        String v_sql_truncateTableM = "TRUNCATE TABLE #LOCAL_TEMP_M";   
        String v_sql_truncateTableD = "TRUNCATE TABLE #LOCAL_TEMP_D";  

        String v_sql_insertTableM = "INSERT INTO #LOCAL_TEMP_M VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";        
        

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL OP_PU_PR_CREATE_SAVE_PROC ( ")
        .append("I_TENANT_ID => ?, ")
        .append("I_COMPANY_CODE => ?, ")
        .append("I_PR_NUMBER => ?, ")
        .append("I_M_TABLE => #LOCAL_TEMP_M, ")
        .append("I_D_TABLE => #LOCAL_TEMP_D, ")
        .append("O_RTN_MSG => ? ")
        .append(")"); 


        ResultSet v_rs = null;
        
        try {
            Connection conn = jdbc.getDataSource().getConnection();

            // Master Local Temp Table 생성
			PreparedStatement v_statement_tableM = conn.prepareStatement(v_sql_createTableM.toString());
            v_statement_tableM.execute();

            // Detail Local Temp Table 생성
			PreparedStatement v_statement_tableD = conn.prepareStatement(v_sql_createTableD.toString());
            v_statement_tableD.execute();
                        
            // Master Local Temp Table에 insert
			PreparedStatement v_statement_insertM = conn.prepareStatement(v_sql_insertTableM);

            // Data insert
            if(!v_inMultiData.isEmpty() && v_inMultiData.size() > 0){
                for(PrCreateSaveType v_indata : v_inMultiData) {
                    // Master Local Temp Table에 insert            
                    v_statement_insertM.setString(1, (String)v_indata.get("tenant_id"));
                    v_statement_insertM.setString(2, (String)v_indata.get("company_code"));
                    v_statement_insertM.setString(3, (String)v_indata.get("pr_number"));
                    v_statement_insertM.setString(4, (String)v_indata.get("pr_type_code"));
                    v_statement_insertM.setString(5, (String)v_indata.get("pr_type_code_2"));
                    v_statement_insertM.setString(6, (String)v_indata.get("pr_type_code_3"));
                    v_statement_insertM.setString(7, (String)v_indata.get("pr_template_number"));
                    v_statement_insertM.setString(8, (String)v_indata.get("pr_create_system_code"));
                    v_statement_insertM.setString(9, v_indata.getPrDesc());
                    v_statement_insertM.setString(10, "A60264");
                    v_statement_insertM.execute();

                    // Detail Local Temp Table에 insert
                    PreparedStatement v_statement_insertD = conn.prepareStatement(v_sql_insertTableD);

                    Collection<SavedDetail> v_inDetails = v_indata.getDetails();
                    if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
                        for(SavedDetail v_inRow : v_inDetails){

                            //log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getLoiWriteNumber()+"###"+v_inRow.getLoiItemNumber());

                            v_statement_insertD.setObject(1, v_inRow.getTenantId());
                            v_statement_insertD.setObject(2, v_inRow.getCompanyCode());
                            v_statement_insertD.setObject(3, v_inRow.getPrNumber());
                            v_statement_insertD.setObject(4, v_inRow.getPrItemNumber());
                            v_statement_insertD.setObject(5, v_inRow.getOrgTypeCode());
                            v_statement_insertD.setObject(6, v_inRow.getOrgCode());
                            v_statement_insertD.setObject(7, v_inRow.getMaterialCode());
                            v_statement_insertD.setObject(8, v_inRow.getMaterialGroupCode());
                            v_statement_insertD.setObject(9, v_inRow.getPrDesc());
                            v_statement_insertD.setObject(10, v_inRow.getPrQuantity());
                            v_statement_insertD.setObject(11, v_inRow.getPrUnit());
                            v_statement_insertD.setObject(12, "A60264");
                            v_statement_insertD.addBatch();
                        }
                        v_statement_insertD.executeBatch();
                    }
                    
                    log.info("###"+v_indata.getTenantId()+"###"+v_indata.getCompanyCode()+"###"+v_indata.getPrNumber());


                    // Procedure Call
                    CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
                    v_statement_proc.setObject(1, v_indata.getTenantId());
                    v_statement_proc.setObject(2, v_indata.getCompanyCode());
                    v_statement_proc.setObject(3, v_indata.getPrNumber());
                    v_rs = v_statement_proc.executeQuery();

                    // Master Local Temp Table trunc
                    PreparedStatement v_statement_trunc_tableM = conn.prepareStatement(v_sql_truncateTableM);
                    v_statement_trunc_tableM.execute();

                    // Detail Local Temp Table trunc
                    PreparedStatement v_statement_trunc_tableD = conn.prepareStatement(v_sql_truncateTableD);
                    v_statement_trunc_tableD.execute();


                    // Procedure Out put
                    while (v_rs.next()){
                        OutType v_out = OutType.create();
                        //System.out.println("return_code:::"+v_rs.getString("return_code"));
                        //System.out.println("return_msg:::"+v_rs.getString("return_msg"));
                        v_out.setReturnCode(v_rs.getString("return_code"));
                        v_out.setReturnMsg(v_rs.getString("return_msg"));                
                        v_result.add(v_out);
                    }
                }

                context.setResult(v_result);
                context.setCompleted();
            }

            // for(PrCreateSaveType v_indata : v_inMultiData) {
            //     Collection<SavedDetail> v_inDetails = v_indata.getDetails();
                                
            //     v_statement_insert.setLong(7, v_inRow.getSpmdCharacterSerialNo());

            //     v_indata.getTenantId()

            //     System.out.println("#################### v_indata.tenant_id : " + v_indata.get("tenant_id"));
            //     System.out.println("#################### v_indata.company_code : " + v_indata.get("company_code"));
            //     System.out.println("#################### v_indata.pr_number : " + v_indata.get("pr_number"));
            // }
            

            /*
            // Detail Local Temp Table 생성
            PreparedStatement v_statement_tableD = conn.prepareStatement(v_sql_createTableD);
            v_statement_tableD.execute();

            for(HdSaveType v_indata :  v_inMultiData){

                Collection<SavedDetails> v_inDetails = v_indata.getDetails();
                HdSaveType v_result = HdSaveType.create();
                Collection<SavedDetails> v_resultDetails = new ArrayList<>();

                // Detail Local Temp Table에 insert
                PreparedStatement v_statement_insertD = conn.prepareStatement(v_sql_insertTableD);

                if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
                    for(SavedDetails v_inRow : v_inDetails){
                        v_statement_insertD.setObject(1, v_inRow.get("detail_id"));
                        v_statement_insertD.setObject(2, v_inRow.get("header_id"));
                        v_statement_insertD.setObject(3, v_inRow.get("cd"));
                        v_statement_insertD.setObject(4, v_inRow.get("name"));
                        v_statement_insertD.addBatch();
                    }
                    v_statement_insertD.executeBatch();
                }

                // Procedure Call
                CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
                v_statement_proc.setObject(1, v_indata.get("header_id"));
                v_statement_proc.setObject(2, v_indata.get("cd"));
                v_statement_proc.setObject(3, v_indata.get("name"));

                boolean v_isMore = v_statement_proc.execute();
                int v_resultSetNo = 0;

                // Procedure Out put 담기
                while(v_isMore){
                    ResultSet v_rs = v_statement_proc.getResultSet();

                    while (v_rs.next()){
                        if(v_resultSetNo == 0){
                            v_result.setHeaderId(v_rs.getLong("header_id"));
                            v_result.setCd(v_rs.getString("cd"));
                            v_result.setName(v_rs.getString("name"));
                        }else if(v_resultSetNo == 1){
                            SavedDetails v_resultDetail = SavedDetails.create();
                            v_resultDetail.setDetailId(v_rs.getLong("detail_id"));
                            v_resultDetail.setHeaderId(v_rs.getLong("header_id"));
                            v_resultDetail.setCd(v_rs.getString("cd"));
                            v_resultDetail.setName(v_rs.getString("name"));
                            v_resultDetails.add(v_resultDetail);
                        }
                    }

                    v_isMore = v_statement_proc.getMoreResults();
                    v_resultSetNo++;
                }

                v_result.setDetails(v_resultDetails);
                v_results.add(v_result);

                // Detail Local Temp Table trunc
                PreparedStatement v_statement_trunc_tableD = conn.prepareStatement(v_sql_truncateTableD);
                v_statement_trunc_tableD.execute();
            }

            context.setResult(v_results);
            context.setCompleted();
            */


		} catch (SQLException sqle) { 
            sqle.printStackTrace();
			log.error("##### ErrCode : "+sqle.getErrorCode());
		    log.error("##### ErrMesg : "+sqle.getMessage());
                        
            OutType v_out = OutType.create();
            v_out.setReturnCode(sqle.getErrorCode()+"");
            v_out.setReturnMsg(sqle.getMessage());                
            v_result.add(v_out);
            context.setResult(v_result);
            context.setCompleted();
        } finally {            
            
        }
    }

}