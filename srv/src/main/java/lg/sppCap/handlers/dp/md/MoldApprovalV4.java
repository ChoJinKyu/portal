package lg.sppCap.handlers.dp;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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

import cds.gen.dp.moldapprovalv4service.*;

@Component
@ServiceName(MoldApprovalV4Service_.CDS_NAME)
public class MoldApprovalV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

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
    @On(event = SaveMoldApprovalContext.CDS_NAME)
    public void onSave(SaveMoldApprovalContext context){

        SaveReturnType data = context.getInputData();
        try {
            System.out.println(" >>>>>>> "+ data);
        } catch (Exception e) {
            //TODO: handle exception
        }


    }    


}