package lg.sppCap.handlers.dp.dc.vi;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.dp.basepricearlservice.BasePriceArlMaster;
import cds.gen.dp.basepricearlservice.BasePriceArlMaster_;

@Component
@ServiceName("dp.BasePriceArlService")
public class BasePriceArlService implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    //private Map<Object, Map<String, Object>> Base_Price_Arl_Master = new HashMap<>();

    //  @On(event = CdsService.EVENT_CREATE, entity = "AdminService.Products")
    //  public void onCreate(CdsCreateEventContext context) {
    //      context.getCqn().entries().forEach(e -> products.put(e.get("ID"), e));
    //      context.setResult(context.getCqn().entries());
    //  }

    @Before(event = {CdsService.EVENT_CREATE}, entity = BasePriceArlMaster_.CDS_NAME)
    public void beforeBasePriceArlMaster(List<BasePriceArlMaster> basePriceArlMasters) {
        for (BasePriceArlMaster basePriceArlMaster : basePriceArlMasters) {
            String tenant_id = basePriceArlMaster.getTenantId();

            // Init Data Setting : approval_number
            String sql = "SELECT DP_APPROVAL_NUMBER_FUNC('" + tenant_id + "') FROM DUMMY";
            String approval_number = jdbc.queryForObject(sql, String.class);

            System.out.println("approval_number : " + approval_number);

            basePriceArlMaster.setApprovalNumber(approval_number);
        }
    }

    // @On(event = CdsService.EVENT_READ, entity = "BasePriceArlService.Base_Price_Arl_Master")
    // public void onRead(CdsReadEventContext context) {
    //     context.setResult(Base_Price_Arl_Master.values());
    // }

}