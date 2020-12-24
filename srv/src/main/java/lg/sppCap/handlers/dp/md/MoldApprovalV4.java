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

import cds.gen.dp.moldapprovalv4service.*;

@Component
@ServiceName(MoldApprovalV4Service_.CDS_NAME)
public class MoldApprovalV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @On(event = SaveMoldApprovalContext.CDS_NAME)
    public void onSave(SaveMoldApprovalContext context){
        System.out.println(" >>>>>>> "+ context);

        Data data = context.getInputData();
        ApprovalMaster aMaster = data.getApprovalMaster();
        Collection<ApprovalDetails> aDtlList = data.getApprovalDetails();
        Collection<Approver> approverList = data.getApprover();
        Collection<MoldMaster> mMasterList = data.getMoldMaster();
        Collection<Referer> refList = data.getReferer();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        try {
            Connection conn = jdbc.getDataSource().getConnection();


            System.out.println(" aMaster "+ aMaster); 
            System.out.println(" aDtlList "+ aDtlList); 
            System.out.println(" approverList "+ approverList); 
            System.out.println(" moldMasterList "+ mMasterList); 
            System.out.println(" refList "+ refList); 
            getApprovalMstInsert();           


            context.setResult(msg);
            context.setCompleted();
        } catch (Exception e) {
           e.printStackTrace();
        }
    
    }    

    // Approval_Mst Insert 문 
    private String getApprovalMstInsert(){
         StringBuffer sb = new StringBuffer(); 
         sb.append("INSERT INTO CM_APPROVAL_MST ");
         sb.append("( ");
         sb.append(",TENANT_ID ");
         sb.append(",APPROVAL_NUMBER ");
         sb.append(",LEGACY_APPROVAL_NUMBER ");
         sb.append(",COMPANY_CODE ");
         sb.append(",ORG_TYPE_CODE ");
         sb.append(",ORG_CODE ");
         sb.append(",CHAIN_CODE ");
         sb.append(",APPROVAL_TYPE_CODE ");
         sb.append(",APPROVAL_TITLE ");
         sb.append(",APPROVAL_CONTENTS ");
         sb.append(",APPROVE_STATUS_CODE ");
         sb.append(",REQUESTOR_EMPNO ");
         sb.append(",REQUEST_DATE ");
         sb.append(",ATTCH_GROUP_NUMBER ");
         sb.append(",LOCAL_CREATE_DTM ");
         sb.append(",LOCAL_UPDATE_DTM ");
         sb.append(",CREATE_USER_ID ");
         sb.append(",UPDATE_USER_ID ");
         sb.append(",SYSTEM_CREATE_DTM ");
         sb.append(",SYSTEM_UPDATE_DTM ");
         sb.append(") VALUES (");
         sb.append(",? "); // TENANT_ID 
         sb.append(",? "); // APPROVAL_NUMBER 
         sb.append(",? "); // LEGACY_APPROVAL_NUMBER
         sb.append(",? "); // COMPANY_CODE
         sb.append(",? "); // ORG_TYPE_CODE
         sb.append(",? "); // ORG_CODE
         sb.append(",? "); // CHAIN_CODE
         sb.append(",? "); // APPROVAL_TYPE_CODE
         sb.append(",? "); // APPROVAL_TITLE
         sb.append(",? "); // APPROVAL_CONTENTS
         sb.append(",? "); // APPROVE_STATUS_CODE
         sb.append(",? "); // REQUESTOR_EMPNO
         sb.append(",? "); // REQUEST_DATE 
         sb.append(",? "); // ATTCH_GROUP_NUMBER
         sb.append(",? "); // LOCAL_CREATE_DTM
         sb.append(",? "); // LOCAL_UPDATE_DTM
         sb.append(",? "); // CREATE_USER_ID
         sb.append(",? "); // UPDATE_USER_ID
         sb.append(",? "); // SYSTEM_CREATE_DTM
         sb.append(",? "); // SYSTEM_UPDATE_DTM 
         sb.append(")");
         System.out.println(" sb.toString() "+ sb.toString()); 
         return  sb.toString();
    }
    // Approval_Mst Update 문 
    private String getApprovalMstUpdate(){
         StringBuffer sb = new StringBuffer(); 
         sb.append("UPDATE CM_APPROVAL_MST SET ");
         sb.append(" APPROVAL_TITLE = ?");
         sb.append(",APPROVAL_CONTENTS = ? ");
         sb.append(",APPROVE_STATUS_CODE = ? ");
         sb.append(",REQUESTOR_EMPNO = ?");
         sb.append(",REQUEST_DATE = ?");
         sb.append(",ATTCH_GROUP_NUMBER = ? ");
         sb.append(",LOCAL_UPDATE_DTM = ? ");
         sb.append(",UPDATE_USER_ID = ? ");
         sb.append(",SYSTEM_UPDATE_DTM = ? ");
         sb.append(" WHERE APPROVAL_NUMBER = ?"); 
         System.out.println(" sb.toString() "+ sb.toString()); 
         return  sb.toString();
    }





}