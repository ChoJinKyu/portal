package lg.sppCap.handlers.xx.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.stereotype.Component;

@Component
@ServiceName("xx.util.CommonService")
public class CommonService implements EventHandler {

    private List<Map<String, Object>> list = new ArrayList<>();

    @On(event = CdsService.EVENT_READ, entity="xx.util.CommonService.Code")
    public void onReadCode(CdsReadEventContext context) {
        Map<String, Object> data1 = new HashMap<>();
        data1.put("tenant_id", "TID");
        data1.put("group_code", "Group Code");
        data1.put("code", "Code");
        data1.put("code_description", "Code Desc");
        data1.put("sort_no", 11);
        data1.put("code_name", "Valid code");
        data1.put("code_name1", "Valid code11");
        list.add(data1);
        context.setResult(list);
    }

}