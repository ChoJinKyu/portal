package lg.sppCap.frame.handler;


import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.ApplicationService;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.UserInfo;
import com.sap.cds.services.utils.OrderConstants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@ServiceName(value = "*", type = ApplicationService.class)
public class CustomAuthenticatedHandler implements EventHandler {

    Logger log = LoggerFactory.getLogger(CustomAuthenticatedHandler.class);
    
	// Restriction annotations from underlying projected entities are added to the service entity by the compiler provided that no restrictions are defined already.
	// So the authorization has to be tested only on service level.
	@Before(event = { CdsService.EVENT_READ})
	// @Before(event = "*")
	@HandlerOrder(OrderConstants.Before.CHECK_AUTHORIZATION)
	private void checkAuthorization(EventContext context) {
        // privileged users just skip authorization checks
        UserInfo userInfo = context.getUserInfo();

        log.info("UserInfo.getTenant : {}", userInfo.getTenant());
        log.info("UserInfo.isPrivileged : {}", userInfo.isPrivileged());
        log.info("UserInfo.isAuthenticated : {}", userInfo.isAuthenticated());
        log.info("UserInfo.isSystemUser : {}", userInfo.isSystemUser());
        log.info("UserInfo.getId : {}", userInfo.getId());
        log.info("UserInfo.getName : {}", userInfo.getName());
        userInfo.getRoles().forEach((role) -> {
            log.info("UserInfo.getRoles : {}", role);
        });
        userInfo.getAttributes().forEach((key, value) -> {
            log.info("UserInfo.getAttributes : key={}, value={}", key, value);
        });
        userInfo.getAdditionalAttributes().forEach((key, value) -> {
            log.info("UserInfo.getAdditionalAttributes : key={}, value={}", key, value);
        });
        userInfo.getUnrestrictedAttributes().forEach((attr) -> {
            log.info("UserInfo.getUnrestrictedAttributes : {}", attr);
        });
        
        log.info("context.getEvent() : {}", context.getEvent());
		final String serviceName = ((ApplicationService) context.getService()).getDefinition().getQualifiedName();

        log.info("context.getService()..getQualifiedName() : {}", serviceName);
        
    }
    
}
