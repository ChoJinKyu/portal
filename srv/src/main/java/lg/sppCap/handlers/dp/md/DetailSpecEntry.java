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
import cds.gen.dp.detailspecentryservice.*;

@Component
@ServiceName(DetailSpecEntryService_.CDS_NAME)
public class DetailSpecEntry implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(DetailSpecEntryService_.CDS_NAME)
    private CdsService detailSpecEntryService;

    @On(event = CdsService.EVENT_UPDATE, entity=MoldMasterSpec_.CDS_NAME)
    public void onUpdateMoldMasterSpec(CdsUpdateEventContext context) {

        List<MoldMasterSpec> v_results = new ArrayList<MoldMasterSpec>();

        List<Map<String, Object>> entries = context.getCqn().entries();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Date today = new Date();
        String strToday = sdf.format(today);

        for (Map<String, Object> row : entries) {

            //response 의 result 부분, 이걸 꼭 해야하나? 어차피 재조회 하는데?
            MoldMasterSpec v_result = MoldMasterSpec.create();
            v_result.setMoldId((String) row.get("mold_id"));
            v_result.setMoldProgressStatusCode((String)row.get("mold_progress_status_code"));
            v_result.setReceiptConfirmedUserEmpno((String)row.get("receipt_confirmed_user_empno"));
            v_result.setReceiptConfirmedDate(strToday);

            v_result.setInspectionDatePlan((String)row.get("inspection_date_plan"));
            v_result.setProductionCompleteDatePlan((String)row.get("production_complete_date_plan"));
            v_result.setProductionSupplierCode((String)row.get("production_supplier_code"));

            //실제 master table update 부분
            MoldMasters master = MoldMasters.create();
            master.setMoldId((String) row.get("mold_id"));  //반드시 key 를 넣어야한다, 그렇지 않으면 전부 update 쳐버림
            master.setMoldProgressStatusCode((String) row.get("mold_progress_status_code"));
            master.setReceiptConfirmedUserEmpno((String)row.get("receipt_confirmed_user_empno"));
            master.setReceiptConfirmedDate(strToday);

            master.setInspectionDate((String)row.get("inspection_date_plan"));
            master.setProductionCompleteDate((String)row.get("production_complete_date_plan"));
            master.setProductionSupplierCode((String)row.get("production_supplier_code"));

            CqnUpdate masterUpdate = Update.entity(MoldMasters_.CDS_NAME).data(master);
            //long headerUpdateCount = developmentReceiptService.run(masterUpdate).rowCount();
            Result resultHeader = detailSpecEntryService.run(masterUpdate);
            System.out.println("#### onUpdateMoldMasters Started...."+master);

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