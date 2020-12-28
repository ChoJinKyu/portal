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
        //System.out.println(" >>>>>>> "+ context);

        Data data = context.getInputData();

        ApprovalMasterV4 aMaster = data.getApprovalMaster();
        Collection<ApprovalDetailsV4> approvalDetail = data.getApprovalDetails();
        Collection<ApproverV4> approverList = data.getApprover();
        Collection<MoldMasterV4> mMasterList = data.getMoldMaster();
        Collection<RefererV4> refList = data.getReferer();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

       String approvalNumber = aMaster.getApprovalNumber();


        try {
            if(approvalNumber != "" && approvalNumber != null){ // update 
                ApprovalMasters master =  ApprovalMasters.create();  
                master.setTenantId(aMaster.getTenantId());
                master.setApprovalNumber(aMaster.getApprovalNumber());
                master.setCompanyCode(aMaster.getCompanyCode());
                master.setOrgCode(aMaster.getOrgCode());
                master.setChainCode(aMaster.getChainCode());
                master.setApprovalTypeCode(aMaster.getApprovalTypeCode());
                master.setApprovalTitle(aMaster.getApprovalTitle());
                master.setApprovalContents(aMaster.getApprovalContents());
                master.setApproveStatusCode(aMaster.getApproveStatusCode());
                master.setRequestorEmpno(aMaster.getRequestorEmpno());
                master.setRequestDate(aMaster.getRequestDate());
                master.setAttchGroupNumber(aMaster.getAttchGroupNumber());
               // master.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                master.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                master.setUpdateUserId(aMaster.getUpdateUserId());
                CqnUpdate masterUpdate = Update.entity(ApprovalMasters_.CDS_NAME).data(master);
                Result resultDetail = moldApprovalService.run(masterUpdate);

                if(!approvalDetail.isEmpty() && approvalDetail.size() > 0){ 
                   
                    for(ApprovalDetailsV4 row : approvalDetail){
                        ApprovalDetails detail = ApprovalDetails.create();

                        detail.setTenantId(row.getTenantId());
                        detail.setApprovalNumber(approvalNumber);
                        detail.setMoldId(row.getMoldId());
                    
                        detail.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        detail.setUpdateUserId(aMaster.getUpdateUserId()); 
                        System.out.println(" row "+ row);
                        System.out.println(" row ... "+ row.getRowState());

                        if(row.getRowState() == "C"){
                            detail.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                            detail.setCreateUserId(aMaster.getCreateUserId());
                            CqnInsert i = Insert.into(ApprovalDetails_.CDS_NAME).entry(detail); 
                            Result rst = moldApprovalService.run(i);
                        }else if(row.getRowState() == "D"){
                            Delete d = Delete.from(ApprovalDetails_.CDS_NAME).matching(detail); 
                            Result rst = moldApprovalService.run(d);
                        }else{
                            CqnUpdate u = Update.entity(ApprovalDetails_.CDS_NAME).data(detail); 
                            Result rst = moldApprovalService.run(u);
                        }

                        
                    }  
                }

                if(aMaster.getApprovalTypeCode() == "B"){ // 각각 타입마다 mold Master에 update 할 내용이 다르므로 분기 처리 

                }else if(aMaster.getApprovalTypeCode() == "V"){

                }else if(aMaster.getApprovalTypeCode() == "E"){

                }


            }else{ // create 

            }

           // Connection conn = jdbc.getDataSource().getConnection(); 
            





           

            context.setResult(msg);
            context.setCompleted();
        } catch (Exception e) {
           e.printStackTrace();
        }
    
    }    


    // budgetExecution 
     


    
}