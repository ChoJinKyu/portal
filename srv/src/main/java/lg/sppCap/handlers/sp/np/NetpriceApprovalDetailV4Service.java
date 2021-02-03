package lg.sppCap.handlers.sp.np;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
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
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.npapprovaldetailv4service.*;

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
        Collection<DetailType> vDetails = vParam.getDetails();

        String detailTableName = null;
        
        ResultType vResult = ResultType.create();
        
        try{

            detailTableName = this.createTempTableDtl( vDetails );

            // Procedure Call
            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(new SqlParameter("I_TENANT_ID"        , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_APPROVAL_NUMBER"  , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_USER_ID"          , Types.VARCHAR));
            paramList.add(new SqlOutParameter("O_RETURN_CODE"   , Types.VARCHAR));
            paramList.add(new SqlOutParameter("O_RETURN_MSG"    , Types.VARCHAR));
            

            StringBuffer sqlCallProc = new StringBuffer();
            sqlCallProc.append("CALL SP_NP_NET_PRICE_APPROVAL_SAVE_PROC(")       
                        .append(" I_TENANT_ID => ?")
                        .append(" I_APPROVAL_NUMBER => ?")
                        .append(",I_DTL => ").append( detailTableName )
                        .append(",I_USER_ID => ?")
                        .append(",O_RETURN_CODE => ?")
                        .append(",O_RETURN_MSG => ?")
                        .append(")");


            Map<String, Object> resultMap = jdbc.call((Connection connection) -> {
                CallableStatement callableStatement = connection.prepareCall(sqlCallProc.toString());
                callableStatement.setString("I_TENANT_ID"       , vParam.getTenantId()) ;
                callableStatement.setString("I_APPROVAL_NUMBER" , vParam.getApprovalNumber()) ;
                callableStatement.setString("I_USER_ID"         , vParam.getUserId());
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
            vResult.setReturnCode( resultMsg );

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
    private String createTempTableDtl( Collection<DetailType> vDetails ){
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함 
        
        String tableName = "#SP_NP_NET_PRICE_APPROVAL_SAVE_PROC_LOCAL_TEMP_DTL";

        jdbc.execute(new StringBuffer()
                    .append("CREATE local TEMPORARY column TABLE ").append(tableName).append(" (")
                    .append("DTL_SEQ NVARCHAR(20) ")  
                    .append(")")
                    .toString()
                    );

        String insertSql = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?)";

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(vDetails != null && !vDetails.isEmpty() ){
            for(DetailType vRow : vDetails){
                batchDtl.add( new Object[] {                        
                    vRow.get("dtl_seq")
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