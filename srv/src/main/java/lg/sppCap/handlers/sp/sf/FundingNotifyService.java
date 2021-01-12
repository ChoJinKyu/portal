package lg.sppCap.handlers.sp.sf;

import java.util.List;
import org.springframework.stereotype.Component;

import cds.gen.sp.fundingnotifyservice.SfFundingNotify_;
import cds.gen.sp.fundingnotifyservice.SfFundingNotify;
import cds.gen.sp.fundingnotifyservice.FundingNotifyService_;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.Instant;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;




@Component
@ServiceName("sp.fundingNotifyService")
public class FundingNotifyService implements EventHandler {

    // Code Master
    @Autowired
    JdbcTemplate jdbc;
    
    @Before(event = CdsService.EVENT_CREATE, entity=SfFundingNotify_.CDS_NAME)
    public void beforeCreateFundingNotify(List<SfFundingNotify> SfFundingNotify) {
        System.out.println("#### beforeCreateFundingNotify START....");

        Instant current = Instant.now();
        String funding_notify_number = "";
        String f_sql = "SELECT 'N' || YEAR(CURRENT_DATE) || '-' || LPAD(SP_SF_FUNDING_NOTIFY_SEQ.NEXTVAL, 3, '0') AS FUNDING_NOTIFY_NUMBER FROM DUMMY";
        //String f_sql = "SELECT 'N' || YEAR(CURRENT_DATE) || '-' || LPAD(IFNULL(MAX(SUBSTR(FUNDING_NOTIFY_NUMBER, 7, 3)), 0)+1,3,'0') AS FUNDING_NOTIFY_NUMBER FROM SP_SF_FUNDING_NOTIFY WHERE TENANT_ID = 'L2100' AND SUBSTR(FUNDING_NOTIFY_NUMBER, 2, 4) = YEAR(CURRENT_DATE)";
        
        //ResultSet f_rs = null;    

        try {
            // Connection conn = jdbc.getDataSource().getConnection();
            
            // Local Temp Table 생성
            // PreparedStatement f_statement = conn.prepareStatement(f_sql);
            // f_rs = f_statement.executeQuery();
            
            // if(f_rs.next()) funding_notify_number = String.valueOf(f_rs.getString("FUNDING_NOTIFY_NUMBER"));
            
            funding_notify_number = jdbc.queryForObject(f_sql, String.class);

            for(SfFundingNotify fundingNotify : SfFundingNotify) {
                fundingNotify.setFundingNotifyNumber(funding_notify_number);
                fundingNotify.setLocalCreateDtm(current);
                fundingNotify.setLocalUpdateDtm(current);
            }
		} catch (Exception e) { 
			e.printStackTrace();
        }
        System.out.println("#### beforeCreateFundingNotify END....");
    }
}