package lg.sppCap.handlers.base;

import com.sap.cds.services.handler.EventHandler;

public class BaseEventHandler implements EventHandler {

    protected String getTenantId(){
        return "L2100";
    }
    
}