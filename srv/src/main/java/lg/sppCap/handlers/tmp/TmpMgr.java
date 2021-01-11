package lg.sppCap.handlers.tmp;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.tmp.tmpmgrservice.*;

@Component
@ServiceName("tmp.TmpMgrService")
public class TmpMgr implements EventHandler {

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SampleLogicTransitionContext.CDS_NAME)
    public void onSampleLogicTransition(SampleLogicTransitionContext context) {
        System.out.println("주 업무 로직 수행");
        SampleType sampleType = SampleType.create();
        sampleType.setResult(new String("temp"));
        String test = (String)context.get("test");
        System.out.println("test : " + test);
        System.out.println("주 업무 로직 수행");
        context.setResult(sampleType);
        context.setCompleted();
    }
}