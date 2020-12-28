package lg.sppCap.handlers.dp;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import org.springframework.beans.factory.annotation.Qualifier;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Delete;
import com.sap.cds.Result;

import cds.gen.dp.moldapprovalv4service.*;
import cds.gen.dp.moldapprovalservice.*;

@Component
@ServiceName(MoldApprovalV4Service_.CDS_NAME)
public class MoldApprovalV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(MoldApprovalService_.CDS_NAME)
    private CdsService moldApprovalService;

    @On(event = SaveMoldApprovalContext.CDS_NAME)
    public void onSave(SaveMoldApprovalContext context){
        System.out.println(" >>>>>>> "+ context);

        Data data = context.getInputData();
        ApprovalMaster aMaster = data.getApprovalMaster();
        // Collection<ApprovalDetails> aDtlList = data.getApprovalDetails();
        // Collection<Approver> approverList = data.getApprover();
        // Collection<MoldMaster> mMasterList = data.getMoldMaster();
        // Collection<Referer> refList = data.getReferer();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        try {
            System.out.println(" aMaster "+ aMaster); 
            // System.out.println(" aDtlList "+ aDtlList); 
            // System.out.println(" approverList "+ approverList); 
            // System.out.println(" moldMasterList "+ mMasterList); 
            // System.out.println(" refList "+ refList); 
            ApprovalMasters mEtity =  ApprovalMasters.create();  
            mEtity.setTenantId(aMaster.getTenantId());
            mEtity.setApprovalNumber(aMaster.getApprovalNumber());
            mEtity.setCompanyCode(aMaster.getCompanyCode());
            mEtity.setOrgCode(aMaster.getOrgCode());
            mEtity.setChainCode(aMaster.getChainCode());
            mEtity.setApprovalTypeCode(aMaster.getApprovalTypeCode());
            mEtity.setApprovalTitle(aMaster.getApprovalTitle());
            mEtity.setApprovalContents(aMaster.getApprovalContents());
            mEtity.setApproveStatusCode(aMaster.getApproveStatusCode());
            mEtity.setRequestorEmpno(aMaster.getRequestorEmpno());
            mEtity.setRequestDate(aMaster.getRequestDate());
            mEtity.setAttchGroupNumber(aMaster.getAttchGroupNumber());
            mEtity.setLocalCreateDtm(aMaster.getLocalCreateDtm());
            mEtity.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
           // Connection conn = jdbc.getDataSource().getConnection(); 
          //  CqnUpdate masterUpdate = Update.entity(ApprovalMasters_.CDS_NAME).data(mEtity);
            


            context.setResult(msg);
            context.setCompleted();
        } catch (Exception e) {
           e.printStackTrace();
        }
    
    }    


    
}