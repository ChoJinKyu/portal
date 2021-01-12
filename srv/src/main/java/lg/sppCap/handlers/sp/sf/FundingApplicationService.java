package lg.sppCap.handlers.sp.sf;

import java.util.List;
import org.springframework.stereotype.Component;


import cds.gen.sp.fundingapplicationservice.SfFundingApplication_;
import cds.gen.sp.fundingapplicationservice.SfFundingApplication;
import cds.gen.sp.fundingapplicationservice.FundingApplicationService_;

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
@ServiceName("sp.fundingApplicationService")
public class FundingApplicationService implements EventHandler {

    // Code Master
    @Autowired
    JdbcTemplate jdbc;
    
    @Before(event = CdsService.EVENT_CREATE, entity=SfFundingApplication_.CDS_NAME)
    public void beforeCreateFundingApplication(List<SfFundingApplication> SfFundingApplication) {
        System.out.println("#### beforeCreateFundingApplication START....");

        Instant current = Instant.now();

        
        String funding_appl_number = "";
        String f_sql = "SELECT 'A' || YEAR(CURRENT_DATE) || '-' || LPAD(SP_SF_FUNDING_APPLICATION_SEQ.NEXTVAL, 4, '0') AS FUNDING_APPL_NUMBER FROM DUMMY";
        //ResultSet f_rs = null;

        try {
            
            //Connection conn = jdbc.getDataSource().getConnection();
            
            // Local Temp Table 생성
            // PreparedStatement f_statement = conn.prepareStatement(f_sql);
            
            // f_rs = f_statement.executeQuery();
            
            //if(f_rs.next()) funding_appl_number = String.valueOf(f_rs.getString("FUNDING_APPL_NUMBER"));
            
            funding_appl_number = jdbc.queryForObject(f_sql, String.class);
            System.out.println("FUNDING_APPL_NUMBER  :  :  "+funding_appl_number);
            for(SfFundingApplication fundingApplication : SfFundingApplication) {
                fundingApplication.setFundingApplNumber(funding_appl_number);
                fundingApplication.setLocalCreateDtm(current);
                fundingApplication.setLocalUpdateDtm(current);
            }
		} catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("#### beforeCreateFundingApplication END....");
    }
}