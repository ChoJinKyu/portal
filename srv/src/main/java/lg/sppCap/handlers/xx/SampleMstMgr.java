package lg.sppCap.handlers.xx;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.xx.samplemstmgrservice.InsertProcType;
import cds.gen.xx.samplemstmgrservice.InsertSelectProcContext;
import cds.gen.xx.samplemstmgrservice.InsertSingleProcContext;
import cds.gen.xx.samplemstmgrservice.SampleMasters_;
import cds.gen.xx.samplemstmgrservice.SelectProcContext;
import cds.gen.xx.samplemstmgrservice.SelectProcType;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import javax.sql.DataSource;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

@Component
@ServiceName("xx.SampleMstMgrService")
public class SampleMstMgr implements EventHandler {
/*
	@Autowired
    private PersistenceService db;
    
    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private DataSource dataSource;


    @On(event = SelectProcContext.CDS_NAME)
    public void onSelectProc(SelectProcContext context) {

        Collection<SelectProcType> result = new ArrayList<>();

        String v_sql = "CALL XX_SAMPLE_MASTER_SELECT_PROC(NAME => ?,O_TABLE => ?)";
        ResultSet rs = null;

		try {
 
            CallableStatement statement = jdbc.getDataSource().getConnection().prepareCall(v_sql);
            statement.setString(1, context.getName());
            rs = statement.executeQuery();

            while (rs.next()){
                SelectProcType row = SelectProcType.create();
                row.setMasterId(rs.getLong("master_id"));
                row.setCd(rs.getString("cd"));
                row.setName(rs.getString("name"));
                result.add(row);
            }

            context.setResult(result);
            context.setCompleted();
 
		} catch (SQLException e) { 
			e.printStackTrace();
        }

    }

    @On(event = InsertSingleProcContext.CDS_NAME)
    //@Transactional
    public void onInsertSingleProc(InsertSingleProcContext context) {
        String v_sql = "CALL XX_SAMPLE_MASTER_INSERT_SINGLE_PROC(MASTER_ID => ?,CD => ?,NAME => ?)";

		try {
 
            //CallableStatement statement = DataSourceUtils.getConnection(dataSource).prepareCall(v_sql);
            CallableStatement statement = jdbc.getDataSource().getConnection().prepareCall(v_sql);
            
            statement.setLong(1, context.getMasterId());
            statement.setString(2, context.getCd());
            statement.setString(3, context.getName());
            
            //statement.execute();
            //statement.executeQuery();
            statement.executeUpdate();

            String result = "SUCCESS";

            
            // if (context instanceof CdsCreateEventContext){
            //     context.setResult(result);
            // }else if (context instanceof CdsUpdateEventContext){
            //     context.setResult(result);
            // }else{
            //     context.put("result", result);
            //     context.setCompleted();
            // }
            

            context.setResult(result);
            context.setCompleted();

 
		} catch (SQLException e) { 
			e.printStackTrace();
		}
    }



    
    @On(event = InsertSelectProcContext.CDS_NAME)
    //@Transactional
    public void onInsertProc(InsertSelectProcContext context) {
        
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        String v_sql_createTable = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP (CD NVARCHAR(5000), NAME NVARCHAR(5000))";
        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP VALUES (?, ?)";
        String v_sql_callProc = "CALL XX_SAMPLE_MASTER_INSERT_PROC(I_TABLE => #LOCAL_TEMP,O_TABLE => ?)";

        Collection<SelectProcType> v_result = new ArrayList<>();
        Collection<InsertProcType> v_inRows = context.getValue();

        ResultSet v_rs = null;


		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            //CallableStatement v_statement_table = conn.prepareCall(v_sql_createTable);
            PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable);
            v_statement_table.execute();

            // Local Temp Table에 insert
            //CallableStatement v_statement_insert = conn.prepareCall(v_sql_insertTable);
            PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

            if(!v_inRows.isEmpty() && v_inRows.size() > 0){
                for(InsertProcType v_inRow : v_inRows){
                    v_statement_insert.setString(1, v_inRow.getCd());
                    v_statement_insert.setString(2, v_inRow.getName());
                    //v_statement_insert.executeUpdate();
                    v_statement_insert.addBatch();
                }

                v_statement_insert.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            while (v_rs.next()){
                SelectProcType v_row = SelectProcType.create();
                v_row.setMasterId(v_rs.getLong("master_id"));
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
*/
}