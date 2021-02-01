package lg.sppCap.frame.handler;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import com.sap.cds.reflect.CdsElement;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.HandlerOrder;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.utils.OrderConstants;
import com.sap.cds.services.utils.model.CdsAnnotations;

import org.springframework.stereotype.Component;

import lg.sppCap.util.CustomCdsModelUtils;
import lg.sppCap.util.CustomCdsServiceUtils;
import lg.sppCap.util.TimezoneUtil;

/**
 * copied from com.sap.cds.services.impl.persistence.ManagedAspectHandler;
 */
@Component
@ServiceName(value = "*", type = PersistenceService.class)
public class CustomManagedAspectHandler implements EventHandler {
    

    @Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_UPDATE, CdsService.EVENT_UPSERT })
    @HandlerOrder(OrderConstants.Before.CALCULATE_FIELDS)
    public void calculateManagedFields(EventContext context) {
        String event = context.getEvent();

        List<Map<String, Object>> entries = CustomCdsServiceUtils.getEntities(context);

        Instant localNow = TimezoneUtil.getZonedNow().toInstant();

        //TODO : 나중에 아래 블록 삭제할것       
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

        CustomCdsModelUtils.visitDeep(context.getTarget(), entries, (entity, data, parent) -> {
            HashSet<String> localNowElements = new HashSet<>();
            findHandledElements(entity.elements(), event, localNowElements);
            if (localNowElements.isEmpty()) {
                return;
            }

            for(Map<String, Object> map : data) {
                for (String elementName : localNowElements) {
                    if(!map.containsKey(elementName)) {
                        map.put(elementName, localNow);
                    }
                }
            }
        });
    }

    @SuppressWarnings("unchecked")
    private void findHandledElements(Stream<CdsElement> elements, String event, HashSet<String> localNowElements) {
        elements.forEach(element -> {

            Object annotationValue = null;
            if (CdsService.EVENT_CREATE.equals(event)) {
                annotationValue = CdsAnnotations.ON_INSERT.getOrDefault(element);
            } else if (CdsService.EVENT_UPDATE.equals(event) || CdsService.EVENT_UPSERT.equals(event)) {
                annotationValue = CdsAnnotations.ON_UPDATE.getOrDefault(element);
            }

            if (annotationValue instanceof Map) {
                Object equalsValue = ((Map<String,Object>) annotationValue).get("=");
                if ("$localNow".equals(equalsValue)) {
                    localNowElements.add(element.getName());
                }

                equalsValue = ((Map<String,Object>) annotationValue).get("#");
                if ("localNow".equals(equalsValue)) {
                    localNowElements.add(element.getName());
                }
            }

        });
    }

}
