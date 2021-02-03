package lg.sppCap.handlers.sp.sf;

import java.time.Instant;
import java.util.List;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.sp.fundingnotifyservice.SfFundingNotify;
import cds.gen.sp.fundingnotifyservice.SfFundingNotify_;




@Component
@ServiceName("sp.FundingNotifyService")
public class FundingNotifyService implements EventHandler {
    
    private final static Logger log = LoggerFactory.getLogger(FundingNotifyService.class);

    // Code Master
    @Autowired
    JdbcTemplate jdbc;
    
    @Before(event = CdsService.EVENT_CREATE, entity=SfFundingNotify_.CDS_NAME)
    public void beforeCreateFundingNotify(List<SfFundingNotify> SfFundingNotify) {
        if(log.isInfoEnabled())
            log.info("#### beforeCreateFundingNotify START....");

        Instant current = Instant.now();
        
        String funding_notify_number = "";
        String f_sql = "SELECT 'N' || YEAR(CURRENT_DATE) || '-' || LPAD(SP_SF_FUNDING_NOTIFY_SEQ.NEXTVAL, 3, '0') AS FUNDING_NOTIFY_NUMBER FROM DUMMY";
        
        funding_notify_number = jdbc.queryForObject(f_sql, String.class);

        for(SfFundingNotify fundingNotify : SfFundingNotify) {
            fundingNotify.setFundingNotifyNumber(funding_notify_number);
            fundingNotify.setLocalCreateDtm(current);
            fundingNotify.setLocalUpdateDtm(current);
        }
        
        if(log.isInfoEnabled())
            log.info("#### beforeCreateFundingNotify END....");
    }
}