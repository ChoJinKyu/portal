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
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.npapprovalv4service.NpApprovalV4Service_;
import cds.gen.sp.npapprovalv4service.ParamType;
import cds.gen.sp.npapprovalv4service.ResultType;
import cds.gen.sp.npapprovalv4service.ApprovalSaveProcContext;
import cds.gen.sp.npapprovalv4service.DetailType;

@Component
@ServiceName(NpApprovalV4Service_.CDS_NAME)
public class NetpriceApprovalV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger( NetpriceApprovalV4Service.class );

    @Autowired
    private JdbcTemplate jdbc;


    /*
    PROCEDURE SP_NP_NET_PRICE_APPROVAL_SAVE_PROC (
        IN   APPROVAL_NUMBER   NVARCHAR(20)
        ,IN   I_DTL				TABLE (
                                    DTL_SEQ         NVARCHAR(20)
                                )
                                
        ,IN   I_USER_ID 		NVARCHAR(255)
        ,OUT  O_MSG				TABLE (
                                    RETURN_CODE     NVARCHAR(2)
                                    ,RETURN_MSG      NVARCHAR(1000)
                                )
    */



    private String createTempTableDtl( Collection<DetailType> vDetails ){
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함 
        
        String tableName = "#LOCAL_TEMP_DTL";

        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE ").append(tableName).append(" (")
                            .append("DTL_SEQ NVARCHAR(20),")  
                            .append(")");
        
        String v_sql_dropTableMst = "DROP TABLE #LOCAL_TEMP_DTL";

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?)";


        log.info("### LOCAL_TEMP Success ###");
        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(vDetails != null && !vDetails.isEmpty() ){
            for(DetailType vRow : vDetails){
                batchDtl.add( new Object[] {                        
                    vRow.get("dtlSeq")
                });
            }
        }

        int[] updateCountsMst = jdbc.batchUpdate(v_sql_insertTableMst, batchDtl);  

        return tableName;
    }


    @Transactional(rollbackFor = SQLException.class)
    @On(event=ApprovalSaveProcContext.CDS_NAME)
    public void onApprovalSaveProc(ApprovalSaveProcContext context) {   

        log.info("### onVpMappingChangeTestProc 1건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_DTL (")
                            .append("DTL_SEQ NVARCHAR(20),")  
                            .append(")");
        
        String v_sql_dropTableMst = "DROP TABLE #LOCAL_TEMP_DTL";

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?)";


        log.info("### LOCAL_TEMP Success ###");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_NP_NET_PRICE_APPROVAL_SAVE_PROC(")       
                    .append("I_MST => #LOCAL_TEMP_MST,")
                    .append("I_SUP => #LOCAL_TEMP_SUPPLIER,")
                    .append("I_ITM => #LOCAL_TEMP_ITEM, ")
                    .append("I_MAN => #LOCAL_TEMP_MANAGER,")
                    .append("I_USER_ID => ?,")
                    .append("I_USER_NO => ?,")
                    .append("O_MSG => ?)");

        log.info("### DB Connect Start ###");

        ParamType vParam = context.getParam();

        Collection<DetailType> vDetails = vParam.getDetails();

        Collection<ResultType> vResult = new ArrayList<>();
        		            
        log.info("### Proc Start ###");            

        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Vendor Pool Mst Local Temp Table 생성            
        jdbc.execute(v_sql_createTableMst.toString());

        // Vendor Pool Mst Local Temp Table에 insert                        
        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(vDetails != null && !vDetails.isEmpty() ){
            for(DetailType vRow : vDetails){
                batchDtl.add( new Object[] {                        
                    vRow.get("dtlSeq")
                });
            }
        }

        int[] updateCountsMst = jdbc.batchUpdate(v_sql_insertTableMst, batchDtl);                        

        log.info("### insertMst Success ###");
/*
        // Vendor Pool Supplier Local Temp Table 생성
        jdbc.execute(v_sql_createTableSupplier.toString());

        // Vendor Pool Supplier Local Temp Table에 insert            
        List<Object[]> batchSupp = new ArrayList<Object[]>();
        if(!v_inSupplier.isEmpty() && v_inSupplier.size() > 0){
            for(VpSuppilerType v_inRow : v_inSupplier){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("vendor_pool_local_name"),
                    v_inRow.get("vendor_pool_english_name"),
                    v_inRow.get("repr_department_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("inp_type_code"),
                    v_inRow.get("mtlmob_base_code"),
                    v_inRow.get("regular_evaluation_flag"),
                    v_inRow.get("industry_class_code"),
                    v_inRow.get("sd_exception_flag"),
                    v_inRow.get("vendor_pool_apply_exception_flag"),
                    v_inRow.get("maker_material_code_mngt_flag"),
                    v_inRow.get("domestic_net_price_diff_rate"),
                    v_inRow.get("dom_oversea_netprice_diff_rate"),
                    v_inRow.get("equipment_grade_code"),
                    v_inRow.get("equipment_type_code"),
                    v_inRow.get("vendor_pool_use_flag"),
                    v_inRow.get("vendor_pool_desc"),
                    v_inRow.get("vendor_pool_history_desc"),
                    v_inRow.get("parent_vendor_pool_code"),
                    v_inRow.get("leaf_flag"),
                    v_inRow.get("level_number"),
                    v_inRow.get("display_sequence"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")
                };
                    
                batchSupp.add(values);
            }
        }

        int[] updateCountsSupp = jdbc.batchUpdate(v_sql_insertTableSupplier, batchSupp);                          

        log.info("### insertSupplier Success ###");

        // Vendor Pool Item Local Temp Table 생성
        jdbc.execute(v_sql_createTableItem.toString());

        // Vendor Pool Item Local Temp Table에 insert
        List<Object[]> batchItem = new ArrayList<Object[]>();
        if(!v_inItem.isEmpty() && v_inItem.size() > 0){
            for(VpItemType v_inRow : v_inItem){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),    
                    v_inRow.get("crud_type_code")  
                };
                    
                batchItem.add(values);
            }
        }

        int[] updateCountsItem = jdbc.batchUpdate(v_sql_insertTableItem, batchItem);                                      

        log.info("### insertItem Success ###");

        // Vendor Pool Manager Local Temp Table 생성
        jdbc.execute(v_sql_createTableManager.toString());

        // Vendor Pool Manager Local Temp Table에 insert
        List<Object[]> batchManager = new ArrayList<Object[]>();
        if(!v_inManager.isEmpty() && v_inManager.size() > 0){
            for(VpManagerType v_inRow : v_inManager){
                Object[] values = new Object[] {                        
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("org_type_code"),
                    v_inRow.get("org_code"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("vendor_pool_person_empno"),
                    v_inRow.get("vendor_pool_person_role_text"),
                    v_inRow.get("vendor_pool_mapping_use_flag"),
                    v_inRow.get("register_reason"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("crud_type_code")                    
                };
                    
                batchManager.add(values);
            }
        }

        int[] updateCountsManager = jdbc.batchUpdate(v_sql_insertTableManager, batchManager);            

        log.info("### insertManager Success ###");

        // Procedure Call
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(new SqlParameter("I_USER_ID", Types.VARCHAR));
        paramList.add(new SqlParameter("I_USER_NO", Types.VARCHAR));       
        
        SqlReturnResultSet oReturn = new SqlReturnResultSet("O_MSG", new RowMapper<VpOutType>(){
            @Override
            public VpOutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                VpOutType v_row = VpOutType.create();
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
                log.info(v_rs.getString("return_code"));
                log.info(v_rs.getString("return_msg"));  
                if("NG".equals(v_rs.getString("return_code"))){
                    log.info("### Call Proc Error!!  ###");
                    throw new ServiceException(ErrorStatuses.BAD_REQUEST, v_rs.getString("return_msg"));
                }              
                v_result.add(v_row);
                return v_row;
            }
        });
        paramList.add(oReturn);       

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                callableStatement.setString("I_USER_NO", context.getInputData().getUserNo());
                return callableStatement;
            }
        }, paramList);

        log.info("### callProc Success ###");

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableMst);
        jdbc.execute(v_sql_dropTableSupplier);
        jdbc.execute(v_sql_dropTableItem);
        jdbc.execute(v_sql_dropTableManager);

        
        context.setResult(v_result);
        context.setCompleted(); 
        
        
        */
    }
}