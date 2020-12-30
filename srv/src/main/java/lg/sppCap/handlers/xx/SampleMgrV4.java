package lg.sppCap.handlers.xx;


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

import cds.gen.xx.samplemgrv4service.*;
import cds.gen.xx.samplemgrservice.*;

@Component
@ServiceName(SampleMgrV4Service_.CDS_NAME)
public class SampleMgrV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(SampleMgrService_.CDS_NAME)
    private CdsService sampleMgrService;

    // Procedure 호출해서 header 저장
    // Header Multi Row
    /*********************************
    {
        "sampleHeaders" : [
            {"header_id" : 106, "cd": "eeee11", "name": "eeee11"},
            {"header_id" : 107, "cd": "eeee12", "name": "eeee12"}
        ]
    }
    *********************************/


    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveSampleHeaderMultiProcContext.CDS_NAME)
    public void onSaveSampleHeaderMultiProc(SaveSampleHeaderMultiProcContext context) {

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        String v_sql_createTable = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP (HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP";
        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP VALUES (?, ?, ?)";
        String v_sql_callProc = "CALL XX_SAMPLE_HEADER_SAVE_PROC(I_TABLE => #LOCAL_TEMP, O_TABLE => ?)";

        Collection<SavedHeaders> v_result = new ArrayList<>();
        Collection<SavedHeaders> v_inHeaders = context.getSampleHeaders();

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable);
    
        // Local Temp Table에 insert
        List<Object[]> batch = new ArrayList<Object[]>();
        if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
            for(SavedHeaders v_inRow : v_inHeaders){
                Object[] values = new Object[] {
                    v_inRow.get("header_id"),
                    v_inRow.get("cd"),
                    v_inRow.get("name")};
                batch.add(values);
            }
        }

        int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);
       
        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<SavedHeaders>(){
            @Override
            public SavedHeaders mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedHeaders v_row = SavedHeaders.create();
                v_row.setHeaderId(v_rs.getLong("header_id"));
                v_row.setCd(v_rs.getString("cd"));
                v_row.setName(v_rs.getString("name"));
                v_result.add(v_row);
                return v_row;
            }
        });
        
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                return callableStatement;
            }
        }, paramList);

        /*
        jdbc.query(v_sql_callProc,  new RowMapper<SavedHeaders>(){
            @Override
            public SavedHeaders mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedHeaders v_row = SavedHeaders.create();
                v_row.setHeaderId(v_rs.getLong("header_id"));
                v_row.setCd(v_rs.getString("cd"));
                v_row.setName(v_rs.getString("name"));
                v_result.add(v_row);
                return v_row;
            }
        });
        */

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropable);

        context.setResult(v_result);
        context.setCompleted();


    }
    
    // Procedure 호출해서 header/Detail 저장
    // Header, Detail 둘다 multi
    /*********************************
    {
        "inputData" : {
            "savedHeaders" : [
                {"header_id" : 108, "cd": "eeee1122222", "name": "eeee11"},
                {"header_id" : 109, "cd": "eeee1222222", "name": "eeee12"}
            ],
            "savedDetails" : [
                {"detail_id": 1008, "header_id" : 108, "cd": "eeee122221", "name": "eeee11"},
                {"detail_id": 1009, "header_id" : 108, "cd": "eeee122222", "name": "eeee12"},
                {"detail_id": 1010, "header_id" : 109, "cd": "eeee122221", "name": "eeee11"},
                {"detail_id": 1011, "header_id" : 109, "cd": "eeee122222", "name": "eeee12"}
            ]
        }
    }
    *********************************/

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveSampleMultiEnitylProcContext.CDS_NAME)
    public void onSaveSampleMultiEnitylProc(SaveSampleMultiEnitylProcContext context) {

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        String v_sql_createTableH = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_H (HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        String v_sql_createTableD = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_D (DETAIL_ID BIGINT, HEADER_ID BIGINT, CD NVARCHAR(5000), NAME NVARCHAR(5000))";

        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_H";
        String v_sql_dropableD = "DROP TABLE #LOCAL_TEMP_D";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_H VALUES (?, ?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D VALUES (?, ?, ?, ?)";

        String v_sql_callProc = "CALL XX_SAMPLE_HD_SAVE_PROD(I_H_TABLE => #LOCAL_TEMP_H, I_D_TABLE => #LOCAL_TEMP_D, O_H_TABLE => ?, O_D_TABLE => ?)";

        Collection<SavedHeaders> v_inHeaders = context.getInputData().getSavedHeaders();
        Collection<SavedDetails> v_inDetails = context.getInputData().getSavedDetails();

        SaveReturnType v_result = SaveReturnType.create();
        Collection<SavedHeaders> v_resultH = new ArrayList<>();
        Collection<SavedDetails> v_resultD = new ArrayList<>();


        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableH);
        jdbc.execute(v_sql_createTableD);

        // Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
            for(SavedHeaders v_inRow : v_inHeaders){
                Object[] values = new Object[] {
                    v_inRow.get("header_id"),
                    v_inRow.get("cd"),
                    v_inRow.get("name")};
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTableH, batchH);

        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(SavedDetails v_inRow : v_inDetails){
                Object[] values = new Object[] {
                    v_inRow.get("detail_id"),
                    v_inRow.get("header_id"),
                    v_inRow.get("cd"),
                    v_inRow.get("name")};
                batchD.add(values);
            }
        }

        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);

        // Procedure Call
        SqlReturnResultSet oHTable = new SqlReturnResultSet("O_H_TABLE", new RowMapper<SavedHeaders>(){
            @Override
            public SavedHeaders mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedHeaders v_row = SavedHeaders.create();
                v_row.setHeaderId(v_rs.getLong("header_id"));
                v_row.setCd(v_rs.getString("cd"));
                v_row.setName(v_rs.getString("name"));
                v_resultH.add(v_row);
                return v_row;
            }
        });

        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_D_TABLE", new RowMapper<SavedDetails>(){
            @Override
            public SavedDetails mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                SavedDetails v_row = SavedDetails.create();
                v_row.setHeaderId(v_rs.getLong("header_id"));
                v_row.setDetailId(v_rs.getLong("detail_id"));
                v_row.setCd(v_rs.getString("cd"));
                v_row.setName(v_rs.getString("name"));
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
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                return callableStatement;
            }
        }, paramList);


        // Local Temp Table DROP
        jdbc.execute(v_sql_dropableH);
        jdbc.execute(v_sql_dropableD);

        v_result.setSavedHeaders(v_resultH);
        v_result.setSavedDetails(v_resultD);
        context.setResult(v_result);
        context.setCompleted();

    }

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
/*
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

		} catch (SQLException e) { 
			e.printStackTrace();
        }
    }
*/

}