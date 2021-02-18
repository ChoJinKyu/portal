package lg.sppCap.handlers.sp.np;

import java.sql.Types;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.npapprovaldetailv4service.ApprovalDeleteProcContext;
import cds.gen.sp.npapprovaldetailv4service.ApprovalSaveProcContext;
import cds.gen.sp.npapprovaldetailv4service.ApprovalStatusChangeProcContext;
import cds.gen.sp.npapprovaldetailv4service.ApproverType;
import cds.gen.sp.npapprovaldetailv4service.DeleteParamType;
import cds.gen.sp.npapprovaldetailv4service.DeleteResultType;
import cds.gen.sp.npapprovaldetailv4service.GeneralType;
import cds.gen.sp.npapprovaldetailv4service.MasterType;
import cds.gen.sp.npapprovaldetailv4service.NpApprovalDetailV4Service_;
import cds.gen.sp.npapprovaldetailv4service.RefererType;
import cds.gen.sp.npapprovaldetailv4service.SaveParamType;
import cds.gen.sp.npapprovaldetailv4service.SaveResultType;
import cds.gen.sp.npapprovaldetailv4service.StatusChangeParamType;
import cds.gen.sp.npapprovaldetailv4service.StatusChangeResultType;

@Component
@ServiceName(NpApprovalDetailV4Service_.CDS_NAME)
public class NetpriceApprovalDetailV4Service extends SpNpBaseService implements EventHandler {

    /**
     * 저장 Procedure의 Parameter [Detail] 관련 Local Temporary Table Layout
     */
    private final LocalTempTableLayout SAVE_PROC_LOCAL_TEMP_TABLE_DETAIL_LAYOUT
                    = new LocalTempTableLayout("#APPROVAL_SAVE_PROC_LOCAL_TEMP_DETAIL")
                    .append("ITEM_SEQUENCE"                   ,"NVARCHAR(20)")
                    .append("ORG_CODE"                        ,"NVARCHAR(10)")
                    .append("LINE_TYPE_CODE"                  ,"NVARCHAR(30)")
                    .append("MATERIAL_CODE"                   ,"NVARCHAR(40)")
                    .append("PAYTERMS_CODE"                   ,"NVARCHAR(30)")
                    .append("SUPPLIER_CODE"                   ,"NVARCHAR(10)")
                    .append("EFFECTIVE_START_DATE"            ,"NVARCHAR(10)")
                    .append("EFFECTIVE_END_DATE"              ,"NVARCHAR(10)")
                   // .append("SURROGATE_TYPE_CODE"             ,"NVARCHAR(30)")
                    .append("CURRENCY_CODE"                   ,"NVARCHAR(3) ")
                    .append("NET_PRICE"                       ,"DECIMAL(34,10)")
                    .append("VENDOR_POOL_CODE"                ,"NVARCHAR(20)")
                    .append("MARKET_CODE"                     ,"NVARCHAR(30)")
                    .append("NET_PRICE_APPROVAL_REASON_CODE"  ,"NVARCHAR(30)")
                    .append("NET_PRICE_TYPE_CODE"             ,"NVARCHAR(30)")
                    .append("MAKER_CODE"                      ,"NVARCHAR(10)")
                    .append("INCOTERMS"                       ,"NVARCHAR(3) ")
                    .append("_ROW_STATE_"                     ,"NVARCHAR(3) ")
                    ;


    /**
     * 저장 Procedure의 Parameter [Approver] 관련 Local Temporary Table Layout
     */
    private final LocalTempTableLayout SAVE_PROC_LOCAL_TEMP_TABLE_APPROVER_LAYOUT
                    = new LocalTempTableLayout("#APPROVAL_SAVE_PROC_LOCAL_TEMP_APPROVER")
                    .append("APPROVE_SEQUENCE"     ,"NVARCHAR(10)")
                    .append("APPROVER_EMPNO"       ,"NVARCHAR(30)")
                    .append("APPROVER_TYPE_CODE"   ,"NVARCHAR(30)")
                    .append("_ROW_STATE_ "         ,"NVARCHAR(3)")
                    ;


