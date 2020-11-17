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
    
    @Before(event = CdsService.EVENT_CREATE, entity=CodeMasters_.CDS_NAME)
    public void beforeCreateCodeMasters(List<CodeMasters> codeMasters) {
        
        Instant current = Instant.now();

        for(CodeMasters codeMaster : codeMasters) {
            //codeMaster.setSystemCreateDtm(current);
            //codeMaster.setSystemUpdateDtm(current);
            codeMaster.setLocalCreateDtm(current);
            codeMaster.setLocalUpdateDtm(current);
            //codeMaster.setUpdateUserId("Temp");
            //codeMaster.setCreateUserId("Temp");
        }

    }

    @Before(event = CdsService.EVENT_UPDATE, entity=CodeMasters_.CDS_NAME)
    public void beforeUpdateCodeMasters(List<CodeMasters> codeMasters) {
        
        Instant current = Instant.now();

        for(CodeMasters codeMaster : codeMasters) {
            //codeMaster.setSystemUpdateDtm(current);
            codeMaster.setLocalUpdateDtm(current);
            //codeMaster.setUpdateUserId("Temp");
            //codeMaster.setCreateUserId("Temp");
        }

    }


    /*
    @After(event = CdsService.EVENT_READ, entity = CodeMasters_.CDS_NAME)
    public void afterReadCodeMasters(List<CodeMasters> codeMasters) {
        for(CodeMasters codeMaster : codeMasters) {
            codeMaster.setGroupDescription(codeMaster.getGroupDescription() + " desc");
        }
    }
    */



    // Code Detail

    @Before(event = CdsService.EVENT_CREATE, entity=CodeDtl_.CDS_NAME)
    public void beforeCreateCodeDetails(List<CodeDetails> codeDetails) {
        
        Instant current = Instant.now();

        for(CodeDetails codeDetail : codeDetails) {
            //codeDetail.setSystemCreateDtm(current);
            //codeDetail.setSystemUpdateDtm(current);
            codeDetail.setLocalCreateDtm(current);
            codeDetail.setLocalUpdateDtm(current);
            //codeDetail.setUpdateUserId("Temp");
            //codeDetail.setCreateUserId("Temp");
        }

    }

    @Before(event = CdsService.EVENT_UPDATE, entity=CodeDtl_.CDS_NAME)
    public void beforeUpdateCodeDetails(List<CodeDetails> codeDetails) {
        
        Instant current = Instant.now();

        for(CodeDetails codeDetail : codeDetails) {
            //codeDetail.setSystemUpdateDtm(current);
            codeDetail.setLocalUpdateDtm(current);
            //codeDetail.setUpdateUserId("Temp");
            //codeDetail.setCreateUserId("Temp");
        }

    }

}