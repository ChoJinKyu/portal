// package lg.sppCap.handlers.sp.sf;

// import java.util.List;
// import org.springframework.stereotype.Component;


// import cds.gen.sp.fundingapplicationservice.SfFundingApplication_;
// import cds.gen.sp.fundingapplicationservice.SfFundingApplication;
// import cds.gen.sp.fundingapplicationservice.FundingApplicationService_;

// import com.sap.cds.services.cds.CdsService;
// import com.sap.cds.services.handler.EventHandler;
// import com.sap.cds.services.handler.annotations.Before;
// import com.sap.cds.services.handler.annotations.ServiceName;
// import java.sql.Connection;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;
// import java.time.Instant;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Component;




// @Component
// @ServiceName("sp.fundingApplicationService")
// public class FundingApplicationService implements EventHandler {
    
//     private final static Logger log = LoggerFactory.getLogger(FundingNotifyService.class);
//     // Code Master
//     @Autowired
//     JdbcTemplate jdbc;
    
//     @Before(event = CdsService.EVENT_CREATE, entity=SfFundingApplication_.CDS_NAME)
//     public void beforeCreateFundingApplication(List<SfFundingApplication> SfFundingApplication) {

//         if(log.isInfoEnabled())
//             log.info("#### beforeCreateFundingApplication START....");

//         Instant current = Instant.now();

//         String funding_appl_number = "";
//         String f_sql = "SELECT 'A' || YEAR(CURRENT_DATE) || '-' || LPAD(SP_SF_FUNDING_APPLICATION_SEQ.NEXTVAL, 4, '0') AS FUNDING_APPL_NUMBER FROM DUMMY";
            
//         funding_appl_number = jdbc.queryForObject(f_sql, String.class);
        
//         for(SfFundingApplication fundingApplication : SfFundingApplication) {
//             fundingApplication.setFundingApplNumber(funding_appl_number);
//             fundingApplication.setLocalCreateDtm(current);
//             fundingApplication.setLocalUpdateDtm(current);
//         }

//         if(log.isInfoEnabled())
//             log.info("#### beforeCreateFundingApplication START....");
//     }
// }