    /**
     * 저장 Procedure의 Parameter [Referer] 관련 Local Temporary Table Layout
     */
    private final LocalTempTableLayout SAVE_PROC_LOCAL_TEMP_TABLE_REFERER_LAYOUT 
                    = new LocalTempTableLayout("#APPROVAL_SAVE_PROC_LOCAL_TEMP_REFERER")
                    .append("REFERER_EMPNO", "NVARCHAR(30)")
                    ;

    /**
     * 저장 Procedure의 Layout
     */
    private final ProcedureLayout APPROVAL_SAVE_PROCEDURE_LAYOUT
                = new ProcedureLayout( "SP_NP_NET_PRICE_APPROVAL_SAVE_PROC" )
                .append(IN , "I_TENANT_ID"                     , Types.VARCHAR, "tenant_id"                   )
                .append(IN , "I_COMPANY_CODE"                  , Types.VARCHAR, "company_code"                )
                .append(IN , "I_APPROVAL_NUMBER"               , Types.VARCHAR, "approval_number"             )
                .append(IN , "I_APPROVAL_TITLE"                , Types.VARCHAR, "approval_title"              )
                .append(IN , "I_APPROVAL_CONTENTS"             , Types.NCLOB  , "approval_contents"           )
                .append(IN , "I_ATTCH_GROUP_NUMBER"            , Types.VARCHAR, "attch_group_number"          )
                .append(IN , "I_NET_PRICE_DOCUMENT_TYPE_CODE"  , Types.VARCHAR, "net_price_document_type_code")
                .append(IN , "I_NET_PRICE_SOURCE_CODE"         , Types.VARCHAR, "net_price_source_code"       )
                .append(IN , "I_BUYER_EMPNO"                   , Types.VARCHAR, "buyer_empno"                 )
                .append(IN , "I_OUTCOME_CODE"                  , Types.VARCHAR, "outcome_code"                )
                .append(IN , "I_DETAILS"                       , TABLE_TYPE   , "details_temp_table"          )
                .append(IN , "I_APPROVERS"                     , TABLE_TYPE   , "approvers_temp_table"        )
                .append(IN , "I_REFERERS"                      , TABLE_TYPE   , "referers_temp_table"         )
                .append(IN , "I_USER_ID"                       , Types.VARCHAR, "user_id"                     )
                .append(OUT, "O_RETURN_CODE"                   , Types.VARCHAR, "return_code"                 )
                .append(OUT, "O_RETURN_MSG"                    , Types.VARCHAR, "return_msg"                  )
                .append(OUT, "O_DB_ERROR_MSG"                  , Types.VARCHAR, "db_error_msg"                );

