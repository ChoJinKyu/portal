package lg.sppCap.handlers.xx;

import java.util.List;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cds.gen.xx.templateservice.ControlOptionMasters;
import cds.gen.xx.templateservice.ControlOptionMasters_;
import cds.gen.xx.templateservice.Message;
import cds.gen.xx.templateservice.Message_;
import cds.gen.xx.templateservice.TemplateService_;
import lg.sppCap.handlers.base.BaseEventHandler;

@Component
@ServiceName(TemplateService_.CDS_NAME)
public class TemplateService extends BaseEventHandler {

    @Autowired
    PersistenceService db;
    
    @Before(event = CdsService.EVENT_CREATE, entity = Message_.CDS_NAME)
    public void validateMessageContents(List<Message> items) {
        for (Message item : items) {
            String tenantId = item.getTenantId();
            String messageCode = item.getMessageCode();
            String languageCode = item.getLanguageCode();
            String messageContents = item.getMessageContents();

            if(!this.getTenantId().equals(tenantId))
                throw new ServiceException(ErrorStatuses.SERVER_ERROR, "tenantId is not matches with this session.");

            if(languageCode == null)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Not supported languageCode or it is empty.");

            if(messageCode == null)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "messageCode shouldn't be empty.");
    
            if(messageContents == null)
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "messageContents shouldn't be empty.");
    
        }
    }

    
    @Before(event = CdsService.EVENT_CREATE, entity = ControlOptionMasters_.CDS_NAME)
    public void validateControlOptionMasterContents(List<ControlOptionMasters> items) {
        for (ControlOptionMasters item : items) {
            String tenantId = item.getTenantId();
            String messageCode = item.getChainCode();
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