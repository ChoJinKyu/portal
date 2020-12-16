package lg.sppCap.handlers.base;

import com.sap.cds.services.handler.EventHandler;

import org.springframework.beans.factory.annotation.Autowired;

import lg.sppCap.frame.i18n.Multilingual;

public class BaseEventHandler implements EventHandler {

    
    @Autowired
    protected Multilingual i18n;

    protected String getTenantId(){
        return "L2100";
    }

    protected String getLanguageCode(){
        return "KO";
    }
    
    protected String getMessage(String messageCode) throws Exception {
        String tenantId = this.getTenantId();
        String languageCode = this.getLanguageCode();
        return this.i18n.getMessageContent(tenantId, messageCode, languageCode);
    }
}