package lg.sppCap.handlers.xx.util;

import java.util.List;
import org.springframework.stereotype.Component;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import java.util.Map;
import java.util.HashMap;

@Component
@ServiceName("xx.util.CommonService")
public class CommonService implements EventHandler {

    private Map<Object, Map<String, Object>> products = new HashMap<>();

    @On(event = CdsService.EVENT_READ, entity="xx.util.CommonService.Code")
    public void onReadCode(CdsReadEventContext context) {
        Map<String, Object> data = new HashMap<>();
        data.put("hello", "world");
        products.put("data", data);
        context.setResult(products.values());
    }

}