    /**
     * 단가 품의 저장 
     *  - 저장 Procedure 호출
     */
    @Transactional(rollbackFor = Exception.class)
    @On(event=ApprovalSaveProcContext.CDS_NAME)
    public void onApprovalSaveProc(ApprovalSaveProcContext context) {   

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        this.setTransactionAutoCommitDdlOff();
        
        SaveParamType vParam = context.getParam();
        MasterType master = vParam.getMaster();
        Collection<GeneralType> vDetails = vParam.getGeneral();
        Collection<ApproverType> vApprovers = vParam.getApprovers();
        Collection<RefererType> vReferers = vParam.getReferers();

        String detailTableName = null;
        String approverTableName = null;
        String refererTableName = null;
        
        SaveResultType vResult = SaveResultType.create();
        
        try{
            detailTableName = super.createTemporaryTable( SAVE_PROC_LOCAL_TEMP_TABLE_DETAIL_LAYOUT, vDetails );
            approverTableName = super.createTemporaryTable( SAVE_PROC_LOCAL_TEMP_TABLE_APPROVER_LAYOUT, vApprovers );
            refererTableName = super.createTemporaryTable( SAVE_PROC_LOCAL_TEMP_TABLE_REFERER_LAYOUT, vReferers );

            Map<String,Object> param = new HashMap<String,Object>();
            param.putAll( master );
            param.put("details_temp_table"  , detailTableName       );
            param.put("approvers_temp_table", approverTableName     );
            param.put("referers_temp_table" , refererTableName      );
            //param.put("user_id"                , userSession.getUserId());
            param.put("user_id"                , "00000"  );
            
            // Procedure Call
            Map<String, Object> resultMap = super.executeProcedure(APPROVAL_SAVE_PROCEDURE_LAYOUT, param);
            
            String resultCode = (String)resultMap.get("return_code");
            String resultMsg  = (String)resultMap.get("return_msg");
            String errorMsg   = (String)resultMap.get("db_error_msg");

            if(!"OK".equals( resultCode )){
                log.error("SP_NP_NET_PRICE_APPROVAL_SAVE_PROC 호출시 오류 발생 함 Code:{}, Message:{}, DB Error Message:{}", resultCode, resultMsg, errorMsg);
                throw new ServiceException(ErrorCode.USER_MESSAGE_SERVER_ERROR, resultMsg );
            }

            vResult.setReturnCode( resultCode );
            vResult.setReturnMsg( "Success" );
            vResult.setApprovalNumber( resultMsg );


            // 승인 요청이면, 상태 변경 처리
            if("AR".equals( master.getApproveStatusCode() )){
                Map<String,Object> param2 = new HashMap<String,Object>();
                param2.put("tenant_id"              , master.getTenantId());
                param2.put("approval_number"        , master.getApprovalNumber());
                param2.put("approve_status_code"    , master.getApproveStatusCode());
                //param2.put("user_id"                , userSession.getUserId());
                param2.put("user_id"                , "00000"  );
    
                // Procedure Call
                Map<String, Object> resultMap2 = super.executeProcedure(APPROVAL_STATUS_CHANGE_PROCEDURE_LAYOUT, param2);
                
                String resultCode2 = (String)resultMap2.get("return_code");
                String resultMsg2  = (String)resultMap2.get("return_msg");
                String errorMsg2  = (String)resultMap2.get("db_error_msg");
    
                if(!"OK".equals( resultCode2 )){
                    log.error("SP_NP_NET_PRICE_APPROVAL_STATUS_CHANGE_PROC 호출시 오류 발생 함 Code:{}, Message:{}, DB Error Message:{}", resultCode2, resultMsg2, errorMsg2);
                    throw new ServiceException(ErrorCode.USER_MESSAGE_SERVER_ERROR, resultMsg2 );
                }
            }

        }finally{
            try{ this.dropTemporaryTable( detailTableName ); }catch(Exception e){}
            try{ this.dropTemporaryTable( approverTableName ); }catch(Exception e){}
            try{ this.dropTemporaryTable( refererTableName ); }catch(Exception e){}
        }
        log.info("### callProc Success ###");

        context.setResult( vResult );
        context.setCompleted(); 
    }



    
    /**
     * 품의 상태 변경 Procedure의 Layout
     */
    private final ProcedureLayout APPROVAL_STATUS_CHANGE_PROCEDURE_LAYOUT
                = new ProcedureLayout( "SP_NP_NET_PRICE_APPROVAL_STATUS_CHANGE_PROC" )
                .append(IN , "I_TENANT_ID"                     , Types.VARCHAR, "tenant_id"                   )
                .append(IN , "I_APPROVAL_NUMBER"               , Types.VARCHAR, "approval_number"             )
                .append(IN , "I_APPROVE_STATUS_CODE"           , Types.VARCHAR, "approve_status_code"         )
                .append(IN , "I_USER_ID"                       , Types.VARCHAR, "user_id"                     )
                .append(OUT, "O_RETURN_CODE"                   , Types.VARCHAR, "return_code"                 )
                .append(OUT, "O_RETURN_MSG"                    , Types.VARCHAR, "return_msg"                  )
                .append(OUT, "O_DB_ERROR_MSG"                  , Types.VARCHAR, "db_error_msg"                );


