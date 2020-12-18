package lg.sppCap.handlers.base;

import java.util.Locale;

import com.sap.cds.services.EventContext;
import com.sap.cds.services.handler.EventHandler;

import org.springframework.beans.factory.annotation.Autowired;

import lg.sppCap.frame.i18n.Multilingual;

public class BaseEventHandler implements EventHandler {

    
    @Autowired
    protected Multilingual i18n;

    protected String getTenantId(){
        return "L2100";
    }

    /**
     * 
     * @param context
     * @return
     */
    protected String getLanguageCode(EventContext context){
        Locale locale = context.getParameterInfo().getLocale();
        return locale.getLanguage().toUpperCase();
    }
    
    /**
     * 
     * @param messageCode
     * @param context
     * @return
     * @throws Exception
     */
    protected String getMessage(String messageCode, EventContext context) throws Exception {
        String tenantId = this.getTenantId();
        String languageCode = this.getLanguageCode(context);
        return this.getMessage(messageCode, tenantId, languageCode);
    }

    /**
     * 
     * @param messageCode
     * @param tenantId
     * @param languageCode
     * @return
     * @throws Exception
     */
    protected String getMessage(String messageCode, String tenantId, String languageCode) throws Exception {
        return this.i18n.getMessageContent(tenantId, messageCode, languageCode);
    }
    
}