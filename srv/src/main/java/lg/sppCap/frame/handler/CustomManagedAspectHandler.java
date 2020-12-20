package lg.sppCap.frame.handler;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.utils.OrderConstants;

import org.springframework.stereotype.Component;

import lg.sppCap.util.CustomCdsServiceUtils;
import lg.sppCap.util.TimezoneUtil;

/**
 * copied from com.sap.cds.services.impl.persistence.ManagedAspectHandler;
 */
@Component
@ServiceName(value = "*", type = PersistenceService.class)
public class CustomManagedAspectHandler implements EventHandler {
    
	/**
	 * Handler method that calculates the administrative data properties of entities
	 * with the "managed" aspect. Usually, these are the properties createdAt / createdBy
	 * and modifiedAt / modifiedBy, but it could be any property annotated with
	 * "@cds.on.insert" / "@cds.on.update" or "@odata.on.insert" / "@odata.on.update" annotations
	 * with matching values.
	 *
	 * @param context the event context
	 */
	@Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_UPDATE, CdsService.EVENT_UPSERT })
	@HandlerOrder(OrderConstants.Before.CALCULATE_FIELDS)
	public void calculateManagedFields(EventContext context) {
		String event = context.getEvent();
		List<Map<String, Object>> entries = CustomCdsServiceUtils.getEntities(context);
		
		ZonedDateTime localNow = TimezoneUtil.getZonedNow();
        if(CdsService.EVENT_CREATE.equals(event)){
            for(int i = 0; i < entries.size(); i++){
                entries.get(i).put("local_create_dtm", localNow);
                entries.get(i).put("local_update_dtm", localNow);
            }
        }else if(CdsService.EVENT_UPDATE.equals(event)){
            for(int i = 0; i < entries.size(); i++){
                entries.get(i).put("local_update_dtm", localNow);
            }
        }
	}
    
}
