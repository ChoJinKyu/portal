package lg.sppCap.handlers.dp.vi;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import java.util.logging.Level;
import java.util.logging.Logger;

// Java Sql
import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import cds.gen.dp.basepricearlservice.BasePriceArlMaster;
import cds.gen.dp.basepricearlservice.BasePriceArlMaster_;
import cds.gen.dp.basepricearlservice.BasePriceArlDetail;
import cds.gen.dp.basepricearlservice.BasePriceArlDetail_;
import cds.gen.dp.basepricearlservice.BasePriceArlPrice;
import cds.gen.dp.basepricearlservice.BasePriceArlPrice_;

@Component
@ServiceName("dp.BasePriceArlService")
public class BasePriceArlService implements EventHandler {

    private final static Logger log = Logger.getGlobal();

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    UserInfo userInfo;

    @Autowired
    ParameterInfo parameterInfo;

    // @On(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    // public void onCreateBasePriceArlMaster(CdsCreateEventContext context, List<BasePriceArlMaster> basePriceArlMasters) {
    //     System.out.println("#### onCreateBasePriceArlMaster Started....");

    //     // UserInfo userInfo = context.getUserInfo();
    //     // log.info("## user ID : " + userInfo.getId());
    //     // log.info("## user isAuth : " + Boolean.toString(userInfo.isAuthenticated()));

    //     context.setResult(context.getCqn().entries());
    //     context.setCompleted();
    // }

    // @After(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    // public void afterCreateBasePriceArlMaster(CdsCreateEventContext context) {
    //     System.out.println("#### afterCreateBasePriceArlMaster Started....");
    //     log.info("## user ID : " + userInfo.getId());
    //     log.info("## user isAuth : " + Boolean.toString(userInfo.isAuthenticated()));

    //     // context.setResult(context.getCqn().entries());
    //     // context.setCompleted();
    // }

    /**
     * BasePriceArlMaster의 Update Before Event Handler
     */
    @Before(event = { CdsService.EVENT_UPDATE }, entity = BasePriceArlMaster_.CDS_NAME)
    public void beforeUpdateBasePriceArlMaster(List<BasePriceArlMaster> basePriceArlMasters) {
        // log.info("#### beforeUpdateBasePriceArlMaster Started....");
        System.out.println("#### beforeUpdateBasePriceArlMaster Started....");

        CallableStatement cstmt;
        ResultSet rs;
        String sql = "";

        /** 
         * basePriceArlMaster
        */
        for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
            String tenant_id = basePriceArlMaster.getTenantId();
            String approval_number = basePriceArlMaster.getApprovalNumber();

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
                    try {
                        Connection conn = jdbc.getDataSource().getConnection();

                        sql = "SELECT DP_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
                        cstmt = conn.prepareCall(sql);
                        cstmt.setString(1, tenant_id);
                        cstmt.setString(2, approval_number);
                        cstmt.setBigDecimal(3, increament);
                        rs = cstmt.executeQuery();

                        while (rs.next()) {
                            item_sequence = rs.getBigDecimal(1);
                            increament = increament.add(new BigDecimal("1"));
                        }
                    } catch (SQLException e) { 
                        e.printStackTrace();
                    }
                } else {
                    item_sequence = basePriceArlDetail.getItemSequence();
                }

