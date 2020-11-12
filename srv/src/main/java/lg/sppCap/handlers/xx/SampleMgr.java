package lg.sppCap.handlers.xx;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.xx.samplemgrservice.*;

@Component
@ServiceName("xx.SampleMgrService")
public class SampleMgr implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    /*
    @On(event = CdsService.EVENT_CREATE, entity=SampleHeaders_.CDS_NAME)
    public void onCreateCodeMasters(CdsCreateEventContext context) {

    
    }
    */

    // Procedure 호출해서 header 저장
    // Header Multi Row
    @On(event = SaveSampleHeaderMultiProcContext.CDS_NAME)
    public void onSaveSampleHeaderMultiProc(SaveSampleHeaderMultiProcContext context) {
        
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        String v_sql_createTable = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP (HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP VALUES (?, ?, ?)";
        String v_sql_callProc = "CALL XX_SAMPLE_HEADER_SAVE_PROC(I_TABLE => #LOCAL_TEMP, O_TABLE => ?)";

        Collection<SampleHeaders> v_result = new ArrayList<>();
        Collection<SampleHeaders> v_inHeaders = context.getSampleHeaders();

        ResultSet v_rs = null;


		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable);
            v_statement_table.execute();

            // Local Temp Table에 insert
            PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

            if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
                for(SampleHeaders v_inRow : v_inHeaders){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_statement_insert.setObject(1, v_inRow.get("header_id"));
                    v_statement_insert.setObject(2, v_inRow.get("cd"));
                    v_statement_insert.setObject(3, v_inRow.get("name"));
                    v_statement_insert.addBatch();
                }

                v_statement_insert.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            while (v_rs.next()){
                SampleHeaders v_row = SampleHeaders.create();
                v_row.setHeaderId(v_rs.getLong("header_id"));
                v_row.setCd(v_rs.getString("cd"));
                v_row.setName(v_rs.getString("name"));
                v_result.add(v_row);
            }

            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }

    }


    // Procedure 호출해서 header/Detail 저장
    // Header, Detail 둘다 multi

    @On(event = SaveSampleMultiEnitylProcContext.CDS_NAME)
    public void onSaveSampleMultiEnitylProc(SaveSampleMultiEnitylProcContext context) {

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        String v_sql_createTableH = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_H (HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        String v_sql_createTableD = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (DETAIL_ID BIGINT, HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_H VALUES (?, ?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?)";

        String v_sql_callProc = "CALL XX_SAMPLE_HD_SAVE_PROD(I_H_TABLE => #LOCAL_TEMP_H, I_D_TABLE => #LOCAL_TEMP_D, O_H_TABLE => ?, O_D_TABLE => ?)";

        Collection<XxSampleMgrServiceSaveReturnTypeSavedHeaders> v_inHeaders = context.getInputData().getSavedHeaders();
        Collection<XxSampleMgrServiceSaveReturnTypeSavedDetails> v_inDetails = context.getInputData().getSavedDetails();

        SaveReturnType v_result = SaveReturnType.create();
        Collection<XxSampleMgrServiceSaveReturnTypeSavedHeaders> v_resultH = new ArrayList<>();
        Collection<XxSampleMgrServiceSaveReturnTypeSavedDetails> v_resultD = new ArrayList<>();

		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Header Local Temp Table 생성
            PreparedStatement v_statement_tableH = conn.prepareStatement(v_sql_createTableH);
            v_statement_tableH.execute();

            // Header Local Temp Table에 insert
            PreparedStatement v_statement_insertH = conn.prepareStatement(v_sql_insertTableH);

            if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
                for(XxSampleMgrServiceSaveReturnTypeSavedHeaders v_inRow : v_inHeaders){
                    v_statement_insertH.setObject(1, v_inRow.get("header_id"));
                    v_statement_insertH.setObject(2, v_inRow.get("cd"));
                    v_statement_insertH.setObject(3, v_inRow.get("name"));
                    v_statement_insertH.addBatch();
                }

                v_statement_insertH.executeBatch();
            }

            // Detail Local Temp Table 생성
            PreparedStatement v_statement_tableD = conn.prepareStatement(v_sql_createTableD);
            v_statement_tableD.execute();

            // Detail Local Temp Table에 insert
            PreparedStatement v_statement_insertD = conn.prepareStatement(v_sql_insertTableD);

            if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
                for(XxSampleMgrServiceSaveReturnTypeSavedDetails v_inRow : v_inDetails){
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
            boolean v_isMore = v_statement_proc.execute();
            int v_resultSetNo = 0;

            // Procedure Out put 담기
            while(v_isMore){
                ResultSet v_rs = v_statement_proc.getResultSet();

                while (v_rs.next()){
                    if(v_resultSetNo == 0){
                        XxSampleMgrServiceSaveReturnTypeSavedHeaders v_rowH = XxSampleMgrServiceSaveReturnTypeSavedHeaders.create();
                        v_rowH.setHeaderId(v_rs.getLong("header_id"));
                        v_rowH.setCd(v_rs.getString("cd"));
                        v_rowH.setName(v_rs.getString("name"));
                        v_resultH.add(v_rowH);

                    }else if(v_resultSetNo == 1){
                        XxSampleMgrServiceSaveReturnTypeSavedDetails v_rowD = XxSampleMgrServiceSaveReturnTypeSavedDetails.create();
                        v_rowD.setDetailId(v_rs.getLong("detail_id"));
                        v_rowD.setHeaderId(v_rs.getLong("header_id"));
                        v_rowD.setCd(v_rs.getString("cd"));
                        v_rowD.setName(v_rs.getString("name"));
                        v_resultD.add(v_rowD);
                    }
                }

                v_isMore = v_statement_proc.getMoreResults();
                v_resultSetNo++;
            }

            v_result.setSavedHeaders(v_resultH);
            v_result.setSavedDetails(v_resultD);
            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }

    }

    // Procedure 호출해서 header/Detail 저장
    // (단일 Header에 multi Detail) 가 multi
    @On(event = SaveSampleHeaderDetailProcContext.CDS_NAME)
    public void onSaveSampleHeaderDetailProc(SaveSampleHeaderDetailProcContext context) {

        Collection<HdSaveType> v_inMultiData = context.getInputData();
        Collection<HdSaveType> v_results = new ArrayList<>();

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        String v_sql_createTableD = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (DETAIL_ID BIGINT, HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        String v_sql_truncateTableD = "TRUNCATE TABLE #LOCAL_TEMP_D";        
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?)";
        String v_sql_callProc = "CALL XX_SAMPLE_H_D_SAVE_PROC(HEADER_ID => ?, CD => ?, NAME => ?, I_D_TABLE => #LOCAL_TEMP_D, O_H_TABLE => ?, O_D_TABLE => ?)";

        try {
            Connection conn = jdbc.getDataSource().getConnection();

            // Detail Local Temp Table 생성
            PreparedStatement v_statement_tableD = conn.prepareStatement(v_sql_createTableD);
            v_statement_tableD.execute();

            for(HdSaveType v_indata :  v_inMultiData){

                Collection<XxSampleMgrServiceHdSaveTypeDetails> v_inDetails = v_indata.getDetails();
                HdSaveType v_result = HdSaveType.create();
                Collection<XxSampleMgrServiceHdSaveTypeDetails> v_resultDetails = new ArrayList<>();

                // Detail Local Temp Table에 insert
                PreparedStatement v_statement_insertD = conn.prepareStatement(v_sql_insertTableD);

                if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
                    for(XxSampleMgrServiceHdSaveTypeDetails v_inRow : v_inDetails){
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
                            XxSampleMgrServiceHdSaveTypeDetails v_resultDetail = XxSampleMgrServiceHdSaveTypeDetails.create();
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

		} catch (SQLException e) { 
			e.printStackTrace();
        }

    }

    /*
    @On(event = CdsService.EVENT_READ, entity=SampleHeaders_.CDS_NAME)
    public void onReadCodeMasters(EventContext context) {

    
    }

    @On(event = CdsService.EVENT_READ, entity=SampleHeaders_.CDS_NAME)
    public void onReadCodeMaster2s(CdsReadEventContext context) {

    
    }
    */


}