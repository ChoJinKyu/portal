package lg.sppCap.frame.handler;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.utils.OrderConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lg.sppCap.frame.user.SppUserSession;

@Component
@ServiceName(value = "*")
public class SessionManageHandler implements EventHandler {

    @Autowired
    SppUserSession sppUserSession;

    @Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_UPDATE, CdsService.EVENT_UPSERT, CdsService.EVENT_READ })
    @HandlerOrder(OrderConstants.Before.TRANSACTION_BEGIN)
    public void setUserSession(EventContext context) {
        sppUserSession.setDbSessionContext();
    }
}