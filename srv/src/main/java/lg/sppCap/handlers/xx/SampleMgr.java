package lg.sppCap.handlers.xx;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
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

import cds.gen.xx.samplemgrservice.*;

@Component
@ServiceName(SampleMgrService_.CDS_NAME)
public class SampleMgr implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(SampleMgrService_.CDS_NAME)
    private CdsService sampleMgrService;

    @On(event = CdsService.EVENT_DELETE, entity=SampleViewCud_.CDS_NAME)
    public void onSampleViewDelete(CdsDeleteEventContext context) { 
        List<SampleViewCud> v_results = new ArrayList<SampleViewCud>();

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> filterValues = result.targetValues();

        SampleHeaders header = SampleHeaders.create();
        header.setHeaderId((Long) filterValues.get("header_id"));
        CqnDelete headerDelete = Delete.from(SampleHeaders_.CDS_NAME).matching(header);
        Result resultHeader = sampleMgrService.run(headerDelete);

        SampleDetails detail = SampleDetails.create();
        detail.setDetailId((Long) filterValues.get("detail_id"));
        CqnDelete detailDelete = Delete.from(SampleDetails_.CDS_NAME).matching(detail);
        //long detailDeleteCount = sampleMgrService.run(detailDelete).rowCount();
        Result resultDetail = sampleMgrService.run(detailDelete);

        SampleViewCud v_result = SampleViewCud.create();
        v_result.setHeaderId((Long) filterValues.get("header_id"));
        v_result.setDetailId((Long) filterValues.get("detail_id"));
        v_results.add(v_result);

        
        /*
        Iterable<Map<String, Object>> values = context.getCqnValueSets();

        while(values.iterator().hasNext()){
            Map<String, Object> value = values.iterator().next();

            SampleViewCud v_result = SampleViewCud.create();
            v_result.setHeaderId((Long) value.get("header_id"));
            v_result.setHeaderCd((String) value.get("header_cd"));
            v_result.setHeaderName((String) value.get("header_name"));
            v_result.setDetailId((Long) value.get("detail_id"));
            v_result.setDetailCd((String) value.get("detail_cd"));
            v_result.setDetailName((String) value.get("detail_name"));

            SampleHeaders header = SampleHeaders.create();
            header.setHeaderId((Long) value.get("header_id"));
            CqnDelete headerDelete = Delete.from(SampleHeaders_.CDS_NAME).matching(header);
            //long headerDeleteCount = sampleMgrService.run(headerDelete).rowCount();
            Result resultHeader = sampleMgrService.run(headerDelete);
            

            SampleDetails detail = SampleDetails.create();
            detail.setDetailId((Long) value.get("detail_id"));
            CqnDelete detailDelete = Delete.from(SampleHeaders_.CDS_NAME).matching(detail);
            //long detailDeleteCount = sampleMgrService.run(detailDelete).rowCount();
            Result resultDetail = sampleMgrService.run(detailDelete);

            v_results.add(v_result);
        }
        */

        context.setResult(v_results);
        context.setCompleted();
    }

    @On(event = CdsService.EVENT_UPDATE, entity=SampleViewCud_.CDS_NAME)
    public void onSampleViewUpdate(CdsUpdateEventContext context) { 

        List<SampleViewCud> v_results = new ArrayList<SampleViewCud>();

        List<Map<String, Object>> entries = context.getCqn().entries();
        
        for (Map<String, Object> row : entries) {
            SampleViewCud v_result = SampleViewCud.create();
            v_result.setHeaderId((Long) row.get("header_id"));
            v_result.setHeaderCd((String) row.get("header_cd"));
            v_result.setHeaderName((String) row.get("header_name"));
            v_result.setDetailId((Long) row.get("detail_id"));
            v_result.setDetailCd((String) row.get("detail_cd"));
            v_result.setDetailName((String) row.get("detail_name"));

            
            SampleHeaders header = SampleHeaders.create();
            header.setHeaderId((Long) row.get("header_id"));
            header.setCd((String) row.get("header_cd"));
            header.setName((String) row.get("header_name"));
            CqnUpdate headerUpdate = Update.entity(SampleHeaders_.CDS_NAME).data(header);
            //long headerUpdateCount = sampleMgrService.run(headerUpdate).rowCount();
            Result resultHeader = sampleMgrService.run(headerUpdate);
            

            SampleDetails detail = SampleDetails.create();
            detail.setHeaderId((Long) row.get("header_id"));
            detail.setDetailId((Long) row.get("detail_id"));
            detail.setCd((String) row.get("detail_cd"));
            detail.setName((String) row.get("detail_name"));
            CqnUpdate detailUpdate = Update.entity(SampleDetails_.CDS_NAME).data(detail);
            //long detailUpdateCount = sampleMgrService.run(detailUpdate).rowCount();
            Result resultDetail = sampleMgrService.run(detailUpdate);

            v_results.add(v_result);
        }

        context.setResult(v_results);
        context.setCompleted();
    }

    @On(event = CdsService.EVENT_CREATE, entity=SampleViewCud_.CDS_NAME)
    public void onSampleViewCreate(CdsCreateEventContext context) { 
        List<SampleViewCud> v_results = new ArrayList<SampleViewCud>();
        List<Map<String, Object>> entries = context.getCqn().entries();

        String sqlHeader = "SELECT XX_SAMPLE_HEADER_ID_SEQ.NEXTVAL FROM DUMMY";
        String sqlDetail = "SELECT XX_SAMPLE_DETAIL_ID_SEQ.NEXTVAL FROM DUMMY";

        for (Map<String, Object> row : entries) {
            
            Long header_id = jdbc.queryForObject(sqlHeader, Long.class);
            Long detail_id = jdbc.queryForObject(sqlDetail, Long.class);
            
            SampleViewCud v_result = SampleViewCud.create();
            v_result.setHeaderId(header_id);
            v_result.setHeaderCd((String) row.get("header_cd"));
            v_result.setHeaderName((String) row.get("header_name"));
            v_result.setDetailId(detail_id);
            v_result.setDetailCd((String) row.get("detail_cd"));
            v_result.setDetailName((String) row.get("detail_name"));

            SampleHeaders header = SampleHeaders.create();
            header.setHeaderId(header_id);
            header.setCd((String) row.get("header_cd"));
            header.setName((String) row.get("header_name"));
            CqnInsert headerInsert = Insert.into(SampleHeaders_.CDS_NAME).entry(header);
            Result resultHeader = sampleMgrService.run(headerInsert);
            

            SampleDetails detail = SampleDetails.create();
            detail.setHeaderId(header_id);
            detail.setDetailId(detail_id);
            detail.setCd((String) row.get("detail_cd"));
            detail.setName((String) row.get("detail_name"));
            CqnInsert detailInsert = Insert.into(SampleDetails_.CDS_NAME).entry(detail);
            Result resultDetail = sampleMgrService.run(detailInsert);

            v_results.add(v_result);
        }

        context.setResult(v_results);
        context.setCompleted();
    }

}