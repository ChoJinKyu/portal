package lg.sppCap.frame.handler;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.ApplicationService;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.utils.OrderConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@ServiceName(value = "*", type = ApplicationService.class)
public class ApplicationServiceHandler implements EventHandler {

    private final static Logger log = LoggerFactory.getLogger(ApplicationServiceHandler.class);

    public ApplicationServiceHandler(){
        if(log.isDebugEnabled()){
            log.debug("constructor for ApplicationServiceHandler");
        }
    }
    
    @Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_READ, CdsService.EVENT_UPDATE, CdsService.EVENT_DELETE, CdsService.EVENT_UPSERT })
	@HandlerOrder(OrderConstants.Before.CHECK_ENTITY_FITS)
	private void checkEntityFitsService(EventContext context) {
        if(log.isDebugEnabled()){
            log.debug(String.format("qualifier : %s", context.getTarget().getQualifier()));
            log.debug(String.format("qualifiedName : %s", context.getTarget().getQualifiedName()));
            log.debug(String.format("service.name : %s", context.getService().getName()));
        }
	}

	// Restriction annotations from underlying projected entities are added to the service entity by the compiler provided that no restrictions are defined already.
	// So the authorization has to be tested only on service level.
	@Before(event = "*")
	@HandlerOrder(OrderConstants.Before.CHECK_AUTHORIZATION)
	private void checkAuthorization(EventContext context) {
        if(log.isDebugEnabled()){
            log.debug(String.format("isPrivileged : %s", context.getUserInfo().isPrivileged() ));
        }
    }
    
}
