// package lg.sppCap.handlers.sp.sf;

// import java.util.List;
// import java.util.Collection;
// import org.springframework.stereotype.Component;
// import org.springframework.transaction.annotation.Transactional;

// import cds.gen.sp.fundingapplicationservice.SfFundingApplication_;
// import cds.gen.sp.fundingapplicationsupv4service.ApplSaveDataType;
// import cds.gen.sp.fundingapplicationsupv4service.FundingApplicationSupV4Service_;
// import cds.gen.sp.fundingapplicationsupv4service.ProcSaveTempContext;
// import cds.gen.sp.fundingapplicationservice.SfFundingApplication;
// import cds.gen.sp.fundingapplicationservice.FundingApplicationService_;

// import com.sap.cds.services.cds.CdsService;
// import com.sap.cds.services.handler.EventHandler;
// import com.sap.cds.services.handler.annotations.Before;
// import com.sap.cds.services.handler.annotations.On;
// import com.sap.cds.services.handler.annotations.ServiceName;
// import java.sql.Connection;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;
// import java.sql.SQLException;
// import java.time.Instant;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Component;

// @Component
// @ServiceName("sp.fundingApplicationSupV4Service")
// public class FundingApplicationServiceV4 implements EventHandler {

//     private final static Logger log = LoggerFactory.getLogger(FundingApplicationSupV4Service_.class);
//     // Code Master
//     @Autowired
//     JdbcTemplate jdbc;
    
//     @Transactional(rollbackFor = SQLException.class)
//     @On(event=ProcSaveTempContext.CDS_NAME)
//     public void onProcSaveTemp(ProcSaveTempContext context) {
//         if(log.isInfoEnabled())
//             log.info("#### beforeCreateFundingApplication START....");
        
//     }
// }