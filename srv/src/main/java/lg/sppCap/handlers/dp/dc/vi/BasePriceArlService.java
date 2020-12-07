package lg.sppCap.handlers.dp.dc.vi;

import java.math.BigDecimal;
import java.util.List;
// import java.util.HashMap;
// import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

// import com.sap.cds.services.cds.CdsCreateEventContext;
// import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
// import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.dp.basepricearlservice.BasePriceArlMaster;
import cds.gen.dp.basepricearlservice.BasePriceArlMaster_;
import cds.gen.dp.basepricearlservice.BasePriceArlDetail;
// import cds.gen.dp.basepricearlservice.BasePriceArlDetail_;

@Component
@ServiceName("dp.BasePriceArlService")
public class BasePriceArlService implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    // private Map<Object, Map<String, Object>> Base_Price_Arl_Master = new
    // HashMap<>();

    // @On(event = CdsService.EVENT_CREATE, entity = "AdminService.Products")
    // public void onCreate(CdsCreateEventContext context) {
    // context.getCqn().entries().forEach(e -> products.put(e.get("ID"), e));
    // context.setResult(context.getCqn().entries());
    // }

    @Before(event = { CdsService.EVENT_CREATE }, entity = BasePriceArlMaster_.CDS_NAME)
    public void beforeBasePriceArlMaster(List<BasePriceArlMaster> basePriceArlMasters) {
        System.out.println("#### beforeBasePriceArlMaster Started....");

        for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
            String tenant_id = basePriceArlMaster.getTenantId();

            // Init Data Setting : approval_number
            String approval_number;

            if (basePriceArlMaster.getApprovalNumber() == null) {
                String sql = "SELECT DP_APPROVAL_NUMBER_FUNC('" + tenant_id + "') FROM DUMMY";
                approval_number = jdbc.queryForObject(sql, String.class);
            } else {
                approval_number = basePriceArlMaster.getApprovalNumber();
            }

            System.out.println("# approval_number : " + approval_number);
            basePriceArlMaster.setApprovalNumber(approval_number);

            BigDecimal increament = new BigDecimal("1");
            List<BasePriceArlDetail> basePriceArlDetails = basePriceArlMaster.getDetails();
            
            for (BasePriceArlDetail basePriceArlDetail : basePriceArlDetails) {

                // Init Data Setting : item_sequence
                BigDecimal item_sequence;

                if (basePriceArlDetail.getItemSequence() == null) {
                    String sql = "SELECT DP_ITEM_SEQUENCE_FUNC('" + tenant_id + "', '" + approval_number + "', '" + increament + "') FROM DUMMY";
                    item_sequence = jdbc.queryForObject(sql, BigDecimal.class);
                    increament = increament.add(new BigDecimal("1"));
                } else {
                    item_sequence = basePriceArlDetail.getItemSequence();
                }

                System.out.println("# getItemSequence : " + item_sequence.toString());
                basePriceArlDetail.setItemSequence(item_sequence);
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

    // @On(event = CdsService.EVENT_READ, entity =
    // "BasePriceArlService.Base_Price_Arl_Master")
    // public void onRead(CdsReadEventContext context) {
    // context.setResult(Base_Price_Arl_Master.values());
    // }

}