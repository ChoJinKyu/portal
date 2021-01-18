package lg.sppCap.handlers.dp.vi;

import lg.sppCap.frame.handler.BaseEventHandler;
import lg.sppCap.handlers.dp.vi.BasePriceArlValidation;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.List;

// Log
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Java Sql
import java.sql.SQLException;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import cds.gen.dp.basepricearlservice.BasePriceArlMaster;
import cds.gen.dp.basepricearlservice.BasePriceArlMaster_;
import cds.gen.dp.basepricearlservice.BasePriceArlDetail;

@Component
@ServiceName("dp.BasePriceArlService")
public class BasePriceArlService extends BaseEventHandler {

    private static final Logger log = LoggerFactory.getLogger(BasePriceArlService.class);

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    UserInfo userInfo;

    @Autowired
    ParameterInfo parameterInfo;

    @Autowired
    BasePriceArlValidation validator;

    @On(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    public void onCreateBasePriceArlMaster(EventContext context, List<BasePriceArlMaster> basePriceArlMasters) {
        // log.info("#### onCreateBasePriceArlMaster Started....");

        validator.validationBasePriceArlMaster(context, basePriceArlMasters);

        // UserInfo userInfo = context.getUserInfo();
        // log.info("## user ID : " + userInfo.getId());
        // log.info("## user isAuth : " + Boolean.toString(userInfo.isAuthenticated()));

        // context.setResult(context.getCqn().entries());
        // context.setCompleted();
    }

    // @After(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    // public void afterCreateBasePriceArlMaster(CdsCreateEventContext context) {
    //     System.out.println("#### afterCreateBasePriceArlMaster Started....");
    //     log.info("## user ID : " + userInfo.getId());
    //     log.info("## user isAuth : " + Boolean.toString(userInfo.isAuthenticated()));

    //     // context.setResult(context.getCqn().entries());
    //     // context.setCompleted();
    // }

    /**
     * BasePriceArlMaster의 Create Before Event Handler 
     */
    @Transactional(rollbackFor = SQLException.class)
    @Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_UPDATE }, entity = BasePriceArlMaster_.CDS_NAME)
    public void beforeBasePriceArlMaster(EventContext context, List<BasePriceArlMaster> basePriceArlMasters) {
        String event = context.getEvent();
        log.info("#### beforeBasePriceArlMaster Started.... (Evnet Type : " + event + ")");

        String sql = "";

        /** 
         * basePriceArlMaster
        */
        for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
            String tenant_id = basePriceArlMaster.getTenantId();

            // Init Data Setting : approval_number
            String approval_number = "";
            
            if (basePriceArlMaster.getApprovalNumber() == null || basePriceArlMaster.getApprovalNumber().equals("")) {
                sql = "SELECT DP_APPROVAL_NUMBER_FUNC(?) FROM DUMMY";
                approval_number = jdbc.queryForObject(sql, new Object[] { tenant_id }, String.class);
                basePriceArlMaster.setApprovalNumber(approval_number);
            } else {
                approval_number = basePriceArlMaster.getApprovalNumber();
            }

            log.info("# approval_number : " + approval_number);

            /** 
             * BasePriceArlDetail
            */
            // 상세가 없으면 종료
            if (basePriceArlMaster.getDetails() == null) return;
            
            BigDecimal increament = new BigDecimal("1");
            List<BasePriceArlDetail> basePriceArlDetails = basePriceArlMaster.getDetails();
            
            for (BasePriceArlDetail basePriceArlDetail : basePriceArlDetails) {

                // Init Data Setting : item_sequence
                BigDecimal item_sequence = new BigDecimal(1);

                if (basePriceArlDetail.getItemSequence() == null) {
                    sql = "SELECT DP_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
                    item_sequence = jdbc.queryForObject(sql, new Object[] { tenant_id, approval_number, increament }, BigDecimal.class);
                    increament = increament.add(new BigDecimal("1"));
                } else {
                    item_sequence = basePriceArlDetail.getItemSequence();
                }

                log.info("# item_sequence : " + item_sequence.toString());
                basePriceArlDetail.setItemSequence(item_sequence);
            }
        }
    }
}