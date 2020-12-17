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

    private final static Logger logger = LoggerFactory.getLogger(ApplicationServiceHandler.class);

    public ApplicationServiceHandler(){
        logger.info("constructor for ApplicationServiceHandler");
    }
    
    @Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_READ, CdsService.EVENT_UPDATE, CdsService.EVENT_DELETE, CdsService.EVENT_UPSERT })
	@HandlerOrder(OrderConstants.Before.CHECK_ENTITY_FITS)
	private void checkEntityFitsService(EventContext context) {
        logger.info(String.format("qualifier : %s", context.getTarget().getQualifier()));
        logger.info(String.format("qualifiedName : %s", context.getTarget().getQualifiedName()));
        logger.info(String.format("service.name : %s", context.getService().getName()));
	}

	// Restriction annotations from underlying projected entities are added to the service entity by the compiler provided that no restrictions are defined already.
	// So the authorization has to be tested only on service level.
	@Before(event = "*")
	@HandlerOrder(OrderConstants.Before.CHECK_AUTHORIZATION)
	private void checkAuthorization(EventContext context) {
        logger.info(String.format("isPrivileged : %s", context.getUserInfo().isPrivileged() ));
    }
    
}
