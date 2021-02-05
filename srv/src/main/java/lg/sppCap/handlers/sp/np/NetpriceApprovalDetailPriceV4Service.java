package lg.sppCap.handlers.sp.np;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.sql.ResultSet;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.SqlOutParameter;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.npapprovaldetailpricev4service.*;

@Component
@ServiceName(NpApprovalDetailPriceV4Service_.CDS_NAME)
public class NetpriceApprovalDetailPriceV4Service extends SpNpBaseService implements EventHandler {

    @Transactional(rollbackFor = SQLException.class)
    @On(event=ApprovalPriceInfoProcContext.CDS_NAME)
    public void onApprovalPriceInfoProc(ApprovalPriceInfoProcContext context) {   

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        this.setTransactionAutoCommitDdlOff();
        
        ParamType vParam = context.getParam();

        String tenant_id = vParam.getTenantId();
        String language_code = vParam.getLanguageCode();
        Collection<InputTableType> inputTable = vParam.getInDetails();

        String detailTableName = null;

        ResultType vResult = ResultType.create();

        Collection<OutTableType> v_outTableArr = new ArrayList<>();
        

        try{

            detailTableName = this.createTempTableDetail( inputTable );



            // Procedure Call
            StringBuffer sqlCallProc = new StringBuffer();
            sqlCallProc.append("CALL SP_NP_NET_PRICE_APPROVAL_PRICEINFO_PROC(")       
                        .append(" I_TENANT_ID => ?")
                        .append(",I_LANGUAGE_CODE => ?")
                        .append(",I_DETAILS => ").append( detailTableName )
                        .append(",O_DETAILS => ? ")
                        .append(",O_RETURN_CODE => ? ")
                        .append(",O_RETURN_MSG => ? ")
                        .append(")");

            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(new SqlParameter("I_TENANT_ID"                    , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_LANGUAGE_CODE"                , Types.VARCHAR));    

            paramList.add(new SqlReturnResultSet("O_DETAILS", (ResultSet v_rs, int rowNum) -> {

                OutTableType v_row = OutTableType.create();
/*
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setOrgTypeCode(v_rs.getString("org_type_code"));
                v_row.setOrgCode(v_rs.getString("org_code"));
                v_row.setSupplierCode(v_rs.getString("supplier_code"));
                v_row.setSupplierName(v_rs.getString("supplier_name"));
                v_row.setMaterialCode(v_rs.getString("material_code"));
                v_row.setMarketCode(v_rs.getString("market_code"));
                v_row.setCurrCurrencyCode(v_rs.getString("curr_currency_code"));

                v_outTableArr.add(v_row);
 */
                return v_row;
            }));     

            paramList.add(new SqlOutParameter("O_RETURN_CODE"               , Types.VARCHAR));
            paramList.add(new SqlOutParameter("O_RETURN_MSG"                , Types.VARCHAR));

            Map<String, Object> resultMap = jdbc.call((Connection connection) -> {
                CallableStatement callableStatement = connection.prepareCall(sqlCallProc.toString());
                callableStatement.setString("I_TENANT_ID"                    , tenant_id );
                callableStatement.setString("I_LANGUAGE_CODE"                , language_code );
                return callableStatement;
            }, paramList);

            log.info(">>>>>>>>>>>>>>> ResultMap : {}", resultMap );

            String resultCode = (String)resultMap.get("O_RETURN_CODE");
            String resultMsg  = (String)resultMap.get("O_RETURN_MSG");

            //List<VpOutType> list = resultMap.get("O_DETAILS")

            /*
            if(!"OK".equals( resultCode )){
                log.error("SP_NP_NET_PRICE_APPROVAL_SAVE_PROC 호출시 오류 발생 함 Code:{}, Message:{} ", resultCode, resultMsg);
                resultMsg = this.getMessage( resultCode, "KO"); // Error 코드에 대한 다국어 적용된 Message로 변환.
                throw new ServiceException(ErrorStatuses.SERVER_ERROR, resultMsg );
            }
            */

            //vResult.setReturnCode( resultCode );
            //vResult.setApprovalNumber( resultMsg );
            //vResult.s

        }finally{
            try{ this.dropTemporaryTable( detailTableName ); }catch(Exception e){}
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
    private String createTempTableDetail( Collection<InputTableType> vDetails ){
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함 
        
        String tableName = "#SP_NP_NET_PRICE_APPROVAL_PRICEINFO_PROC_LOCAL_TEMP_DTL";

        jdbc.execute(new StringBuffer()
                    .append("CREATE local TEMPORARY column TABLE ").append(tableName).append(" (")
                    .append(" TENANT_ID                   NVARCHAR(5)")
                    .append(",COMPANY_CODE                NVARCHAR(10)")
                    .append(",ORG_TYPE_CODE               NVARCHAR(2)")
                    .append(",ORG_CODE                    NVARCHAR(10)")
                    .append(",SUPPLIER_CODE               NVARCHAR(10)")
                    .append(",MATERIAL_CODE               NVARCHAR(40)")
                    .append(",MARKET_CODE                 NVARCHAR(30)")
                    .append(")")
                    .toString()
                    );

        String insertSql = "INSERT INTO " + tableName + " VALUES (?,?,?,?,? ,?,?)";

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(vDetails != null && !vDetails.isEmpty() ){
            for(InputTableType vRow : vDetails){
                batchDtl.add( new Object[] {                        
                     vRow.get("tenant_id")                  
                    ,vRow.get("company_code")                 
                    ,vRow.get("org_type_code")   
                    ,vRow.get("org_code")                  
                    ,vRow.get("supplier_code")                   // '공급업체코드'	
                    ,vRow.get("material_code")           
                    ,vRow.get("market_code")                     // '납선코드'	
                    	
                });
            }
        }
        jdbc.batchUpdate(insertSql, batchDtl);  
        return tableName;
    }


}