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
import java.time.Instant;

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
    public void onUpdateDevelopmentReceipt(CdsUpdateEventContext context) {

        Instant current = Instant.now();

        List<MoldMstView> v_results = new ArrayList<MoldMstView>();

        List<Map<String, Object>> entries = context.getCqn().entries();

        String v_sql_callProc = "CALL DP_MD_SCHEDULE_SAVE_PROC(TENANT_ID => ?, MOLD_ID => ?)";
        
            for (Map<String, Object> row : entries) {
                MoldMstView v_result = MoldMstView.create();
                v_result.setTenantId((String) row.get("tenant_id"));
                v_result.setMoldId((String) row.get("mold_id"));
                v_result.setMoldProgressStatusCode("DEV_RCV");
                
                v_result.setMoldProductionTypeCode((String) row.get("mold_production_type_code"));
                v_result.setMoldItemTypeCode((String) row.get("mold_item_type_code"));
                v_result.setMoldTypeCode((String) row.get("mold_type_code"));
                v_result.setMoldLocationTypeCode((String) row.get("mold_location_type_code"));
                v_result.setMoldCostAnalysisTypeCode((String) row.get("mold_cost_analysis_type_code"));
                v_result.setMoldPurchasingTypeCode((String) row.get("mold_purchasing_type_code"));
                v_result.setDieForm((String) row.get("die_form"));
                v_result.setMoldSize((String) row.get("mold_size"));
                v_result.setMoldDeveloperEmpno((String) row.get("mold_developer_empno"));
                v_result.setRemark((String) row.get("remark"));
                v_result.setFamilyPartNumber1((String) row.get("family_part_number_1"));
                v_result.setFamilyPartNumber2((String) row.get("family_part_number_2"));
                v_result.setFamilyPartNumber3((String) row.get("family_part_number_3"));
                v_result.setFamilyPartNumber4((String) row.get("family_part_number_4"));
                v_result.setFamilyPartNumber5((String) row.get("family_part_number_5"));
                
                if((Boolean) row.get("chk")){
                    MoldMasters master = MoldMasters.create();
                    master.setTenantId((String) row.get("tenant_id"));
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
                    master.setLocalUpdateDtm(current);

                    CqnUpdate masterUpdate = Update.entity(MoldMasters_.CDS_NAME).data(master);
                    //long headerUpdateCount = developmentReceiptService.run(masterUpdate).rowCount();
                    Result resultMaster = developmentReceiptService.run(masterUpdate);

                    MoldSpecs spec = MoldSpecs.create();
                    spec.setTenantId((String) row.get("tenant_id"));
                    spec.setMoldId((String) row.get("mold_id"));
                    spec.setDieForm((String) row.get("die_form"));
                    spec.setMoldSize((String) row.get("mold_size"));
                    spec.setLocalUpdateDtm(current);
                    CqnUpdate specUpdate = Update.entity(MoldSpecs_.CDS_NAME).data(spec);
                    //long detailUpdateCount = developmentReceiptService.run(specUpdate).rowCount();
                    Result resultSpec = developmentReceiptService.run(specUpdate);

                    // Procedure Call
                    jdbc.update(v_sql_callProc, row.get("tenant_id"), row.get("mold_id"));
                }

                v_results.add(v_result);
            }

            context.setResult(v_results);
            context.setCompleted();

    }
    
    @On(event = CdsService.EVENT_DELETE, entity=MoldMstView_.CDS_NAME)
    public void onDeleteDevelopmentReceipt(CdsDeleteEventContext context) { 
        List<MoldMstView> v_results = new ArrayList<MoldMstView>();

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> filterValues = result.targetValues();

        MoldMasters master = MoldMasters.create();
        master.setTenantId((String) filterValues.get("tenant_id"));
        master.setMoldId((String) filterValues.get("mold_id"));
        CqnDelete masterDelete = Delete.from(MoldMasters_.CDS_NAME).matching(master);
        Result resultMaster = developmentReceiptService.run(masterDelete);

        MoldSpecs spec = MoldSpecs.create();
        spec.setTenantId((String) filterValues.get("tenant_id"));
        spec.setMoldId((String) filterValues.get("mold_id"));
        CqnDelete specDelete = Delete.from(MoldSpecs_.CDS_NAME).matching(spec);
        Result resultSpec = developmentReceiptService.run(specDelete);

        MoldSchedules schedule = MoldSchedules.create();
        schedule.setTenantId((String) filterValues.get("tenant_id"));
        schedule.setMoldId((String) filterValues.get("mold_id"));
        CqnDelete scheduleDelete = Delete.from(MoldSchedules_.CDS_NAME).matching(schedule);
        Result resultSchedule = developmentReceiptService.run(scheduleDelete);

        MoldMstView v_result = MoldMstView.create();
        v_result.setTenantId((String) filterValues.get("tenant_id"));
        v_result.setMoldId((String) filterValues.get("mold_id"));
        v_results.add(v_result);

        context.setResult(v_results);
        context.setCompleted();
    }
}