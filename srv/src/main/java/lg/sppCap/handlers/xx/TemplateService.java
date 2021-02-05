package lg.sppCap.handlers.xx;

import java.util.List;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import cds.gen.xx.templateservice.ControlOptionMasters;
import cds.gen.xx.templateservice.ControlOptionMasters_;
import cds.gen.xx.templateservice.Message;
import cds.gen.xx.templateservice.Message_;
import cds.gen.xx.templateservice.TemplateService_;
import lg.sppCap.frame.handler.BaseEventHandler;

@Component
@ServiceName(TemplateService_.CDS_NAME)
public class TemplateService extends BaseEventHandler {

    private final static Logger log = LoggerFactory.getLogger(TemplateService.class);
    
    @Before(event = {CdsService.EVENT_READ}, entity = Message_.CDS_NAME)
    public void beforeGetMessageContents(EventContext context) {
        try{
            String msg = this.getMessage("REQUEST", context);
            if(log.isDebugEnabled())
                log.debug(msg);
        }catch(Exception e){
            log.error(e.getLocalizedMessage(), e);
        }
    }

    @Before(event = {CdsService.EVENT_CREATE, CdsService.EVENT_UPDATE}, entity = Message_.CDS_NAME)
    public void validateMessageContents(EventContext context, List<Message> messages) {
        for(Message message : messages){
            String tenantId = message.getTenantId();
            String messageCode = message.getMessageCode();
            String languageCode = message.getLanguageCode();
            String typeCode = message.getMessageTypeCode();
            String messageContents = message.getMessageContents();
    
            if(!this.getTenantId().equals(tenantId))
                throw new ServiceException(ErrorStatuses.SERVER_ERROR, "tenantId is not matches with this session.");
    
            if(languageCode == null)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Not supported languageCode or it is empty.");
    
            if(messageCode == null)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "messageCode shouldn't be empty.");
    
            if(messageContents == null)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "messageContents shouldn't be empty.");
        
            if("MSG".equals(typeCode) && messageCode.length() != 8){
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Message type message must have 8 byte message_code value. likes NCM0001");
            }
        }
    }
    
    @Before(event = CdsService.EVENT_CREATE, entity = ControlOptionMasters_.CDS_NAME)
    public void validateControlOptionMasterContents(List<ControlOptionMasters> items) {
        for (ControlOptionMasters item : items) {
            String tenantId = item.getTenantId();
            String controlOptionName = item.getControlOptionName();

            if(!this.getTenantId().equals(tenantId))
                throw new ServiceException(ErrorStatuses.SERVER_ERROR, "tenantId is not matches with this session.");

            if(controlOptionName == null || controlOptionName.length() < 10)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Not supported controlOptionName. null or very short.");
        }
    }

    // @On(event = CdsService.EVENT_READ, entity = Message_.CDS_NAME)
    // public void onRead(CdsReadEventContext context) {
    //     String tenantId = this.getTenantId();
    //     //CqnSelect cqnSelect = Select.from(Message_.class).where(b -> b.tenant_id().eq(tenantId));
    //     CqnSelect cqnSelect = Select.copy(context.getCqn()).where(b -> b.get("tenant_id").eq(tenantId)).limit(5);
    //     // Iterator<CqnPredicate> conds = context.getCqn().where().stream().iterator();
    //     // while(conds.hasNext()){
    //     //     cqnSelect.where(b -> b.get("tenant_id").eq(tenantId));
    //     // }
    //     List<Message> items = db.run(cqnSelect).listOf(Message.class);
    //     //List<Message> items = db.run(context.getCqn()).listOf(Message.class);
    //     context.setResult(items);
    // }
}