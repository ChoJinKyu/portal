package lg.sppCap.handlers.tmp;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.tmp.tmpmgrservice.*;
import lg.sppCap.solutionized.bizrule.BizRuleExecutor;

@Component
@ServiceName("tmp.TmpMgrService")
public class TmpMgr implements EventHandler {

    @Autowired
    BizRuleExecutor bizRuleExecutor;

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SampleLogicTransitionContext.CDS_NAME)
    public void onSampleLogicTransition(SampleLogicTransitionContext context) {
        System.out.println("주 업무 로직 수행");
        SampleType sampleType = SampleType.create();
        sampleType.setResult(new String("<h1>hahaha</h1>"));
        String test = (String)context.get("test");
        System.out.println("test : " + test);
        System.out.println("주 업무 로직 수행");

        //비지니스 코드 구현시 업무규칙 호출이 필요한 시점
        //tenantId는 하드코드가 아니라 세션등에서 가져와야 함
        String tenantId = "TEN001";
        String bizRuleId = "BIZRULE_ECHO_EXAMPLE";
        String altFlag = "DEFAULT";
        
        //업무규칙에 넘길 파라메터르 구성한다.
        Map<String, Object> inData = new HashMap<String, Object>();
        inData.put("Name", "Hong Gil Dong");
        inData.put("Phone", "010-1234-5678");
        inData.put("Gender", "Male");
        inData.put("Email", "gdhong@lgcns.com");
        
        //BizRuleExecutor를 통해 업무규칙을 호출한다.
        //Map<String, Object> outData = bizRuleExecutor.excuteBizRule(tenantId, bizRuleId, altFlag, inData);

        context.setResult(sampleType);
        context.setCompleted();
    }
}