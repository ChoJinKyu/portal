package lg.sppCap.handlers.cm;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cds.gen.cm.orgprocorgtypemgtservice.OrgProcOrgTypeMgtService_;
import cds.gen.cm.orgprocorgtypemgtservice.PurOrgTypeMap_;
import cds.gen.cm.orgprocorgtypemgtservice.PurOrgTypeMap;
import cds.gen.cm.orgprocorgtypemgtservice.PurOrgTypeView_;
import cds.gen.cm.orgprocorgtypemgtservice.PurOrgTypeView;

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
import com.sap.cds.reflect.CdsEntity;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnStatement;

@Component
@ServiceName(OrgProcOrgTypeMgtService_.CDS_NAME)
public class OrgProcOrgTypeMgtService implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(OrgProcOrgTypeMgtService_.CDS_NAME)
    private CdsService orgProcOrgTypeMgtService;

    @On(event = CdsService.EVENT_CREATE, entity=PurOrgTypeView_.CDS_NAME)
    public void onSampleViewCreate(CdsCreateEventContext context) { 
        System.out.println("------------------View----------ON_START------------------");
        List<PurOrgTypeView> v_results = new ArrayList<PurOrgTypeView>();
        List<Map<String, Object>> entries = context.getCqn().entries();

        
        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> filterValues = result.targetValues();
        System.out.println("------------------View----------ON_test------------------");
        System.out.println(filterValues);

        for (Map<String, Object> row : entries) {
            System.out.println("------------------View----------FOR_START------------------");
            System.out.println(row.get("tenant_id"));
            System.out.println(row.get("company_code"));
            System.out.println(row.get("process_type_name"));
            System.out.println(row.get("org_type_name"));
            System.out.println(row.get("use_flag"));
            System.out.println(row);

            PurOrgTypeView v_result = PurOrgTypeView.create();
            v_result.setTenantId((String) row.get("tenant_id"));
            v_result.setCompanyCode((String) row.get("company_code"));
            v_result.setProcessTypeName((String) row.get("process_type_name"));
            v_result.setOrgTypeName((String) row.get("org_type_name"));
            v_result.setUseFlag((Boolean) row.get("use_flag"));
            System.out.println(v_result);
            System.out.println("------------------View----------FORMID------------------");

            PurOrgTypeMap purorg = PurOrgTypeMap.create();
            purorg.setTenantId((String) row.get("tenant_id"));
            purorg.setCompanyCode((String) row.get("company_code"));
            purorg.setProcessTypeCode((String) row.get("process_type_name"));
            purorg.setOrgTypeCode((String) row.get("org_type_name"));
            purorg.setUseFlag((Boolean) row.get("use_flag"));
            CqnInsert purorgInsert = Insert.into(PurOrgTypeMap_.CDS_NAME).entry(purorg);
            Result resultHeader = orgProcOrgTypeMgtService.run(purorgInsert);

            System.out.println(row.get("tenant_id"));
            System.out.println(row.get("company_code"));
            System.out.println(row.get("process_type_name"));
            System.out.println(row.get("org_type_name"));
            System.out.println(row.get("use_flag"));
            System.out.println("------------------View----------FOREND------------------");
            
            v_results.add(v_result);
        }
        context.setResult(v_results);
        context.setCompleted();
    }

    

        // String sqlHeader = "SELECT XX_SAMPLE_HEADER_ID_SEQ.NEXTVAL FROM DUMMY";
        // String sqlDetail = "SELECT XX_SAMPLE_DETAIL_ID_SEQ.NEXTVAL FROM DUMMY";

        // for (Map<String, Object> row : entries) {
            
        //     Long header_id = jdbc.queryForObject(sqlHeader, Long.class);
        //     Long detail_id = jdbc.queryForObject(sqlDetail, Long.class);
            
        //     SampleViewCud v_result = SampleViewCud.create();
        //     v_result.setHeaderId(header_id);
        //     v_result.setHeaderCd((String) row.get("header_cd"));
        //     v_result.setHeaderName((String) row.get("header_name"));
        //     v_result.setDetailId(detail_id);
        //     v_result.setDetailCd((String) row.get("detail_cd"));
        //     v_result.setDetailName((String) row.get("detail_name"));

        //     SampleHeaders header = SampleHeaders.create();
        //     header.setHeaderId(header_id);
        //     header.setCd((String) row.get("header_cd"));
        //     header.setName((String) row.get("header_name"));
        //     CqnInsert headerInsert = Insert.into(SampleHeaders_.CDS_NAME).entry(header);
        //     Result resultHeader = orgProcOrgTypeMgtService.run(headerInsert);
            

        //     SampleDetails detail = SampleDetails.create();
        //     detail.setHeaderId(header_id);
        //     detail.setDetailId(detail_id);
        //     detail.setCd((String) row.get("detail_cd"));
        //     detail.setName((String) row.get("detail_name"));
        //     CqnInsert detailInsert = Insert.into(SampleDetails_.CDS_NAME).entry(detail);
        //     Result resultDetail = orgProcOrgTypeMgtService.run(detailInsert);

        //     v_results.add(v_result);
        // }

        // context.setResult(v_results);
        // context.setCompleted();
    // }
    // @On(event = CdsService.EVENT_DELETE, entity=PurOrgTypeMapView_.CDS_NAME)
    // public void onSampleViewDelete(CdsDeleteEventContext context) { 
    //     System.out.println("------------------View----------ON_START------------DELETE-----");

    //     List<PurOrgTypeMapView> v_results = new ArrayList<PurOrgTypeMapView>();

    //     Iterable<Map<String, Object>> values = context.getCqnValueSets();

    //     while(values.iterator().hasNext()){
    //         Map<String, Object> value = values.iterator().next();

    //         PurOrgTypeMapView v_result = PurOrgTypeMapView.create();
    //         System.out.println(value.get("tenant_id"));
    //     }
    // }

    //     for (Map<String, Object> row : entries) {

    //         System.out.println(row.get("tenant_id"));
    //     }
    // }

    // @Before(event = CdsService.EVENT_CREATE, entity=PurOrgTypeMapView_.CDS_NAME)
    // public void onSampleViewCreate2(CdsCreateEventContext context) { 
    //     System.out.println("--------------------View--------BEFORE_START------------------");
    //     List<PurOrgTypeMapView> v_results = new ArrayList<PurOrgTypeMapView>();
    //     List<Map<String, Object>> entries = context.getCqn().entries();

    //     for (Map<String, Object> row : entries) {

    //         System.out.println(row.get("tenant_id"));
    //     }
        
    // }
}