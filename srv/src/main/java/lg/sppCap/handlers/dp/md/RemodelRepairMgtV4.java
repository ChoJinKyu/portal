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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.time.Instant;

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
import lg.sppCap.frame.user.SppUserSession;
import cds.gen.dp.rrmgtlistv4service.*;


@Component
@ServiceName(RrMgtListV4Service_.CDS_NAME)
public class RemodelRepairMgtV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(RrMgtListV4Service_.CDS_NAME)
    private CdsService cdsService;
  
    @Autowired
    SppUserSession sppUserSession;

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
            Instant current = Instant.now(); // 현재시간 가져옴 

            if( repair_request_number != null && !repair_request_number.equals("New") 
                && !repair_request_number.equals("")){ // update 
                    msg.setRepairRequestNumber(itemV4.getRepairRequestNumber());
                    msg.setMoldId(itemV4.getMoldId());
                    RepairItem item = RepairItem.create();
                    item.setRepairRequestNumber(itemV4.getRepairRequestNumber());
                    item.setMoldId(itemV4.getMoldId());
                    item.setTenantId(itemV4.getTenantId());
                    item.setRepairDesc(itemV4.getRepairDesc());
                    item.setRepairReason(itemV4.getRepairReason());
                    item.setRepairRequestDate(itemV4.getRepairRequestDate());
                    item.setMoldMovingPlanDate(itemV4.getMoldMovingPlanDate());
                    item.setMoldMovingResultDate(itemV4.getMoldMovingResultDate());
                    item.setMoldCompletePlanDate(itemV4.getMoldCompletePlanDate());
                    item.setMoldCompleteResultDate(itemV4.getMoldCompleteResultDate());
                    item.setRepairProgressStatusCode(itemV4.getRepairProgressStatusCode());
                    item.setRepairTypeCode(itemV4.getRepairTypeCode());
                    item.setUpdateUserId(sppUserSession.getUserId());
                    item.setLocalUpdateDtm(current);
                    CqnUpdate updateData = Update.entity(RepairItem_.CDS_NAME).data(item);
                    Result rst = cdsService.run(updateData);
            
            }else{ // create 
                    String sql="SELECT DP_MD_REPAIR_REQ_NUM_SEQ.NEXTVAL FROM DUMMY";
                    int seq=jdbc.queryForObject(sql,Integer.class);
                    msg.setRepairRequestNumber(String.valueOf(seq));
                    msg.setMoldId(itemV4.getMoldId());
                    RepairItem item = RepairItem.create();
                    item.setRepairRequestNumber(String.valueOf(seq));
                    item.setMoldId(itemV4.getMoldId());
                    item.setTenantId(itemV4.getTenantId());
                    item.setRepairDesc(itemV4.getRepairDesc());
                    item.setRepairReason(itemV4.getRepairReason());
                    item.setRepairRequestDate(itemV4.getRepairRequestDate());
                    item.setMoldMovingPlanDate(itemV4.getMoldMovingPlanDate());
                    item.setMoldMovingResultDate(itemV4.getMoldMovingResultDate());
                    item.setMoldCompletePlanDate(itemV4.getMoldCompletePlanDate());
                    item.setMoldCompleteResultDate(itemV4.getMoldCompleteResultDate());
                    item.setRepairProgressStatusCode(itemV4.getRepairProgressStatusCode());
                    item.setRepairTypeCode(itemV4.getRepairTypeCode());
                    item.setUpdateUserId(sppUserSession.getUserId());
                    item.setCreateUserId(sppUserSession.getUserId());
                    item.setLocalUpdateDtm(current);
                    item.setLocalCreateDtm(current);
                    CqnInsert insertData = Insert.into(RepairItem_.CDS_NAME).entry(item);
                    Result rst = cdsService.run(insertData);
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