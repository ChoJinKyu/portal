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
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Delete;
import com.sap.cds.Result;


import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import cds.gen.dp.developmentreceiptv4service.*;
import cds.gen.dp.developmentreceiptservice.*;

@Component
@ServiceName(DevelopmentReceiptV4Service_.CDS_NAME)
public class DevelopmentReceiptV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(DevelopmentReceiptService_.CDS_NAME)
    private CdsService developmentReceiptService;

    @On(event = BindDevelopmentReceiptContext.CDS_NAME)
    public void onBindDevelopmentReceipt(BindDevelopmentReceiptContext context) {

        Collection<SavedMolds> v_inMultiData = context.getMoldDatas();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        SimpleDateFormat sdf           = new SimpleDateFormat("yyyy");
        String         current         = sdf.format(new Date()).toString();

        String v_sql_createSetId = "SELECT DP_MD_MST_SET_ID_SEQ.NEXTVAL FROM DUMMY";
        
        try {
            Connection conn = jdbc.getDataSource().getConnection();

            // Set Id 뒤 5자리 생성
            int setIdSeq = jdbc.queryForObject(v_sql_createSetId, Integer.class);
            
            for (SavedMolds row :  v_inMultiData) {
                if((Boolean) row.get("chk")){
                    String setId = row.get("org_code") + current + Integer.toString(setIdSeq);

                    MoldMasters master = MoldMasters.create();
                    master.setMoldId((String) row.get("mold_id"));
                    master.setMoldProgressStatusCode("DEV_RCV");
                    master.setMoldProductionTypeCode((String) row.get("mold_production_type_code"));
                    master.setMoldItemTypeCode((String) row.get("mold_item_type_code"));
                    master.setMoldTypeCode((String) row.get("mold_type_code"));
                    master.setMoldLocationTypeCode((String) row.get("mold_location_type_code"));
                    master.setMoldCostAnalysisTypeCode((String) row.get("mold_cost_analysis_type_code"));
                    master.setMoldPurchasingTypeCode((String) row.get("mold_purchasing_type_code"));
                    master.setMoldDeveloperEmpno((String) row.get("mold_developer_empno"));
                    master.setRemark((String) row.get("remark"));
                    master.setFamilyPartNumber1((String) row.get("family_part_number_1"));
                    master.setFamilyPartNumber2((String) row.get("family_part_number_2"));
                    master.setFamilyPartNumber3((String) row.get("family_part_number_3"));
                    master.setFamilyPartNumber4((String) row.get("family_part_number_4"));
                    master.setFamilyPartNumber5((String) row.get("family_part_number_5"));
                    master.setSetId(setId);

                    CqnUpdate masterUpdate = Update.entity(MoldMasters_.CDS_NAME).data(master);
                    Result resultHeader = developmentReceiptService.run(masterUpdate);

                    MoldSpecs spec = MoldSpecs.create();
                    spec.setMoldId((String) row.get("mold_id"));
                    spec.setDieForm((String) row.get("die_form"));
                    spec.setMoldSize((String) row.get("mold_size"));
                    CqnUpdate specUpdate = Update.entity(MoldSpecs_.CDS_NAME).data(spec);
                    Result resultDetail = developmentReceiptService.run(specUpdate);
                }
            }

            context.setResult(msg);
            context.setCompleted();

        } catch (SQLException e) { 
			e.printStackTrace();
        }
    }
    
}