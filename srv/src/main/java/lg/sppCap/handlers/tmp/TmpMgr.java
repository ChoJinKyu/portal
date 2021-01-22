package lg.sppCap.handlers.tmp;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.tmp.tmpmgrservice.*;
import lg.sppCap.solutionized.bizrule.BizRuleExecutor;
import lg.sppCap.solutionized.bizrule.model.BizRuleInfo;

@Component
@ServiceName("tmp.TmpMgrService")
public class TmpMgr implements EventHandler {

    @Autowired
    private PersistenceService db;

    @Autowired
    BizRuleExecutor bizRuleExecutor;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SampleLogicTransitionContext.CDS_NAME)
    public void onSampleLogicTransition(SampleLogicTransitionContext context) {
        System.out.println("주 업무 로직 수행");
        SampleType sampleType = SampleType.create();
        String templatePath = "";

        String tenantId = (String) context.getTenantId();
        String templateId = (String) context.getTemplateId();

        if ("tmp0001".equals(templateId)) {
            templatePath = "MidObjectDetailSpecPress_Show";
        } else if ("tmp0003".equals(templateId)) {
            templatePath = "MidObjectDetailSpecPress_Edit";
        } else if ("tmp0002".equals(templateId)) {
            templatePath = "MidObjectDetailSpecMold_Show";
        } else if ("tmp0004".equals(templateId)) {
            templatePath = "MidObjectDetailSpecMold_Edit";
        }

        System.out.println("주 업무 로직 수행");
        //writeFile();
        // 비지니스 코드 구현시 업무규칙 호출이 필요한 시점
        // tenantId는 하드코드가 아니라 세션등에서 가져와야 함
        // String tenantId = "TEN001";
        String bizRuleId = "BIZRULE_ECHO_EXAMPLE";
        String altFlag = "DEFAULT";

        // 업무규칙에 넘길 파라메터를 구성한다.
        Map<String, Object> inData = new HashMap<String, Object>();
        inData.put("Name", "Hong Gil Dong");
        inData.put("Phone", "010-1234-5678");
        inData.put("Gender", "Male");
        inData.put("Email", "gdhong@lgcns.com");

        // BizRuleExecutor를 통해 업무규칙을 호출한다.
         Map<String, Object> outData = bizRuleExecutor.excuteBizRule(tenantId,
         bizRuleId, altFlag, inData);


        BizRuleInfo info = new BizRuleInfo();
      info.setTenantId("a");
      info.setBizRuleId("a");
      info.setAltFlag("a");

        
       CqnSelect infoSelect = Select
         .from(BizruleInfo_.class)
         .columns("TENANT_ID","BIZRULE_ID","ALT_FLAG","CALL_TYPE","CALL_HOST","CALL_INFO")
         .where(
           b->b.get("TENANT_ID").eq(info.getTenantId())
           .and(b.get("BIZRULE_ID").eq(info.getBizRuleId()))
           .and(b.get("ALT_FLAG").eq(info.getAltFlag()))
         );

        Result result = db.run(infoSelect);

        List tList = result.list();


       info.setTenantId((String)result.first().get().get("TENANT_ID"));
       info.setBizRuleId((String)result.first().get().get("BIZRULE_ID"));
       info.setAltFlag((String)result.first().get().get("ALT_FLAG"));
       info.setCallType((String)result.first().get().get("CALL_TYPE"));
       info.setCallHost((String)result.first().get().get("CALL_HOST"));
       info.setCallInfo((String)result.first().get().get("CALL_INFO"));

       System.out.println("info : " + info.getCallInfo());

        sampleType.setTemplatePath(templatePath);
        context.setResult(sampleType);
        context.setCompleted();
    }

    private void writeFile() {
        // path 변경 필요. 전달 받거나 템플릿 전용 디렉토리 지정
        String path = "/home/user/projects/sppcap/app/tmp/detailSpecEntry/webapp/view/";
        String content = "<core:FragmentDefinition\n\txmlns=\"sap.m\"\n\txmlns:l=\"sap.ui.layout\"\n\txmlns:form=\"sap.ui.layout.form\"\n\txmlns:core=\"sap.ui.core\"\n\txmlns:uxap=\"sap.uxap\" >";
        BufferedInputStream bis = new BufferedInputStream(new ByteArrayInputStream(content.getBytes()));

        File file = new File(path + "test.xml");
        try {
            FileWriter writer = new FileWriter(file);
            writer.write(content);
            writer.flush();
            writer.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        
    }
}