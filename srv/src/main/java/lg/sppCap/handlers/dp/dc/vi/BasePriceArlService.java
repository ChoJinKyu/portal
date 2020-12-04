package lg.sppCap.handlers.dp.dc.vi;

 import java.util.HashMap;
 import java.util.Map;

 import org.springframework.stereotype.Component;

//  import com.sap.cds.services.cds.CdsCreateEventContext;
 import com.sap.cds.services.cds.CdsReadEventContext;
 import com.sap.cds.services.cds.CdsService;
 import com.sap.cds.services.handler.EventHandler;
 import com.sap.cds.services.handler.annotations.On;
 import com.sap.cds.services.handler.annotations.ServiceName;

 @Component
 @ServiceName("dp.BasePriceArlService")
 public class BasePriceArlService implements EventHandler {

     private Map<Object, Map<String, Object>> Base_Price_Arl_Master = new HashMap<>();

    //  @On(event = CdsService.EVENT_CREATE, entity = "AdminService.Products")
    //  public void onCreate(CdsCreateEventContext context) {
    //      context.getCqn().entries().forEach(e -> products.put(e.get("ID"), e));
    //      context.setResult(context.getCqn().entries());
    //  }

     @On(event = CdsService.EVENT_READ, entity = "BasePriceArlService.Base_Price_Arl_Master")
     public void onRead(CdsReadEventContext context) {
         context.setResult(Base_Price_Arl_Master.values());
     }

 }