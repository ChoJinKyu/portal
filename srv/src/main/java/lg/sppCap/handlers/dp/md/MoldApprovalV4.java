package lg.sppCap.handlers.dp.md;

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
import java.math.BigDecimal;
import java.util.Calendar;

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

    private String APPROVAL_NUMBER;

    @On(event = SaveMoldApprovalContext.CDS_NAME)
    public void onSave(SaveMoldApprovalContext context){

        Data data = context.getInputData();

        ApprovalMasterV4 aMaster = data.getApprovalMaster();

        System.out.println("aMaster>>> " + aMaster);

        Collection<ApprovalDetailsV4> approvalDetail = data.getApprovalDetails();
        Collection<ApproverV4> approverList = data.getApprover();
        Collection<RefererV4> refList = data.getReferer();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("NCM01001");
        msg.setResultCode(0);
        msg.setCompanyCode(aMaster.getCompanyCode());
        msg.setPlantCode(aMaster.getOrgCode());
        String approvalNumber = aMaster.getApprovalNumber();

        try {

            if(approvalNumber != null && !approvalNumber.equals("New") && !approvalNumber.equals("")){ // update 
                msg.setApprovalNumber(aMaster.getApprovalNumber());
                this.APPROVAL_NUMBER = aMaster.getApprovalNumber();
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

                        if(row.getRowState().equals("C")){
                            detail.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                            detail.setCreateUserId(aMaster.getCreateUserId());
                            CqnInsert i = Insert.into(ApprovalDetails_.CDS_NAME).entry(detail); 
                            Result rst = moldApprovalService.run(i);
                        }else if(row.getRowState().equals("D")){
                            ApprovalDetails del =  ApprovalDetails.create(); // 삭제는 삭제에 필요한 키만 세팅 해 주어야 하네..
                            del.setTenantId(row.getTenantId());
                            del.setApprovalNumber(approvalNumber);
                            del.setMoldId(row.getMoldId());
                            Delete d = Delete.from(ApprovalDetails_.CDS_NAME).matching(del); 
                            Result rst = moldApprovalService.run(d);
                        }else{
                            CqnUpdate u = Update.entity(ApprovalDetails_.CDS_NAME).data(detail); 
                            Result rst = moldApprovalService.run(u);
                        }
 
                    }  
                } // approvalDetail 저장 

                // 각각 타입마다 mold Master에 update 할 내용이 다르므로 분기 처리
                if(aMaster.getApprovalTypeCode().equals("B")){  
                    this.saveBudgetExecution(data);
                }else if(aMaster.getApprovalTypeCode().equals("V")){
                    this.savePurchaseOrder(data);
                }else if(aMaster.getApprovalTypeCode().equals("E")){
                    this.saveParticipatingSelection(data);
                }
  
                 // 다 삭제 하고 다시 insert 한다.
                Approvers del = Approvers.create();
                del.setTenantId(aMaster.getTenantId());
                del.setApprovalNumber(approvalNumber); 
                Delete d = Delete.from(Approvers_.CDS_NAME).matching(del); 
                Result rst = moldApprovalService.run(d);

                if(!approverList.isEmpty() && approverList.size() > 0){ 
                    for(ApproverV4 row : approverList){
                           Approvers approver = Approvers.create();
                            approver.setTenantId(row.getTenantId());
                            approver.setApprovalNumber(approvalNumber);
                            approver.setApproveSequence(row.getApproveSequence());
                            approver.setApproverTypeCode(row.getApproverTypeCode());
                            approver.setApproverEmpno(row.getApproverEmpno());
                            approver.setApproveStatusCode(row.getApproveStatusCode());
                            approver.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                            approver.setUpdateUserId(aMaster.getUpdateUserId()); 
                            approver.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                            approver.setCreateUserId(aMaster.getCreateUserId());
                            CqnInsert i = Insert.into(Approvers_.CDS_NAME).entry(approver); 
                            Result rst2 = moldApprovalService.run(i); 
                    } // for 
                }// if  

                // 다 삭제 하고 다시 insert 한다.
                Referers del2 = Referers.create();
                del2.setTenantId(aMaster.getTenantId());
                del2.setApprovalNumber(approvalNumber); 
                Delete d2 = Delete.from(Referers_.CDS_NAME).matching(del2); 
                Result rst2 = moldApprovalService.run(d2);               
                if(!refList.isEmpty() && refList.size() > 0){ 
                    for(RefererV4 row : refList){
                        Referers referer = Referers.create();
                        referer.setTenantId(row.getTenantId());
                        referer.setApprovalNumber(approvalNumber);
                        referer.setRefererEmpno(row.getRefererEmpno());
                        referer.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        referer.setUpdateUserId(aMaster.getUpdateUserId()); 
                        referer.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                        referer.setCreateUserId(aMaster.getCreateUserId());
                        CqnInsert i = Insert.into(Referers_.CDS_NAME).entry(referer); 
                        Result rst3 = moldApprovalService.run(i); 
                    } // for 
                }// if   

                 
            
            }else{ // create 

                String approvalNumer_create = this.getApprovalNumber(data);
                msg.setApprovalNumber(approvalNumer_create);
                this.APPROVAL_NUMBER = approvalNumer_create; 
                ApprovalMasters master =  ApprovalMasters.create();  
                master.setTenantId(aMaster.getTenantId());
                master.setApprovalNumber(approvalNumer_create);
                master.setOrgTypeCode("AU");
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
                master.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                master.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                master.setUpdateUserId(aMaster.getUpdateUserId());

                CqnInsert masterInsert = Insert.into(ApprovalMasters_.CDS_NAME).entry(master);
                Result resultDetail = moldApprovalService.run(masterInsert);

                if(!approvalDetail.isEmpty() && approvalDetail.size() > 0){ 
                   
                    for(ApprovalDetailsV4 row : approvalDetail){
                        ApprovalDetails detail = ApprovalDetails.create();

                        detail.setTenantId(row.getTenantId());
                        detail.setApprovalNumber(approvalNumer_create);
                        detail.setMoldId(row.getMoldId());
                        detail.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        detail.setUpdateUserId(aMaster.getUpdateUserId()); 

                        if(row.getRowState().equals("C")){
                            detail.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                            detail.setCreateUserId(aMaster.getCreateUserId());
                            CqnInsert i = Insert.into(ApprovalDetails_.CDS_NAME).entry(detail); 
                            Result rst = moldApprovalService.run(i);
                        }else if(row.getRowState().equals("D")){
                            ApprovalDetails del =  ApprovalDetails.create(); // 삭제는 삭제에 필요한 키만 세팅 해 주어야 하네..
                            del.setTenantId(row.getTenantId());
                            del.setApprovalNumber(approvalNumer_create);
                            del.setMoldId(row.getMoldId());
                            Delete d = Delete.from(ApprovalDetails_.CDS_NAME).matching(del); 
                            Result rst = moldApprovalService.run(d);
                        }else{
                            CqnUpdate u = Update.entity(ApprovalDetails_.CDS_NAME).data(detail); 
                            Result rst = moldApprovalService.run(u);
                        }
 
                    }  
                } // approvalDetail 저장 

                // 각각 타입마다 mold Master에 update 할 내용이 다르므로 분기 처리
                if(aMaster.getApprovalTypeCode().equals("B")){  
                    this.saveBudgetExecution(data);
                }else if(aMaster.getApprovalTypeCode().equals("V")){
                    this.savePurchaseOrder(data);
                }else if(aMaster.getApprovalTypeCode().equals("E")){
                    this.saveParticipatingSelection(data);
                }

                if(!approverList.isEmpty() && approverList.size() > 0){ 
                    for(ApproverV4 row : approverList){
                           Approvers approver = Approvers.create();
                            approver.setTenantId(row.getTenantId());
                            approver.setApprovalNumber(approvalNumer_create);
                            approver.setApproveSequence(row.getApproveSequence());
                            approver.setApproverTypeCode(row.getApproverTypeCode());
                            approver.setApproverEmpno(row.getApproverEmpno());
                            approver.setApproveStatusCode(row.getApproveStatusCode());
                            approver.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                            approver.setUpdateUserId(aMaster.getUpdateUserId()); 
                            approver.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                            approver.setCreateUserId(aMaster.getCreateUserId());
                            CqnInsert i = Insert.into(Approvers_.CDS_NAME).entry(approver); 
                            Result rst2 = moldApprovalService.run(i); 
                    } // for 
                }// if  
          
                if(!refList.isEmpty() && refList.size() > 0){ 
                    for(RefererV4 row : refList){
                        Referers referer = Referers.create();
                        referer.setTenantId(row.getTenantId());
                        referer.setApprovalNumber(approvalNumer_create);
                        referer.setRefererEmpno(row.getRefererEmpno());
                        referer.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        referer.setUpdateUserId(aMaster.getUpdateUserId()); 
                        referer.setLocalCreateDtm(aMaster.getLocalCreateDtm());
                        referer.setCreateUserId(aMaster.getCreateUserId());
                        CqnInsert i = Insert.into(Referers_.CDS_NAME).entry(referer); 
                        Result rst3 = moldApprovalService.run(i); 
                    } // for 
                }// if 

            }

        } catch (Exception e) {
            msg.setMessageCode("FAILURE");
            msg.setResultCode(-1);
            e.printStackTrace();
        }

        context.setResult(msg);
        context.setCompleted();
    
    }    
    
    @On(event = DeleteApprovalContext.CDS_NAME)
    public void onDelete(DeleteApprovalContext context){

        ApprDeleteData data = context.getInputData();

        Collection<ApprovalMasterV4> aMaster = data.getApprovalMaster();
        ResultMsg msg = ResultMsg.create();
            
        System.out.println("data>>> " + data);
        System.out.println("aMaster>>> " + aMaster);
        try {
            if(!aMaster.isEmpty() && aMaster.size() > 0){
                for(ApprovalMasterV4 row : aMaster ){

                    System.out.println("ApprovalMasterV4 ::::::" + row);
                    msg.setMessageCode("NCM01002");
                    msg.setResultCode(0);
                    msg.setCompanyCode(row.getCompanyCode());
                    msg.setPlantCode(row.getOrgCode());
                    
        
                    System.out.println("msg >>>>>" + msg);
                    
                    ApprovalMasters del = ApprovalMasters.create();
                    del.setApprovalNumber(row.getApprovalNumber()); 
                    del.setTenantId(row.getTenantId());
                    del.setCompanyCode(row.getCompanyCode()); 
                    del.setOrgCode(row.getOrgCode()); 
                    // Delete d = Delete.from(ApprovalMasters_.CDS_NAME).matching(del); 
                    // Result rst = moldApprovalService.run(d);
                    int mold_id;

                    String sql="SELECT MOLD_ID FROM DP_MD_APPROVAL_DTL WHERE APPROVAL_NUMBER='"+row.getApprovalNumber()+"'";
                    Connection conn = jdbc.getDataSource().getConnection();
                    // Local Temp Table 생성
                    PreparedStatement statement = conn.prepareStatement(sql);
                    ResultSet rs = null;    
                    rs = statement.executeQuery();

                    ArrayList<String> moldNums = new ArrayList<String>();
                    while (rs.next()) { 
                        moldNums.add(rs.getString(1));
                    }

                    System.out.println("Approval_number ::: "+ row.getApprovalNumber()+ "MOLD_ID ============= "+moldNums);

                    for(int i=0; i< moldNums.size(); i++){
                        String sql2="SELECT CURRENCY_CODE, TARGET_AMOUNT FROM DP_MD_MST WHERE MOLD_ID='"+moldNums.get(i)+"'";
                        PreparedStatement statement2 = conn.prepareStatement(sql2);
                        rs = statement2.executeQuery();
                        ArrayList<String> moldTblData = new ArrayList<String>();
                        
                        while (rs.next()) { 
                            moldTblData.add(rs.getString(1));
                            moldTblData.add(rs.getString(2));
                        }
                        System.out.println("moldTblData :::::"+moldTblData);
                        System.out.println("moldTblData :::::"+moldTblData.get(0));
                        System.out.println("moldTblData :::::"+moldTblData.get(1));
                        //UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]

                        String sql3="UPDATE DP_MD_MST SET CURRENCY_CODE='"+moldTblData.get(1)+"', TARGET_AMOUNT='"+moldTblData.get(2)+"'";
                    }

                    

                    // // Quotation 삭제
                    // String sql="DELETE FROM DP_MD_QUOTATION WHERE APPROVAL_NUMBER='"+row.getApprovalNumber()+"'";
                    // // Referer 삭제
                    // String sql3="DELETE FROM CM_REFERER WHERE APPROVAL_NUMBER='"+row.getApprovalNumber()+"'";
                    // // Approver 삭제
                    // String sql4="DELETE FROM CM_APPROVER WHERE APPROVAL_NUMBER='"+row.getApprovalNumber()+"'";
                    // // Approval_DTL 삭제
                    // String sql5="DELETE FROM DP_MD_APPROVAL_DTL WHERE APPROVAL_NUMBER='"+row.getApprovalNumber()+"'";
                    

                    // mold_id=jdbc.queryForObject(sql,Integer.class);
                    // System.out.println("mold_id >>>>>>", mold_id);
                }
            }
        }
        catch (Exception e) {
            msg.setMessageCode("FAILURE");
            msg.setResultCode(-1);
            e.printStackTrace();
        }
        context.setResult(msg);
        context.setCompleted();
    } 
    private String getApprovalNumber(Data data){ 
         /**
         * 품의서 번호 B20-00000001
         *  'B2-00000009'
         * : B20-0000001 (품의서 Type + 연도(YY) + 일련번호 8자리) → 검토 후 확정 예정
         */
        Calendar cal = Calendar.getInstance();
        String year = (cal.get(Calendar.YEAR)+"").substring(2,4) ;
        String approvalNumer = "";
        ApprovalMasterV4 aMaster = data.getApprovalMaster(); 
        String sql="SELECT DP_MD_APPROVAL_SEQ.NEXTVAL FROM DUMMY";
        int seq=jdbc.queryForObject(sql,Integer.class);
        approvalNumer = aMaster.getApprovalTypeCode() + year +"-"+ String.format("%08d", seq);

        return approvalNumer;
    }


    // budgetExecution 
    private void saveBudgetExecution( Data data ){

        System.out.println(" approvalNumer " + this.APPROVAL_NUMBER);

        ApprovalMasterV4 aMaster = data.getApprovalMaster();
        Collection<MoldMasterV4> mMasterList = data.getMoldMaster();
    
        if(!mMasterList.isEmpty() && mMasterList.size() > 0){
            for(MoldMasterV4 row : mMasterList ){

                System.out.println(" ApprovalMasterV4 " + row);

                MoldMasters m = MoldMasters.create();
                m.setTenantId(row.getTenantId());
                m.setMoldId(row.getMoldId());
                m.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                m.setUpdateUserId(aMaster.getUpdateUserId()); 

                if(row.getRowState().equals("D")){ // 삭제일 경우 수정되는 항목에 대한 리셋 
                    m.setAccountCode("");
                    m.setInvestmentEcstTypeCode("");
                    m.setAccountingDepartmentCode("");
                    m.setImportCompanyCode("");
                    m.setProjectCode("");
                    m.setImportCompanyOrgCode("");
                    m.setMoldProductionTypeCode("");
                    m.setMoldItemTypeCode("");
                    m.setProvisionalBudgetAmount(null);
                    m.setAssetTypeCode("");
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }else{ 
                    m.setAccountCode(row.getAccountCode());
                    m.setInvestmentEcstTypeCode(row.getInvestmentEcstTypeCode());
                    m.setAccountingDepartmentCode(row.getAccountingDepartmentCode());
                    m.setImportCompanyCode(row.getImportCompanyCode());
                    m.setProjectCode(row.getProjectCode());
                    m.setImportCompanyOrgCode(row.getImportCompanyOrgCode());
                    m.setMoldProductionTypeCode(row.getMoldProductionTypeCode());
                    m.setMoldItemTypeCode(row.getMoldItemTypeCode());
                    m.setProvisionalBudgetAmount(new BigDecimal((String)(row.getProvisionalBudgetAmount()==null?"0":row.getProvisionalBudgetAmount())));
                    m.setAssetTypeCode(row.getAssetTypeCode());
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }

            }  
        }
    } 

    // ParticipatingSelection 
    private void saveParticipatingSelection( Data data ){

        System.out.println(" approvalNumer " + this.APPROVAL_NUMBER);

        ApprovalMasterV4 aMaster = data.getApprovalMaster();
        Collection<MoldMasterV4> mMasterList = data.getMoldMaster();
        
        Collection<QuotationV4> qtnList= data.getQuotation();
    
        if(!mMasterList.isEmpty() && mMasterList.size() > 0){
            for(MoldMasterV4 row : mMasterList ){

                System.out.println(" ApprovalMasterV4 " + row);
                
                MoldMasters m = MoldMasters.create();
                m.setTenantId(row.getTenantId());
                m.setMoldId(row.getMoldId());
                m.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                m.setUpdateUserId(aMaster.getUpdateUserId()); 

                if(row.getRowState().equals("D")){ // 삭제일 경우 수정되는 항목에 대한 리셋 
                    m.setMoldItemTypeCode("");
                    m.setTargetAmount(null);
                    m.setProvisionalBudgetAmount(null);
                    m.setBookCurrencyCode("");
                    m.setCurrencyCode("");
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }else{ 
                    m.setMoldItemTypeCode(row.getMoldItemTypeCode());
                    m.setTargetAmount(new BigDecimal((String)(row.getTargetAmount()==null?"0":row.getTargetAmount())));
                    m.setProvisionalBudgetAmount(new BigDecimal((String)(row.getProvisionalBudgetAmount()==null?"0":row.getProvisionalBudgetAmount())));
                    m.setBookCurrencyCode(row.getBookCurrencyCode());
                    m.setCurrencyCode(row.getCurrencyCode());

                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }
                
            }  
        }

        if(!qtnList.isEmpty() && qtnList.size() > 0){
            for(QuotationV4 row : qtnList ){
                Quotation del = Quotation.create();
                del.setMoldId(row.getMoldId());
                del.setApprovalNumber(row.getApprovalNumber()); 
                del.setSupplierCode(row.getSupplierCode()); 
                Delete d2 = Delete.from(Quotation_.CDS_NAME).matching(del); 
                Result rst2 = moldApprovalService.run(d2);
            }  
            for(QuotationV4 row : qtnList ){
                if(row.getSupplierCode()!=null && row.getSequence()!=null){   
                    Quotation q = Quotation.create();
                    q.setMoldId(row.getMoldId());
                    q.setApprovalNumber(row.getApprovalNumber()); 
                    q.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                    q.setUpdateUserId(aMaster.getUpdateUserId()); 
                    
                    q.setSequence(new Integer(row.getSequence()==null?0:row.getSequence()));
                    q.setSupplierCode(row.getSupplierCode()==null?"":row.getSupplierCode());
                    
                    CqnInsert i = Insert.into(Quotation_.CDS_NAME).entry(q); 
                    Result rst = moldApprovalService.run(i);
                }
            }         
        }
    } 
    // PurchaseOrder 
    private void savePurchaseOrder( Data data ){

        System.out.println(" approvalNumer " + this.APPROVAL_NUMBER);

        ApprovalMasterV4 aMaster = data.getApprovalMaster();
        Collection<MoldMasterV4> mMasterList = data.getMoldMaster();
    
        if(!mMasterList.isEmpty() && mMasterList.size() > 0){
            for(MoldMasterV4 row : mMasterList ){

                System.out.println(" ApprovalMasterV4 " + row);

                MoldMasters m = MoldMasters.create();
                m.setTenantId(row.getTenantId());
                m.setMoldId(row.getMoldId());
                m.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                m.setUpdateUserId(aMaster.getUpdateUserId()); 

                if(row.getRowState().equals("D") || row.getSplitPayTypeCode() == null || "".equals(row.getSplitPayTypeCode())){ // 삭제일 경우 수정되는 항목에 대한 리셋 
                    m.setSplitPayTypeCode(null);
                    m.setPrepayRate(null);
                    m.setProgresspayRate(null);
                    m.setRpayRate(null);
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }else{ 
                    m.setSplitPayTypeCode(row.getSplitPayTypeCode());
                    m.setPrepayRate(new BigDecimal((String)((row.getPrepayRate()==null||row.getPrepayRate()=="")?"0":row.getPrepayRate())));
                    m.setProgresspayRate(new BigDecimal((String)((row.getProgresspayRate()==null||row.getProgresspayRate()=="")?"0":row.getProgresspayRate())));
                    m.setRpayRate(new BigDecimal((String)((row.getRpayRate()==null||row.getRpayRate()=="")?"0":row.getRpayRate())));
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }

            }  
        }
    }
}