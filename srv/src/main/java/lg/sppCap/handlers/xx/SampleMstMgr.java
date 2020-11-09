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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

@Component
@ServiceName("xx.SampleMstMgrService")
public class SampleMstMgr implements EventHandler {

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

            /*
            if (context instanceof CdsCreateEventContext){
                context.setResult(result);
            }else if (context instanceof CdsUpdateEventContext){
                context.setResult(result);
            }else{
                context.put("result", result);
                context.setCompleted();
            }
            */

            context.setResult(result);
            context.setCompleted();

 
		} catch (SQLException e) { 
			e.printStackTrace();
		}
    }



    
    @On(event = InsertSelectProcContext.CDS_NAME)
    //@Transactional
    public void onInsertProc(InsertSelectProcContext context) {
        //String v_sql = "CALL XX_SAMPLE_MASTER_INSERT_PROC(O_TABLE => ?)";

    }

}