package lg.sppCap.handlers.dp.md;

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
import java.math.BigDecimal;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
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
import org.springframework.beans.factory.annotation.Qualifier;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Delete;
import com.sap.cds.Result;

import cds.gen.dp.rrmgtlistv4service.*;


@Component
@ServiceName(RrMgtListV4Service_.CDS_NAME)
public class RemodelRepairMgtListV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @On(event = SaveRemodelRepairContext.CDS_NAME)
    public void onSave(SaveRemodelRepairContext context){

        Data data = context.getInputData();

        RepairItemV4 itemV4 = data.getRepairItem();

        System.out.println("aMaster>>> " + itemV4);

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("NCM01001");
        msg.setResultCode(0);
 
        String repair_request_number = itemV4.getRepairRequestNumber();

        try {

            if( repair_request_number != null && !repair_request_number.equals("New") 
                && !repair_request_number.equals("")){ // update 
              

                 
            
            }else{ // create 
               // String sql="SELECT DP_MD_REPAIR_REQ_NUM_SEQ.NEXTVAL FROM DUMMY";
               // int seq=jdbc.queryForObject(sql,Integer.class);
            

            }

        } catch (Exception e) {
            msg.setMessageCode("FAILURE");
            msg.setResultCode(-1);
            e.printStackTrace();
        }

        context.setResult(msg);
        context.setCompleted();
    
    }    
    
  



}