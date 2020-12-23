package lg.sppCap.handlers.dp.md;

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
import java.util.Set;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Delete;
import com.sap.cds.Result;


import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import cds.gen.dp.developmentreceiptservice.*;

@Component
@ServiceName(DevelopmentReceiptService_.CDS_NAME)
public class DevelopmentReceipt implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(DevelopmentReceiptService_.CDS_NAME)
    private CdsService developmentReceiptService;

    @On(event = CdsService.EVENT_UPDATE, entity=MoldMstView_.CDS_NAME)
    public void onUpdateMoldMasters(CdsUpdateEventContext context) {

        List<MoldMstView> v_results = new ArrayList<MoldMstView>();

        List<Map<String, Object>> entries = context.getCqn().entries();
        
        //SimpleDateFormat sdf           = new SimpleDateFormat("yyyyMMdd");
        //String         current         = sdf.format(new Date()).toString();

        for (Map<String, Object> row : entries) {
            MoldMstView v_result = MoldMstView.create();
            v_result.setMoldProgressStatusCode("DEV_RCV");
            
            /*v_result.setHeaderCd((String) row.get("header_cd"));
            v_result.setHeaderName((String) row.get("header_name"));
            v_result.setDetailId((Long) row.get("detail_id"));
            v_result.setDetailCd((String) row.get("detail_cd"));
            v_result.setDetailName((String) row.get("detail_name"));*/

            /*
            MoldMasters master = MoldMasters.create();
            master.setMoldProgressStatusCode((String) row.get("mold_progress_status_code"));
            CqnUpdate masterUpdate = Update.entity(MoldMasters_.CDS_NAME).data(master);
            //long headerUpdateCount = developmentReceiptService.run(masterUpdate).rowCount();
            Result resultHeader = developmentReceiptService.run(masterUpdate);
            System.out.println("#### onUpdateMoldMasters Started...."+master);

            MoldSpecs spec = MoldSpecs.create();
            spec.setHeaderId((Long) row.get("header_id"));
            spec.setDetailId((Long) row.get("detail_id"));
            spec.setCd((String) row.get("detail_cd"));
            spec.setName((String) row.get("detail_name"));
            CqnUpdate specUpdate = Update.entity(MoldSpecs_.CDS_NAME).data(spec);
            //long detailUpdateCount = developmentReceiptService.run(specUpdate).rowCount();
            Result resultDetail = developmentReceiptService.run(specUpdate);
*/
            v_results.add(v_result);
        }

        context.setResult(v_results);
        context.setCompleted();

        //for(MoldMstView moldMaster : moldMasters) {
            //moldMaster.setMoldReceiptFlag(true);

            //if(moldMaster.getReceivingReportDate() == null || "".equals(moldMaster.getReceivingReportDate())){
            //    moldMaster.setReceivingReportDate(current);
            //}
        //}

    }

}