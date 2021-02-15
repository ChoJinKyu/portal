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

        Collection<OutTableType> v_outTableArr = new ArrayList<OutTableType>();

        try{

            detailTableName = this.createTempTableDetail( inputTable );

            // Procedure Call
            StringBuffer sqlCallProc = new StringBuffer();
            sqlCallProc.append("CALL SP_NP_NET_PRICE_APPROVAL_PRICEINFO_PROC(")       
                        .append(" I_TENANT_ID => ?")
                        .append(",I_LANGUAGE_CODE => ?")
                        .append(",I_DETAILS => ").append( detailTableName )
                        .append(",O_RETURN_CODE => ?")
                        .append(",O_RETURN_MSG => ?")
                        .append(",O_DETAILS => ? ")
                        .append(")");

            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(new SqlParameter("I_TENANT_ID"                    , Types.VARCHAR));       
            paramList.add(new SqlParameter("I_LANGUAGE_CODE"                , Types.VARCHAR));    

            paramList.add(new SqlOutParameter("O_RETURN_CODE"               , Types.VARCHAR));
            paramList.add(new SqlOutParameter("O_RETURN_MSG"                , Types.VARCHAR));

            SqlReturnResultSet oReturnTable = new SqlReturnResultSet("O_DETAILS", new RowMapper<OutTableType>(){
                @Override
                public OutTableType mapRow(ResultSet v_rs, int rowNum) throws SQLException {

                    OutTableType v_row = OutTableType.create();
                    try{
                        v_row.setTenantId           (v_rs.getString("tenant_id"));
                        v_row.setCompanyCode        (v_rs.getString("company_code"));
                        v_row.setOrgTypeCode        (v_rs.getString("org_type_code"));
                        v_row.setOrgCode            (v_rs.getString("org_code"));
                        v_row.setApprovalNumber     (v_rs.getString("approval_number"));
                        v_row.setItemSequence       (v_rs.getLong("item_sequence"));
                        v_row.setSupplierCode       (v_rs.getString("supplier_code"));
                        v_row.setSupplierName       (v_rs.getString("supplier_name"));
                        v_row.setMaterialCode       (v_rs.getString("material_code"));
                        v_row.setMarketCode         (v_rs.getString("market_code"));
                        v_row.setCurrencyCode       (v_rs.getString("currency_code"));
                        v_row.setNetPrice           (v_rs.getBigDecimal("net_price"));
                        v_row.setBasePriceTypeCode  (v_rs.getString("base_price_type_code"));

                        v_row.setPyearDecBaseCurrencyCode  (v_rs.getString("pyear_dec_base_currency_code"));
                        v_row.setPyearDecBasePrice  (v_rs.getBigDecimal("pyear_dec_base_price"));
                        v_row.setPyearDecCiRate     (v_rs.getBigDecimal("pyear_dec_ci_rate"));
                        v_row.setQuarterBaseCurrencyCode  (v_rs.getString("quarter_base_currency_code"));
                        v_row.setQuarterBasePrice   (v_rs.getBigDecimal("quarter_base_price"));
                        v_row.setQuarterCiRate      (v_rs.getBigDecimal("quarter_ci_rate"));

                        v_row.setBaseDate           (v_rs.getDate("base_date")==null?null:v_rs.getDate("base_date").toLocalDate());
                        v_row.setBasePrice          (v_rs.getBigDecimal("base_price"));
                        v_row.setBaseCurrencyCode   (v_rs.getString("base_currency_code"));
                        v_row.setBaseApplyStartYyyymm   (v_rs.getString("base_apply_start_yyyymm"));
                        v_row.setBaseApplyEndYyyymm (v_rs.getString("base_apply_end_yyyymm"));

                        v_outTableArr.add(v_row);

                    }catch(Exception e){
                        
                        log.info(">>>>>>>>>>> error =["+ e.toString() );
                    }
                    return v_row;
                }
            });
            
            paramList.add(oReturnTable);

/*
            paramList.add(new SqlReturnResultSet("O_DETAILS", (ResultSet v_rs, int rowNum) -> {

                OutTableType v_row = OutTableType.create();

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
 
                return v_row;
            }));     
*/

            Map<String, Object> resultMap = jdbc.call((Connection connection) -> {
                CallableStatement callableStatement = connection.prepareCall(sqlCallProc.toString());
                callableStatement.setString("I_TENANT_ID"                    , tenant_id );
                callableStatement.setString("I_LANGUAGE_CODE"                , language_code );
                return callableStatement;
            }, paramList);

            log.info(">>>>>>>>>>>>>>> ResultMap : {}", resultMap );

            String resultCode = (String)resultMap.get("O_RETURN_CODE");
            String resultMsg  = (String)resultMap.get("O_RETURN_MSG");

            vResult.setReturnCode(resultCode);
            vResult.setReturnMsg(resultMsg);
            vResult.setOutDetails(v_outTableArr);

        }finally{
            try{ this.dropTemporaryTable( detailTableName ); }catch(Exception e){}
        }


        log.info("### callProc Success ###");

        context.setResult( vResult );
        context.setCompleted(); 
    }


    /**
     * 
     * @param InputTableType
     * @return
     */
    private String createTempTableDetail( Collection<InputTableType> inputTable  ){
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함  (중요)
        
        String tableName = "#SP_NP_NET_PRICE_APPROVAL_PRICEINFO_PROC_LOCAL_TEMP_DTL";

        jdbc.execute(new StringBuffer()
                .append("CREATE local TEMPORARY column TABLE ").append(tableName).append(" AS (")
                .append("  SELECT                                                                 ")
                .append("             tenant_id                                   ")  
                .append("           , company_code                                ")  
                .append("           , org_type_code                               ")  
                .append("           , org_code                                    ")  
                .append("           , approval_number                             ")  
                .append("           , item_sequence                               ")  
                .append("           , supplier_code                               ")  
                .append("           , material_code                               ")  
                .append("           , market_code                                 ")  
                .append("           , currency_code                               ")  
                //.append("     , cast('' as nvarchar(1)) as _row_state_    ")  
                .append("  FROM SP_NP_NET_PRICE_APPROVAL_DTL WHERE 1=0      ")    
                .append(")")
                .toString()
                );
/*

        jdbc.execute(new StringBuffer()
                    .append("CREATE local TEMPORARY column TABLE ").append(tableName).append(" (")
                    .append(" TENANT_ID                   NVARCHAR(5)")
                    .append(",COMPANY_CODE                NVARCHAR(10)")
                    .append(",ORG_TYPE_CODE               NVARCHAR(2)")
                    .append(",ORG_CODE                    NVARCHAR(10)")
                    .append(",APPROVAL_NUMBER			  NVARCHAR(50)")
                    .append(",ITEM_SEQUENCE				  BIGINT")
                    .append(",SUPPLIER_CODE               NVARCHAR(10)")
                    .append(",MATERIAL_CODE               NVARCHAR(40)")
                    .append(",MARKET_CODE                 NVARCHAR(30)")
                    .append(",CURRENCY_CODE               NVARCHAR(3)")
                    .append(")")
                    .toString()
                    );
*/

        String insertSql = "INSERT INTO " + tableName + " VALUES (?,?,?,?,? ,?,?,?,?,?)";

        //Local Temp Table에 insert                        
        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(inputTable != null && !inputTable.isEmpty() ){
            for(InputTableType vRow : inputTable){
                batchDtl.add( new Object[] {                        
                     vRow.get("tenant_id")                  
                    ,vRow.get("company_code")                 
                    ,vRow.get("org_type_code")
                    ,vRow.get("org_code")
                    ,vRow.get("approval_number")
                    ,vRow.get("item_sequence")     
                    ,vRow.get("supplier_code")                  
                    ,vRow.get("material_code")           
                    ,vRow.get("market_code")                     	
                    ,vRow.get("currency_code") 
                });
            }
        }
        jdbc.batchUpdate(insertSql, batchDtl);  
        return tableName;
    }
}