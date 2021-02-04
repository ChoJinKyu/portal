package lg.sppCap.handlers.sp.np;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.npapprovaldetailv4service.ApprovalSaveProcContext;
import cds.gen.sp.npapprovaldetailv4service.GeneralType;
import cds.gen.sp.npapprovaldetailv4service.MasterType;
import cds.gen.sp.npapprovaldetailv4service.NpApprovalDetailV4Service_;
import cds.gen.sp.npapprovaldetailv4service.ParamType;
import cds.gen.sp.npapprovaldetailv4service.ResultType;

@Component
@ServiceName(NpApprovalDetailV4Service_.CDS_NAME)
public class NetpriceApprovalDetailV4Service implements EventHandler {

    private final Logger log = LogManager.getLogger( this.getClass() );

    @Autowired
    private JdbcTemplate jdbc;

    /**
     * DDL 수행시, 자동 Commit 기능 OFF
     */
    private void setTransactionAutoCommitDdlOff(){
        jdbc.execute("SET TRANSACTION AUTOCOMMIT DDL OFF;");
    }

    /**
     * Local Temp Table 제거
     * 
     * @param tempTableName : Table Name
     */
    private void dropTempTable(String tempTableName){
        if(tempTableName != null && !tempTableName.isEmpty()){
            jdbc.execute( String.format("DROP TABLE %s", tempTableName) );
        }
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=ApprovalSaveProcContext.CDS_NAME)
    public void onApprovalSaveProc(ApprovalSaveProcContext context) {   

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        this.setTransactionAutoCommitDdlOff();
        
        ParamType vParam = context.getParam();
        MasterType master = vParam.getMaster();
        Collection<GeneralType> vDetails = vParam.getGeneral();

        String detailTableName = null;
        
        ResultType vResult = ResultType.create();
        
        try{

            detailTableName = this.createTempTableDtl( vDetails );

            // Procedure Call
            StringBuffer sqlCallProc = new StringBuffer();
            sqlCallProc.append("CALL SP_NP_NET_PRICE_APPROVAL_SAVE_PROC(")       
                        .append(" I_TENANT_ID => ?")
                        .append(",I_COMPANY_CODE => ?")
                        .append(",I_ORG_TYPE_CODE => ?")
                        .append(",I_ORG_CODE => ?")
                        .append(",I_APPROVAL_NUMBER => ?")
                        .append(",I_APPROVAL_TITLE => ?")
                        .append(",I_APPROVAL_CONTENTS => ?")
                        .append(",I_ATTCH_GROUP_NUMBER => ?")
                        .append(",I_NET_PRICE_DOCUMENT_TYPE_CODE => ?")
                        .append(",I_NET_PRICE_SOURCE_CODE => ?")
                        .append(",I_BUYER_EMPNO => ?")
                        .append(",I_TENTPRC_FLAG => ?")
                        .append(",I_OUTCOME_CODE => ?")
                        .append(",I_DETAILS => ").append( detailTableName )
                        .append(",I_USER_ID => ?")
                        .append(",O_RETURN_CODE => ?")
                        .append(",O_RETURN_MSG => ?")
                        .append(")");

            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(new SqlParameter("I_TENANT_ID"                    , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_COMPANY_CODE"                 , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_ORG_TYPE_CODE"                , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_ORG_CODE"                     , Types.VARCHAR));
            paramList.add(new SqlParameter("I_APPROVAL_NUMBER"              , Types.VARCHAR));
            paramList.add(new SqlParameter("I_APPROVAL_TITLE"               , Types.VARCHAR));
            paramList.add(new SqlParameter("I_APPROVAL_CONTENTS"            , Types.NCLOB));  
            paramList.add(new SqlParameter("I_ATTCH_GROUP_NUMBER"           , Types.VARCHAR));  
            paramList.add(new SqlParameter("I_NET_PRICE_DOCUMENT_TYPE_CODE" , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_NET_PRICE_SOURCE_CODE"        , Types.VARCHAR));
            paramList.add(new SqlParameter("I_BUYER_EMPNO"                  , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_TENTPRC_FLAG"                 , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_OUTCOME_CODE"                 , Types.VARCHAR));       
            //paramList.add(new SqlParameter("I_DETAILS"                      , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_USER_ID"                      , Types.VARCHAR));
            paramList.add(new SqlOutParameter("O_RETURN_CODE"               , Types.VARCHAR));
            paramList.add(new SqlOutParameter("O_RETURN_MSG"                , Types.VARCHAR));

            Map<String, Object> resultMap = jdbc.call((Connection connection) -> {
                CallableStatement callableStatement = connection.prepareCall(sqlCallProc.toString());
                callableStatement.setString("I_TENANT_ID"                    , master.getTenantId() );
                callableStatement.setString("I_COMPANY_CODE"                 , master.getCompanyCode() );
                callableStatement.setString("I_ORG_TYPE_CODE"                , master.getOrgTypeCode() );
                callableStatement.setString("I_ORG_CODE"                     , master.getOrgCode() );
                callableStatement.setString("I_APPROVAL_NUMBER"              , master.getApprovalNumber() );
                callableStatement.setString("I_APPROVAL_TITLE"               , master.getApprovalTitle() );
                callableStatement.setString("I_APPROVAL_CONTENTS"            , master.getApprovalContents() );
                callableStatement.setString("I_ATTCH_GROUP_NUMBER"           , master.getAttchGroupNumber() );
                callableStatement.setString("I_NET_PRICE_DOCUMENT_TYPE_CODE" , master.getNetPriceDocumentTypeCode() );
                callableStatement.setString("I_NET_PRICE_SOURCE_CODE"        , master.getNetPriceSourceCode() );
                callableStatement.setString("I_BUYER_EMPNO"                  , master.getBuyerEmpno() );
                callableStatement.setBoolean("I_TENTPRC_FLAG"                , master.getTentprcFlag() );
                callableStatement.setString("I_OUTCOME_CODE"                 , master.getOutcomeCode() );
                callableStatement.setString("I_USER_ID"                      , vParam.getUserId() );
                return callableStatement;
            }, paramList);


            log.info(">>>>>>>>>>>>>>> ResultMap : {}", resultMap );

            String resultCode = (String)resultMap.get("O_RETURN_CODE");
            String resultMsg  = (String)resultMap.get("O_RETURN_MSG");

            if(!"OK".equals( resultCode )){
                log.error("SP_NP_NET_PRICE_APPROVAL_SAVE_PROC 호출시 오류 발생 함 Code:{}, Message:{} ", resultCode, resultMsg);
                resultMsg = this.getMessage( resultCode, "KO"); // Error 코드에 대한 다국어 적용된 Message로 변환.
                throw new ServiceException(ErrorStatuses.SERVER_ERROR, resultMsg );
            }

            vResult.setReturnCode( resultCode );
            vResult.setApprovalNumber( resultMsg );

        }finally{
            this.dropTempTable( detailTableName );
        }

        log.info("### callProc Success ###");

        context.setResult( vResult );
        context.setCompleted(); 
    }


    /**
     * 
     * @param vDetails
     * @return
     */
    private String createTempTableDtl( Collection<GeneralType> vDetails ){
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함 
        
        String tableName = "#SP_NP_NET_PRICE_APPROVAL_SAVE_PROC_LOCAL_TEMP_DTL";

        jdbc.execute(new StringBuffer()
                    .append("CREATE local TEMPORARY column TABLE ").append(tableName).append(" (")
                    .append(" ITEM_SEQUENCE                      NVARCHAR(20)")
                    .append(",LINE_TYPE_CODE                     NVARCHAR(30)")
                    .append(",MATERIAL_CODE                      NVARCHAR(40)")
                    .append(",PAYTERMS_CODE                      NVARCHAR(30)")
                    .append(",SUPPLIER_CODE                      NVARCHAR(10)")
                    .append(",EFFECTIVE_START_DATE               NVARCHAR(10)")
                    .append(",EFFECTIVE_END_DATE                 NVARCHAR(10)")
                    .append(",SURROGATE_TYPE_CODE                NVARCHAR(30)")
                    .append(",CURRENCY_CODE                      NVARCHAR(3) ")
                    .append(",NET_PRICE                          DECIMAL     ")
                    .append(",VENDOR_POOL_CODE                   NVARCHAR(20)")
                    .append(",MARKET_CODE                        NVARCHAR(30)")
                    .append(",NET_PRICE_APPROVAL_REASON_CODE     NVARCHAR(30)")
                    .append(",MAKER_CODE                         NVARCHAR(10)")
                    .append(",INCOTERMS                          NVARCHAR(3) ")
                    .append(",_ROW_STATE_                        NVARCHAR(3) ")
                    .append(")")
                    .toString()
                    );

        String insertSql = "INSERT INTO " + tableName + " VALUES (?,?,?,?,? ,?,?,?,?,? ,?,?,?,?,? ,?)";

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(vDetails != null && !vDetails.isEmpty() ){
            for(GeneralType vRow : vDetails){
                batchDtl.add( new Object[] {                        
                     vRow.get("item_sequence")                   // '품목순번'	
                    ,vRow.get("line_type_code")                  // '라인유형코드'
                    ,vRow.get("material_code")                   // '자재코드'	
                    ,vRow.get("payterms_code")                   // '지불조건코드'	
                    ,vRow.get("supplier_code")                   // '공급업체코드'	
                    ,vRow.get("effective_start_date")            // '유효시작일자'	
                    ,vRow.get("effective_end_date")              // '유효종료일자'	
                    ,vRow.get("surrogate_type_code")             // '대리견적유형코드'	
                    ,vRow.get("currency_code")                   // '통화코드'	
                    ,vRow.get("net_price")                       // '단가'		
                    ,vRow.get("vendor_pool_code")                // '협력사풀코드'	
                    ,vRow.get("market_code")                     // '납선코드'	
                    ,vRow.get("net_price_approval_reason_code")  // '단가품의사유코드'	
                    ,vRow.get("maker_code")                      // '제조사코드'
                    ,vRow.get("incoterms")                       // '인코텀즈'
                    ,vRow.get("_row_state_")                     // Row 상태코드(CUD)
                });
            }
        }

        jdbc.batchUpdate(insertSql, batchDtl);  

        return tableName;
    }

    /**
     * 다국어 적용된 Message를 반환
     * 
     * @param messageCode
     * @param languageCode
     * @return
     */
    private String getMessage(String messageCode, String languageCode){
        
        if( "NG001".equals( messageCode ) ){
            return "공통 [결재 마스터] 등록 오류.";

        }else if( "NG002".equals( messageCode ) ){
            return "[단가품의 마스터] 등록 오류.";

        }else if( "NG003".equals( messageCode ) ){
            return "[단가품의 상세] 등록 오류.";
        }
        return "정의 되지 않은 오류 입니다.";
    }

}