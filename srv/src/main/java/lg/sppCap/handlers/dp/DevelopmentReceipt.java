package lg.sppCap.handlers.dp;

import java.util.List;
import org.springframework.stereotype.Component;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import java.time.Instant;

import cds.gen.dp.MoldMst_;
import cds.gen.dp.developmentreceiptservice.*;
import cds.gen.dp.developmentreceiptservice.MoldMasters_;

@Component
@ServiceName("dp.DevelopmentReceiptService")
public class DevelopmentReceipt implements EventHandler {

    // Development Receipt
    
    @Before(event = CdsService.EVENT_UPDATE, entity=MoldMasters_.CDS_NAME)
    public void beforeCreateCodeMasters(List<MoldMasters> moldMasters) {
        
        for(MoldMasters moldMaster : moldMasters) {
            moldMaster.setMoldReceiptFlag(true);
        }

    }

}