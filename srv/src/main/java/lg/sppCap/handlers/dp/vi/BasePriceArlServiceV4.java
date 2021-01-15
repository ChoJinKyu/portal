package lg.sppCap.handlers.dp.vi;

import lg.sppCap.frame.handler.BaseEventHandler;
import lg.sppCap.handlers.dp.vi.BasePriceArlValidationV4;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

// Java Util
import java.util.Collection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

// Log
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Java Sql
import java.sql.SQLException;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import cds.gen.dp.basepricearlservice.*;
import cds.gen.dp.basepricearlv4service.*;

@Component
@ServiceName(BasePriceArlV4Service_.CDS_NAME)
public class BasePriceArlServiceV4 extends BaseEventHandler {

    private static final Logger log = LoggerFactory.getLogger(BasePriceArlServiceV4.class);

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    UserInfo userInfo;

    @Autowired
    ParameterInfo parameterInfo;

    @Autowired
    BasePriceArlValidationV4 validator;

    @Transactional(rollbackFor = SQLException.class)
    @Before(event=DpViBasePriceArlMergeProcContext.CDS_NAME)
    public void beforeBasePriceArlMergeProcContext(DpViBasePriceArlMergeProcContext context) {
        log.info("#### beforeBasePriceArlMergeProcContext");

        String sql = "";

        Collection<BasePriceArlMstType> basePriceArlMasters = context.getInputData().getBasePriceArlMst();

        // 입력값이 없을 경우, 에러 처리
        if (basePriceArlMasters.isEmpty() || basePriceArlMasters.size() < 1) {
            // 메시지코드 정의 필요
            String msg = this.getMessage("EDP30001", context);
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        for (BasePriceArlMstType basePriceArlMaster : basePriceArlMasters) {
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

            System.out.println("# tenant_id : "       + basePriceArlMaster.getTenantId());
            System.out.println("# approval_number : " + basePriceArlMaster.getApprovalNumber());
            System.out.println("# ----------------------------------");

            /** 
             * BasePriceArlDetail
            */
            // Details가 없으면 종료
            if (basePriceArlMaster.getDetails() == null) return;

            BigDecimal increament = new BigDecimal("1");

            Collection<BasePriceArlDtlType> basePriceArlDetails = basePriceArlMaster.getDetails();

            for (BasePriceArlDtlType basePriceArlDetail : basePriceArlDetails) {
                basePriceArlDetail.setTenantId(tenant_id);
                basePriceArlDetail.setApprovalNumber(approval_number);

                // Init Data Setting : item_sequence
                BigDecimal item_sequence = new BigDecimal(1);

                if (basePriceArlDetail.getItemSequence() == null) {
                    sql = "SELECT DP_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
                    item_sequence = jdbc.queryForObject(sql, new Object[] { tenant_id, approval_number, increament }, BigDecimal.class);
                    basePriceArlDetail.setItemSequence(item_sequence);
                    increament = increament.add(new BigDecimal("1"));
                } else {
                    item_sequence = basePriceArlDetail.getItemSequence();
                }

                System.out.println("\t# tenant_id : "              + basePriceArlDetail.getTenantId());
                System.out.println("\t# approval_number : "        + basePriceArlDetail.getApprovalNumber());
                System.out.println("\t# item_sequence : "          + basePriceArlDetail.getItemSequence());
                System.out.println("\t# company_code : "           + basePriceArlDetail.getCompanyCode());
                System.out.println("\t# org_type_code : "          + basePriceArlDetail.getOrgTypeCode());
                System.out.println("\t# org_code : "               + basePriceArlDetail.getOrgCode());
                System.out.println("\t# au_code : "                + basePriceArlDetail.getAuCode());
                System.out.println("\t# material_code : "          + basePriceArlDetail.getMaterialCode());
                System.out.println("\t# supplier_code : "          + basePriceArlDetail.getSupplierCode());
                System.out.println("\t# base_date : "              + basePriceArlDetail.getBaseDate());
                System.out.println("\t# base_price_ground_code : " + basePriceArlDetail.getBasePriceGroundCode());
                System.out.println("\t# ----------------------------------");

                /** 
                 * BasePriceArlDetail
                */
                // Prices가 없으면 종료
                if (basePriceArlDetail.getPrices() == null) return;

                Collection<BasePriceArlPriceType> basePriceArlPrices = basePriceArlDetail.getPrices();

                for (BasePriceArlPriceType basePriceArlPrice : basePriceArlPrices) {
                    basePriceArlPrice.setTenantId(tenant_id);
                    basePriceArlPrice.setApprovalNumber(approval_number);
                    basePriceArlPrice.setItemSequence(item_sequence);

                    System.out.println("\t\t# tenant_id : "                          + basePriceArlPrice.getTenantId());
                    System.out.println("\t\t# approval_number : "                    + basePriceArlPrice.getApprovalNumber());
                    System.out.println("\t\t# item_sequence : "                      + basePriceArlPrice.getItemSequence());
                    System.out.println("\t\t# market_code : "                        + basePriceArlPrice.getMarketCode());
                    System.out.println("\t\t# new_base_price : "                     + basePriceArlPrice.getNewBasePrice());
                    System.out.println("\t\t# new_base_price_currency_code : "       + basePriceArlPrice.getNewBasePriceCurrencyCode());
                    System.out.println("\t\t# current_base_price : "                 + basePriceArlPrice.getCurrentBasePrice());
                    System.out.println("\t\t# current_base_price_currency_code : "   + basePriceArlPrice.getCurrentBasePriceCurrencyCode());
                    System.out.println("\t\t# first_purchasing_net_price : "         + basePriceArlPrice.getFirstPurchasingNetPrice());
                    System.out.println("\t\t# first_pur_netprice_curr_cd : "         + basePriceArlPrice.getFirstPurNetpriceCurrCd());
                    System.out.println("\t\t# first_pur_netprice_str_dt : "          + basePriceArlPrice.getFirstPurNetpriceStrDt());
                    System.out.println("\t\t# ----------------------------------");
                }
            }
        }
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=DpViBasePriceArlMergeProcContext.CDS_NAME)
    public void onBasePriceArlMergeProcContext(DpViBasePriceArlMergeProcContext context) {
        log.info("#### onBasePriceArlMergeProcContext");

        validator.validationBasePriceArlMaster(context, context.getInputData().getBasePriceArlMst());

        OutputDataType v_result = OutputDataType.create();

        v_result.setReturnCode("200");
        v_result.setReturnMsg("Success!");
        v_result.setReturnRs(context.getInputData().getBasePriceArlMst());

        context.setResult(v_result);
        context.setCompleted();
    }

    // @On(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    // public void onCreateBasePriceArlMaster(EventContext context, List<BasePriceArlMaster> basePriceArlMasters) {
    //     // log.info("#### onCreateBasePriceArlMaster Started....");

    //     validator.validationBasePriceArlMaster(context, basePriceArlMasters);

    //     // UserInfo userInfo = context.getUserInfo();
    //     // log.info("## user ID : " + userInfo.getId());
    //     // log.info("## user isAuth : " + Boolean.toString(userInfo.isAuthenticated()));

    //     // context.setResult(context.getCqn().entries());
    //     // context.setCompleted();
    // }

    // // @After(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    // // public void afterCreateBasePriceArlMaster(CdsCreateEventContext context) {
    // //     System.out.println("#### afterCreateBasePriceArlMaster Started....");
    // //     log.info("## user ID : " + userInfo.getId());
    // //     log.info("## user isAuth : " + Boolean.toString(userInfo.isAuthenticated()));

    // //     // context.setResult(context.getCqn().entries());
    // //     // context.setCompleted();
    // // }

    // /**
    //  * BasePriceArlMaster의 Create Before Event Handler 
    //  */
    // @Transactional(rollbackFor = SQLException.class)
    // @Before(event = { CdsService.EVENT_CREATE, CdsService.EVENT_UPDATE }, entity = BasePriceArlMaster_.CDS_NAME)
    // public void beforeBasePriceArlMaster(EventContext context, List<BasePriceArlMaster> basePriceArlMasters) {
    //     String event = context.getEvent();
    //     log.info("#### beforeBasePriceArlMaster Started.... (Evnet Type : " + event + ")");

    //     String sql = "";

    //     /** 
    //      * basePriceArlMaster
    //     */
    //     for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
    //         String tenant_id = basePriceArlMaster.getTenantId();

    //         // Init Data Setting : approval_number
    //         String approval_number = "";
            
    //         if (basePriceArlMaster.getApprovalNumber() == null || basePriceArlMaster.getApprovalNumber().equals("")) {
    //             sql = "SELECT DP_APPROVAL_NUMBER_FUNC(?) FROM DUMMY";
    //             approval_number = jdbc.queryForObject(sql, new Object[] { tenant_id }, String.class);
    //             basePriceArlMaster.setApprovalNumber(approval_number);
    //         } else {
    //             approval_number = basePriceArlMaster.getApprovalNumber();
    //         }

    //         log.info("# approval_number : " + approval_number);

    //         /** 
    //          * BasePriceArlDetail
    //         */
    //         // 상세가 없으면 종료
    //         if (basePriceArlMaster.getDetails() == null) return;
            
    //         BigDecimal increament = new BigDecimal("1");
    //         List<BasePriceArlDetail> basePriceArlDetails = basePriceArlMaster.getDetails();
            
    //         for (BasePriceArlDetail basePriceArlDetail : basePriceArlDetails) {

    //             // Init Data Setting : item_sequence
    //             BigDecimal item_sequence = new BigDecimal(1);

    //             if (basePriceArlDetail.getItemSequence() == null) {
    //                 sql = "SELECT DP_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
    //                 item_sequence = jdbc.queryForObject(sql, new Object[] { tenant_id, approval_number, increament }, BigDecimal.class);
    //                 increament = increament.add(new BigDecimal("1"));
    //             } else {
    //                 item_sequence = basePriceArlDetail.getItemSequence();
    //             }

    //             log.info("# item_sequence : " + item_sequence.toString());
    //             basePriceArlDetail.setItemSequence(item_sequence);
    //         }
    //     }
    // }
}