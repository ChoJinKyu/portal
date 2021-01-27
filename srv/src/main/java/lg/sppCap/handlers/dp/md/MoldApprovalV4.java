package lg.sppCap.handlers.dp.md;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
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
                if(aMaster.getApprovalTypeCode().equals("B")){  // 예산집행품의 
                    this.saveBudgetExecution(data);
                }else if(aMaster.getApprovalTypeCode().equals("V")){
                    this.savePurchaseOrder(data);
                }else if(aMaster.getApprovalTypeCode().equals("E")){
                    this.saveParticipatingSelection(data);
                }else if(aMaster.getApprovalTypeCode().equals("I")){ // 금형 입고품의 
                    this.saveMoldRecepitApproval(data);
                }else if(aMaster.getApprovalTypeCode().equals("A")){ // 취소 품의 
                     this.saveParticipatingSelectionCancel(data);
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
                master.setOrgTypeCode(aMaster.getOrgTypeCode());
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
                if(aMaster.getApprovalTypeCode().equals("B")){  // 예산집행품의 
                    this.saveBudgetExecution(data);
                }else if(aMaster.getApprovalTypeCode().equals("V")){
                    this.savePurchaseOrder(data);
                }else if(aMaster.getApprovalTypeCode().equals("E")){
                    this.saveParticipatingSelection(data);
                }else if(aMaster.getApprovalTypeCode().equals("I")){ // 입고품의 
                    this.saveMoldRecepitApproval(data);
                }else if(aMaster.getApprovalTypeCode().equals("A")){ // 품의 취소 
                    this.saveParticipatingSelectionCancel(data);
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
        String v_sql_callProc = "CALL DP_MD_APPROVAL_DELETE_ITEM_PROC(I_APPROVAL_NUMBER => ?,I_APPROVAL_TYPE_CODE => ? I_TENANT_ID => ?)";
            
        System.out.println("data>>> " + data);
        try {
           

            if(!aMaster.isEmpty() && aMaster.size() > 0){
                for(ApprovalMasterV4 row : aMaster ){

                    System.out.println("ApprovalMasterV4 ::::::" + row);
                    msg.setMessageCode("NCM01002");
                    msg.setResultCode(0);
                    msg.setCompanyCode(row.getCompanyCode());
                    msg.setPlantCode(row.getOrgCode());
                    
                    jdbc.update(v_sql_callProc, row.getApprovalNumber(), row.getApprovalTypeCode(), row.getTenantId());

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
                    m.setAcqDepartmentCode("");
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
                    m.setAcqDepartmentCode(row.getAcqDepartmentCode());
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
    // moldRecepitApproval 
    private void saveMoldRecepitApproval( Data data ){

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
                    m.setAcqDepartmentCode("");
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }else{ 
                    m.setAcqDepartmentCode(row.getAcqDepartmentCode());
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
                    m.setTargetAmount(null);
                    m.setCurrencyCode("");
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }else{ 
                    m.setTargetAmount(new BigDecimal((String)(row.getTargetAmount()==null?"0":row.getTargetAmount())));
                    m.setCurrencyCode(row.getCurrencyCode());

                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);
                }
                
            }  
        }
        Quotation del = Quotation.create();
        del.setApprovalNumber(this.APPROVAL_NUMBER); 
        Delete d2 = Delete.from(Quotation_.CDS_NAME).matching(del); 
        Result rst2 = moldApprovalService.run(d2);
            
        if(!qtnList.isEmpty() && qtnList.size() > 0){
            for(QuotationV4 row : qtnList ){
                System.out.println("QuotationV4 ::::" + row);
                if(row.getSupplierCode()!=null && row.getSequence()!=null){   
                    Quotation q = Quotation.create();
                    q.setMoldId(row.getMoldId());
                    if(row.getApprovalNumber().equals("New")){
                        q.setApprovalNumber(this.APPROVAL_NUMBER);
                    }else{
                        q.setApprovalNumber(row.getApprovalNumber()); 
                    }
                    q.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                    q.setUpdateUserId(aMaster.getUpdateUserId()); 
                    
                    q.setSequence(new Integer(row.getSequence()==null?0:row.getSequence()));
                    q.setSupplierCode(row.getSupplierCode()==null?"":row.getSupplierCode());
                    q.setQuotationStatusCode("C");
                    // q.setQuotationAmount(0);
                    // q.setMcst(0);
                    // q.setPcst(0);
                    // q.setProfit(0);
                    // q.setPackingCost(0);
                    // q.setBizTripCost(0);
                    // q.setSparePartCost(0);
                   
                    
                    CqnInsert i = Insert.into(Quotation_.CDS_NAME).entry(q); 
                    Result rst = moldApprovalService.run(i);
                }
            }         
        }
    } 

    // 취소 품의 
   private void saveParticipatingSelectionCancel(Data data){

        System.out.println(" approvalNumer " + this.APPROVAL_NUMBER);

        ApprovalMasterV4 aMaster = data.getApprovalMaster();
        Collection<MoldMasterV4> mMasterList = data.getMoldMaster(); 
        Collection<QuotationV4> qtnList= data.getQuotation();
    
        if(aMaster.getApprovalNumber().equals("New")){ // 신규 
            if(!mMasterList.isEmpty() && mMasterList.size() > 0){
                for(MoldMasterV4 row : mMasterList ){
                    System.out.println(" ApprovalMasterV4 " + row);           
                    MoldMasters m = MoldMasters.create();
                    m.setTenantId(row.getTenantId());
                    m.setMoldId(row.getMoldId());
                    m.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                    m.setUpdateUserId(aMaster.getUpdateUserId()); 
                    m.setTargetAmount(new BigDecimal((String)(row.getTargetAmount()==null?"0":row.getTargetAmount())));
                    m.setCurrencyCode(row.getCurrencyCode());
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                    Result rst = moldApprovalService.run(u);      
                }  
            }

            if(!qtnList.isEmpty() && qtnList.size() > 0){
                for(QuotationV4 row : qtnList ){
                    System.out.println("QuotationV4 ::::" + row);
                    if(row.getSupplierCode()!=null && row.getSequence()!=null){   
                        Quotation q = Quotation.create();
                        q.setMoldId(row.getMoldId());
                        q.setApprovalNumber(this.APPROVAL_NUMBER);
                        q.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        q.setUpdateUserId(aMaster.getUpdateUserId()); 
                        q.setSequence(new Integer(row.getSequence()==null?0:row.getSequence()));
                        q.setSupplierCode(row.getSupplierCode()==null?"":row.getSupplierCode());
                        q.setQuotationStatusCode("C");
                        CqnInsert i = Insert.into(Quotation_.CDS_NAME).entry(q); 
                        Result rst = moldApprovalService.run(i);
                    }
                }         
            }

        }else{
            // update 
            if(!mMasterList.isEmpty() && mMasterList.size() > 0){
                for(MoldMasterV4 row : mMasterList ){
                    MoldMasters m = MoldMasters.create();
                    m.setTenantId(row.getTenantId());
                    m.setMoldId(row.getMoldId());
                    m.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                    m.setUpdateUserId(aMaster.getUpdateUserId()); 

                    if(row.getRowState().equals("D")){ // 삭제일 경우 수정되는 항목에 대한 리셋 
                        m.setTargetAmount(null);
                        m.setCurrencyCode("");
                        CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                        Result rst = moldApprovalService.run(u);
                    }else{ 
                        m.setTargetAmount(new BigDecimal((String)(row.getTargetAmount()==null?"0":row.getTargetAmount())));
                        m.setCurrencyCode(row.getCurrencyCode());
                        CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(m); 
                        Result rst = moldApprovalService.run(u);
                    }     
                }  
            }

            // 모두 지웠다가 다시 insert 함 
            Quotation del = Quotation.create();
            del.setApprovalNumber(this.APPROVAL_NUMBER); 
            Delete d2 = Delete.from(Quotation_.CDS_NAME).matching(del); 
            Result rst2 = moldApprovalService.run(d2);

            if(!qtnList.isEmpty() && qtnList.size() > 0){
                for(QuotationV4 row : qtnList ){
                    if(row.getSupplierCode()!=null && row.getSequence()!=null){   
                        Quotation q = Quotation.create();
                        q.setMoldId(row.getMoldId());
                        q.setApprovalNumber(this.APPROVAL_NUMBER);
                        q.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        q.setUpdateUserId(aMaster.getUpdateUserId()); 
                        q.setSequence(new Integer(row.getSequence()==null?0:row.getSequence()));
                        q.setSupplierCode(row.getSupplierCode()==null?"":row.getSupplierCode());
                        q.setQuotationStatusCode("C");
                        CqnInsert i = Insert.into(Quotation_.CDS_NAME).entry(q); 
                        Result rst = moldApprovalService.run(i);
                    }
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

                MoldMasters mst = MoldMasters.create();
                mst.setTenantId(row.getTenantId());
                mst.setMoldId(row.getMoldId());
                mst.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                mst.setUpdateUserId(aMaster.getUpdateUserId()); 

                if(row.getRowState().equals("D") || row.getSplitPayTypeCode() == null || "".equals(row.getSplitPayTypeCode())){ // 삭제일 경우 수정되는 항목에 대한 리셋 
                    mst.setSplitPayTypeCode(null);
                    /*mst.setPrepayRate(null);
                    mst.setProgresspayRate(null);
                    mst.setRpayRate(null);*/
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(mst); 
                    Result rst = moldApprovalService.run(u);

                    Payment del = Payment.create();
                    del.setTenantId(row.getTenantId());
                    del.setMoldId(row.getMoldId());
                    Delete d2 = Delete.from(Payment_.CDS_NAME).matching(del); 
                    Result rst2 = moldApprovalService.run(d2);
                }else{ 
                    mst.setSplitPayTypeCode(row.getSplitPayTypeCode());
                    /*mst.setPrepayRate(new BigDecimal((String)((row.getPrepayRate()==null||row.getPrepayRate()=="")?"0":row.getPrepayRate())));
                    mst.setProgresspayRate(new BigDecimal((String)((row.getProgresspayRate()==null||row.getProgresspayRate()=="")?"0":row.getProgresspayRate())));
                    mst.setRpayRate(new BigDecimal((String)((row.getRpayRate()==null||row.getRpayRate()=="")?"0":row.getRpayRate())));*/
                    CqnUpdate u = Update.entity(MoldMasters_.CDS_NAME).data(mst); 
                    Result rst = moldApprovalService.run(u);

                    Payment payment = Payment.create();
                    payment.setTenantId(row.getTenantId());
                    payment.setMoldId(row.getMoldId());
                        payment.setPaySequence(row.getPaySequence());
                        payment.setPayTypeCode(row.getPayTypeCode());
                        payment.setPayRate(new BigDecimal((String)((row.getPrepay()==null||row.getPrepay()=="")?"0":row.getPrepay())));
                    payment.setPayPrice(new BigDecimal((String)((row.getProgresspay()==null||row.getProgresspay()=="")?"0":row.getProgresspay())));
                    payment.setPayRate(new BigDecimal((String)((row.getRpay()==null||row.getRpay()=="")?"0":row.getRpay())));
                    payment.setLocalUpdateDtm(aMaster.getLocalUpdateDtm());
                        payment.setUpdateUserId(aMaster.getUpdateUserId()); 
                        CqnInsert i = Insert.into(Quotation_.CDS_NAME).entry(payment); 
                        Result rst2 = moldApprovalService.run(i);
                }

            }  
        }
    }
}