                log.info("# item_sequence : " + item_sequence.toString());
                basePriceArlDetail.setItemSequence(item_sequence);
            }
        }
    }

    /**
     * BasePriceArlMaster의 Create Before Event Handler 
     */
    @Before(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    public void beforeCreateBasePriceArlMaster(List<BasePriceArlMaster> basePriceArlMasters) {
        // log.info("#### beforeCreateBasePriceArlMaster Started....");
        System.out.println("#### beforeCreateBasePriceArlMaster Started....");

        CallableStatement cstmt = null;
        ResultSet rs = null;
        String sql = "";

        /** 
         * basePriceArlMaster
        */
        for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
            String tenant_id = basePriceArlMaster.getTenantId();

            // Init Data Setting : approval_number
            String approval_number = "";

            if (basePriceArlMaster.getApprovalNumber() == null) {
                try {
                    Connection conn = jdbc.getDataSource().getConnection();

                    sql = "SELECT DP_APPROVAL_NUMBER_FUNC(?) FROM DUMMY";
                    cstmt = conn.prepareCall(sql);
                    cstmt.setString(1, tenant_id);
                    rs = cstmt.executeQuery();

                    while (rs.next()) {
                        approval_number = rs.getString(1);
                    }
                } catch (SQLException e) { 
                    e.printStackTrace();
                }
            } else {
                approval_number = basePriceArlMaster.getApprovalNumber();
            }

            log.info("# approval_number : " + approval_number);
            basePriceArlMaster.setApprovalNumber(approval_number);

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
                    try {
                        Connection conn = jdbc.getDataSource().getConnection();

                        sql = "SELECT DP_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
                        cstmt = conn.prepareCall(sql);
                        cstmt.setString(1, tenant_id);
                        cstmt.setString(2, approval_number);
                        cstmt.setBigDecimal(3, increament);
                        rs = cstmt.executeQuery();

                        while (rs.next()) {
                            item_sequence = rs.getBigDecimal(1);
                            increament = increament.add(new BigDecimal("1"));
                        }
                    } catch (SQLException e) { 
                        e.printStackTrace();
                    }
                } else {
                    item_sequence = basePriceArlDetail.getItemSequence();
                }

                log.info("# item_sequence : " + item_sequence.toString());
                basePriceArlDetail.setItemSequence(item_sequence);

                /**
                 * BasePriceArlPrice
                */
                // if (basePriceArlDetail.getPrices() != null) {
                //     List<BasePriceArlPrice> basePriceArlPrices = basePriceArlDetail.getPrices();

                //     for (BasePriceArlPrice basePriceArlPrice : basePriceArlPrices) {
                //         System.out.println("# BasePriceArlPrice TenantId : " + basePriceArlPrice.getTenantId());
                //         System.out.println("# BasePriceArlPrice ApprovalNumber : " + basePriceArlPrice.getApprovalNumber());
                //         System.out.println("# BasePriceArlPrice ItemSequence : " + (basePriceArlPrice.getItemSequence() == null ? "" : basePriceArlPrice.getItemSequence().toString()));
                //         System.out.println("# BasePriceArlPrice MarketCode : " + basePriceArlPrice.getMarketCode());
                //         System.out.println("# BasePriceArlPrice NewBasePrice : " + (basePriceArlPrice.getNewBasePrice() == null ? "" : basePriceArlPrice.getNewBasePrice().toString()));
                //         System.out.println("# BasePriceArlPrice NewBasePriceCurrencyCode : " + basePriceArlPrice.getNewBasePriceCurrencyCode());
                //         System.out.println("# BasePriceArlPrice CurrentBasePrice : " + (basePriceArlPrice.getCurrentBasePrice() == null ? "" : basePriceArlPrice.getCurrentBasePrice().toString()));
                //         System.out.println("# BasePriceArlPrice CurrentBasePriceCurrencyCode : " + basePriceArlPrice.getCurrentBasePriceCurrencyCode());
                //         System.out.println("# BasePriceArlPrice FirstPurchasingNetPrice : " + (basePriceArlPrice.getFirstPurchasingNetPrice() == null ? "" : basePriceArlPrice.getFirstPurchasingNetPrice()));
                //         System.out.println("# BasePriceArlPrice FirstPurNetpriceCurrCd : " + basePriceArlPrice.getFirstPurNetpriceCurrCd());
                //         System.out.println("# BasePriceArlPrice FirstPurNetpriceStrDt : " + (basePriceArlPrice.getFirstPurNetpriceStrDt() == null ? "" : basePriceArlPrice.getFirstPurNetpriceStrDt().toString()));
                //         System.out.println("# BasePriceArlPrice LocalCreateDtm : " + (basePriceArlPrice.getLocalCreateDtm() == null ? "" : basePriceArlPrice.getLocalCreateDtm().toString()));
                //         System.out.println("# BasePriceArlPrice LocalUpdateDtm : " + (basePriceArlPrice.getLocalUpdateDtm() == null ? "" : basePriceArlPrice.getLocalUpdateDtm().toString()));
                //     }
                // }
            }
        }
    }

    // @Before(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlDetail_.CDS_NAME)
    // public void beforeBasePriceArlDetail(List<BasePriceArlDetail> basePriceArlDetails) {
    //     System.out.println("#### BasePriceArlDetail Started....");

    //     for (BasePriceArlDetail basePriceArlDetail : basePriceArlDetails) {

    //         // Init Data Setting : item_sequence
    //         int item_sequence;

    //         if (basePriceArlDetail.getItemSequence() == null) {
    //             // String sql = "SELECT DP_ITEM_SEQUENCE_FUNC('" + tenant_id + "', '" + approval_number + "') FROM DUMMY";
    //             // item_sequence = jdbc.queryForObject(sql, Integer.class);
    //             item_sequence = 4;
    //         } else {
    //             item_sequence = basePriceArlDetail.getItemSequence().intValue();
    //         }

    //         System.out.println("# ItemSequence : " + Integer.toString(item_sequence));
    //     }
    // }

}