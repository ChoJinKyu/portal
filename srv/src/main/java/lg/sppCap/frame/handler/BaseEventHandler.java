package lg.sppCap.frame.handler;

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
        if(locale == null) locale = new Locale("KO", "KR");
        return locale.getLanguage().toUpperCase();
    }
    
    /**
     * 
     * @param messageCode
     * @param context
     * @param replacement
     * @return
     * @throws Exception
     */
    protected String getMessage(String messageCode, EventContext context, Object... replacement){
        String tenantId = this.getTenantId();
        String languageCode = this.getLanguageCode(context);
        return this.getMessage(messageCode, tenantId, languageCode, replacement);
    }

    /**
     * 
     * @param messageCode
     * @param tenantId
     * @param languageCode
     * @param replacement
     * @return
     * @throws Exception
     */
    protected String getMessage(String messageCode, String tenantId, String languageCode, Object... replacement){
        return this.i18n.getMessageContent(tenantId, messageCode, languageCode, replacement);
    }
    
}