    /**
     * 단가품의 상태 변경
     *  - 품의 상태 변경 Procedure 호출
     * @param context
     */
    @Transactional(rollbackFor = Exception.class)
    @On(event=ApprovalStatusChangeProcContext.CDS_NAME)
    public void onApprovalStatusChangeProc(ApprovalStatusChangeProcContext context) {   

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        this.setTransactionAutoCommitDdlOff();
        
        StatusChangeParamType vParam = context.getParam();

        StatusChangeResultType vResult = StatusChangeResultType.create();
        
        try{

            Map<String,Object> param = new HashMap<String,Object>();
            param.putAll( vParam );
            //param2.put("user_id"                , userSession.getUserId());
            param.put("user_id"                , "00000"  );

            // Procedure Call
            Map<String, Object> resultMap = super.executeProcedure(APPROVAL_STATUS_CHANGE_PROCEDURE_LAYOUT, param);
            
            String resultCode = (String)resultMap.get("return_code");
            String resultMsg  = (String)resultMap.get("return_msg");
            String errorMsg   = (String)resultMap.get("db_error_msg");

            if(!"OK".equals( resultCode )){
                log.error("SP_NP_NET_PRICE_APPROVAL_STATUS_CHANGE_PROC 호출시 오류 발생 함 Code:{}, Message:{}, DB Error Message:{}", resultCode, resultMsg, errorMsg);
                throw new ServiceException(ErrorCode.USER_MESSAGE_SERVER_ERROR, resultMsg );
            }

            vResult.setReturnCode( resultCode );
            vResult.setReturnMsg( resultMsg );

        }finally{

        }
        log.info("### callProc Success ###");

        context.setResult( vResult );
        context.setCompleted(); 
    }


    private final ProcedureLayout APPROVAL_DELETE_PROCEDURE_LAYOUT
                = new ProcedureLayout( "SP_NP_NET_PRICE_APPROVAL_DELETE_PROC" )
                .append(IN , "I_TENANT_ID"         , Types.VARCHAR, "tenant_id"           )
                .append(IN , "I_APPROVAL_NUMBER"   , Types.VARCHAR, "approval_number"     )
                .append(IN , "I_USER_ID"           , Types.VARCHAR, "user_id"             )
                .append(OUT, "O_RETURN_CODE"       , Types.VARCHAR, "return_code"         )
                .append(OUT, "O_RETURN_MSG"        , Types.VARCHAR, "return_msg"          )
                .append(OUT, "O_DB_ERROR_MSG"      , Types.VARCHAR, "db_error_msg"        );
                /*
                .append(OUT, "O_MSG"               , TABLE_TYPE   , "results"
                    ,(ResultSet v_rs, int rowNum) -> {
                        Map<String,Object> results = new HashMap<String,Object>();
                        results.put("no"         , rowNum );
                        results.put("return_code", v_rs.getString("return_code"));
                        results.put("return_msg" , v_rs.getString("return_msg") );
                        return results;
                    }
                );
                */




    /**
     * 단가품의 상태 변경
     *  - 품의 상태 변경 Procedure 호출
     * @param context
     */
    @Transactional(rollbackFor = Exception.class)
    @On(event=ApprovalDeleteProcContext.CDS_NAME)
    public void onApprovalDeleteProc(ApprovalDeleteProcContext context) {   
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        this.setTransactionAutoCommitDdlOff();
        
        DeleteParamType vParam = context.getParam();

        DeleteResultType vResult = DeleteResultType.create();

        try{

            Map<String,Object> param = new HashMap<String,Object>();
            param.putAll( vParam );
            //param.put("user_id"                , userSession.getUserId());
            param.put("user_id"                , "00000"  );

            // Procedure Call
            Map<String, Object> resultMap = super.executeProcedure(APPROVAL_DELETE_PROCEDURE_LAYOUT, param);
            
            String resultCode = (String)resultMap.get("return_code");
            String resultMsg  = (String)resultMap.get("return_msg");
            String errorMsg   = (String)resultMap.get("db_error_msg");

            if(!"OK".equals( resultCode )){
                log.error("SP_NP_NET_PRICE_APPROVAL_DELETE_PROC 호출시 오류 발생 함 Code:{}, Message:{}, DB Error Message:{}", resultCode, resultMsg, errorMsg);
                throw new ServiceException(ErrorCode.USER_MESSAGE_SERVER_ERROR, resultMsg );
            }

            vResult.setReturnCode( resultCode );
            vResult.setReturnMsg( resultMsg );
            
        }finally{

        }
        log.info("### callProc Success ###");

        context.setResult( vResult );
        context.setCompleted(); 
    }

}