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

    private final static Logger log = LoggerFactory.getLogger(CustomAuthenticatedHandler.class);
    
	// Restriction annotations from underlying projected entities are added to the service entity by the compiler provided that no restrictions are defined already.
	// So the authorization has to be tested only on service level.
	@Before(event = { CdsService.EVENT_READ})
	// @Before(event = "*")
	@HandlerOrder(OrderConstants.Before.CHECK_AUTHORIZATION)
	private void checkAuthorization(EventContext context) {
        // privileged users just skip authorization checks
        if(log.isTraceEnabled()){
            UserInfo userInfo = context.getUserInfo();
            log.trace("UserInfo.isPrivileged : {}", userInfo.isPrivileged());
            log.trace("UserInfo.isAuthenticated : {}", userInfo.isAuthenticated());
            log.trace("UserInfo.isSystemUser : {}", userInfo.isSystemUser());
            log.trace("UserInfo.getId : {}", userInfo.getId());
            log.trace("UserInfo.getName : {}", userInfo.getName());
            userInfo.getRoles().forEach((role) -> {
                log.trace("UserInfo.getRoles : {}", role);
            });
            userInfo.getAttributes().forEach((key, value) -> {
                log.trace("UserInfo.getAttributes : key={}, value={}", key, value);
            });
            userInfo.getAdditionalAttributes().forEach((key, value) -> {
                log.trace("UserInfo.getAdditionalAttributes : key={}, value={}", key, value);
            });
            userInfo.getUnrestrictedAttributes().forEach((attr) -> {
                log.trace("UserInfo.getUnrestrictedAttributes : {}", attr);
            });
            log.trace("context.getEvent() : {}", context.getEvent());

            final String serviceName = ((ApplicationService) context.getService()).getDefinition().getQualifiedName();
            log.trace("context.getService()..getQualifiedName() : {}", serviceName);
        }
        
    }
    
}
