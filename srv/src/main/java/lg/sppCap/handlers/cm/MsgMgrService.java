package lg.sppCap.handlers.cm;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cds.gen.cm.msgmgtservice.Message;
import cds.gen.cm.msgmgtservice.Message_;
import cds.gen.cm.msgmgtservice.MsgMgtService_;
import lg.sppCap.frame.handler.BaseEventHandler;

@Component
@ServiceName(MsgMgtService_.CDS_NAME)
public class MsgMgrService extends BaseEventHandler {

    @Autowired
    PersistenceService db;
    
    @Before(event = CdsService.EVENT_CREATE, entity = Message_.CDS_NAME)
    public void validateMessageCreation(Message message) {
        String messageCode = message.getMessageCode();
        String typeCode = message.getMessageTypeCode();
        if("MSG".equals(typeCode) && messageCode.length() != 8){
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Message(MSG)형 메시지의 코드는 8자리 문자여야 합니다.");
        }
    }
    
    @Before(event = CdsService.EVENT_UPDATE, entity = Message_.CDS_NAME)
    public void validateMessageModify(Message message) {
        String messageCode = message.getMessageCode();
        String typeCode = message.getMessageTypeCode();

        if("MSG".equals(typeCode) && messageCode.length() != 8){
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Message(MSG)형 메시지의 코드는 8자리 문자여야 합니다.");
        }
    }
    
}