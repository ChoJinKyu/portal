package lg.sppCap.frame.handler;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.changeset.ChangeSetListener;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lg.sppCap.frame.user.SppUserSession;


@Component
@ServiceName(value = "*")
public class SessionManageHandler implements EventHandler {

    @Autowired
    SppUserSession sppUserSession;

    @Before(event = "SERVICE_ACCESS")
    //@HandlerOrder(OrderConstants.Before.TRANSACTION_BEGIN)
    public void setUserSession(EventContext context) {

        context.getChangeSetContext().register(new ChangeSetListener(){
            @Override
            public void beforeClose() {
                sppUserSession.unSetDbSessionContext();
            }
        });

        sppUserSession.setDbSessionContext();
    }
}