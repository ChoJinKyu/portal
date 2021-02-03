package lg.sppCap.frame.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cds.gen.cm.util.sppusersessionservice.*;

@Component
@ServiceName(SppUserSessionService_.CDS_NAME)
public class SppUserSessionHandler implements EventHandler{
    
    @Autowired
    SppUserSession sppUserSession;

    @On(event = CdsService.EVENT_READ, entity = SppUserSession_.CDS_NAME) 
    public  void searchUserInfoSession(CdsReadEventContext context){
        List<Map<String, String>> result = new ArrayList<Map<String, String>>();
        Map<String, String> userMap = sppUserSession.getUserSessionInfo();
        result.add(userMap);
        context.setResult(result);
        context.setCompleted(); 
    }
}