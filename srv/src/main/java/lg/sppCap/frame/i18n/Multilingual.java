package lg.sppCap.frame.i18n;

import java.util.Hashtable;
import java.util.Map;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cds.gen.cm.util.commonservice.Message;
import cds.gen.cm.util.commonservice.Message_;

@Component
public class Multilingual {
    
    private final static Logger log = LoggerFactory.getLogger(Multilingual.class);

    @Autowired
    private PersistenceService db;

    private final static Map<String, MessageByLang> CACHE = new Hashtable<>();
    
    /*
     * get cached MessageByLang
     */
    private MessageByLang getCachedMessageByLang(String messageCode) {
        return CACHE.get(messageCode);
    }
    
    /*
     * cache a new MessageByLang if not
     */
    private MessageByLang addMessage(String messageCode, String languageCode, Message message) {
        MessageByLang messageByLang = this.getCachedMessageByLang(messageCode);
        if(messageByLang == null){
            messageByLang = new MessageByLang();
        }
        messageByLang.setMessage(languageCode, message);
        return CACHE.put(messageCode, messageByLang);
    }


    /**
     * Getting a cached message content form the i18n message pool.
     * @param tenantId
     * @param messageCode
     * @param languageCode
     * @return message_content
     */
    public String getMessageContent(String tenantId, String messageCode, String languageCode) throws Exception {
        return this.getMessage(tenantId, messageCode, languageCode).getMessageContents();
    }

    /**
     * Getting a cached Message Entity form the i18n message pool.
     * @param tenantId
     * @param messageCode
     * @param languageCode
     * @return message 
     */
    public Message getMessage(String tenantId, String messageCode, String languageCode) throws Exception{
        MessageByLang messageByLang = getCachedMessageByLang(messageCode);
        if(messageByLang == null || messageByLang.getMessage(languageCode) == null){

            CqnSelect selectMessage = Select.from(Message_.class)
                .columns("message_contents", "message_type_code")
                .where(b -> 
                    b.tenant_id().eq(tenantId)
                    .and(b.language_code().eq(languageCode))
                    .and(b.message_code().eq(messageCode))
                );
            Message message = db.run(selectMessage)
                .first(Message.class)
                .orElseThrow(() -> new Exception(String.format("Message Not Exists. %s, %s, %s", tenantId, languageCode, messageCode)));
            
            this.addMessage(messageCode, languageCode, message);
            if(log.isInfoEnabled())
                log.info("Pooled a message {}_{}: {}", languageCode, messageCode, message.getMessageContents());

            messageByLang = getCachedMessageByLang(messageCode);
            return messageByLang.getMessage(languageCode);
        }else {
            return messageByLang.getMessage(languageCode);
        }
    }
    

    /*
     * class MessageByLang sub of Multilingual
     */
    private class MessageByLang {

        Map<String, Message> messages = new Hashtable<>();

        Message getMessage(String languageCode) {
            return this.messages.get(languageCode);
        }

        void setMessage(String languageCode, Message message){
            this.messages.put(languageCode, message);
        }

    }
}
