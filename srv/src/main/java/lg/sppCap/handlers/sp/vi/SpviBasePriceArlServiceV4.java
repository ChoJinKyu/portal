package lg.sppCap.handlers.sp.vi;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.time.Instant;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import lg.sppCap.util.TimezoneUtil;

import cds.gen.sp.spvibasepricearlv4service.*;

@Component
@ServiceName(SpviBasePriceArlV4Service_.CDS_NAME)
public class SpviBasePriceArlServiceV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;   

    /**
     * 품의서 저장 프로시저 호출전 데이터 추가
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @Before(event=SpViBasePriceAprlProcContext.CDS_NAME)
    public void beforeSpViBasePriceAprlProc(SpViBasePriceAprlProcContext context) {
        
        log.info("#### before ###SpViBasePriceAprlProc");

        Instant localNow = TimezoneUtil.getZonedNow().toInstant(); //로컬 시간

        String SP_VI_APPROVAL_NUMBER_FUNC = "";

        Collection<BasePriceAprlMstType> BasePriceAprlMstTypes = context.getInputData().getBasePriceAprlMstType();
        Collection<BasePriceAprlApproverType> BasePriceAprlApproverTypes = context.getInputData().getBasePriceAprlApproverType();
        Collection<BasePriceAprlRefererType> BasePriceAprlRefererTypes = context.getInputData().getBasePriceAprlRefererType();
        Collection<BasePriceAprlTypeType> BasePriceAprlTypeTypes = context.getInputData().getBasePriceAprlTypeType();
        Collection<BasePriceAprlItemType> BasePriceAprlItemTypes = context.getInputData().getBasePriceAprlItemType();
        Collection<BasePriceAprlDtlType> BasePriceAprlDtlTypes = context.getInputData().getBasePriceAprlDtlType();

        
        String tenant_id =  "";
        String approval_number = "";
        
        //품의마스터 품의번호 세팅
        for(BasePriceAprlMstType BasePriceAprlMst : BasePriceAprlMstTypes){
            tenant_id =  BasePriceAprlMst.getTenantId();

            SP_VI_APPROVAL_NUMBER_FUNC = "SELECT SP_VI_APPROVAL_NUMBER_FUNC(?) FROM DUMMY";
            approval_number = jdbc.queryForObject(SP_VI_APPROVAL_NUMBER_FUNC, new Object[] { tenant_id }, String.class);

            BasePriceAprlMst.setApprovalNumber(approval_number);
            BasePriceAprlMst.setLocalCreateDtm(localNow);
            BasePriceAprlMst.setLocalUpdateDtm(localNow);
        }
        //양산가품의서유형 품의번호 세팅
        for(BasePriceAprlTypeType BasePriceAprlType : BasePriceAprlTypeTypes){
            BasePriceAprlType.setApprovalNumber(approval_number);
            BasePriceAprlType.setLocalCreateDtm(localNow);
            BasePriceAprlType.setLocalUpdateDtm(localNow);
        }

        //품의참조자
        for(BasePriceAprlRefererType BasePriceAprlReferer : BasePriceAprlRefererTypes){
            BasePriceAprlReferer.setApprovalNumber(approval_number);
            BasePriceAprlReferer.setLocalCreateDtm(localNow);
            BasePriceAprlReferer.setLocalUpdateDtm(localNow);
        }

        String SP_VI_ITEM_SEQUENCE_FUNC = "SELECT SP_VI_ITEM_SEQUENCE_FUNC(?,?,?) FROM DUMMY";    

        BigDecimal increament = new BigDecimal("1");
        BigDecimal item_sequence = new BigDecimal(1);

        //양산품의ITEM //Dtl
        for(BasePriceAprlItemType BasePriceAprlItem : BasePriceAprlItemTypes){
            
            BasePriceAprlItem.setApprovalNumber(approval_number);
            BasePriceAprlItem.setLocalCreateDtm(localNow);
            BasePriceAprlItem.setLocalUpdateDtm(localNow);

            // item_sequence = jdbc.queryForObject(SP_VI_ITEM_SEQUENCE_FUNC, new Object[] { tenant_id, approval_number, 1 }, BigDecimal.class);
            BasePriceAprlItem.setItemSequence(increament);
            increament = increament.add(new BigDecimal("1"));

            log.info("item_sequence : " + item_sequence);
            log.info("increament : " + increament);
        }

        int i_Approver = 1;
        //품의승인자 품의번호 세팅
        for(BasePriceAprlApproverType BasePriceAprlApprover : BasePriceAprlApproverTypes){
            
            BasePriceAprlApprover.setApprovalNumber(approval_number);
            BasePriceAprlApprover.setApproveSequence(Integer.toString(i_Approver));
            BasePriceAprlApprover.setLocalCreateDtm(localNow);
            BasePriceAprlApprover.setLocalUpdateDtm(localNow); 
            i_Approver++;
        }

        //일반품의시 사용안함
        for(BasePriceAprlDtlType BasePriceAprlDtl : BasePriceAprlDtlTypes){
            BasePriceAprlDtl.setApprovalNumber(approval_number);
            BasePriceAprlDtl.setItemSequence(item_sequence);
            BasePriceAprlDtl.setLocalCreateDtm(localNow);
            BasePriceAprlDtl.setLocalUpdateDtm(localNow);
            BasePriceAprlDtl.setMetalTypeCode("1");

           
        }
    }
    /**
     * 품의서 저장 프로시저 호출
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event=SpViBasePriceAprlProcContext.CDS_NAME)
    public void SpViBasePriceAprlProc(SpViBasePriceAprlProcContext context) {

        log.info("### SpviBasePriceArlServiceV4 ### Start ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption      = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        String v_sql_dropable_master   = "DROP TABLE #LOCAL_TEMP_MATER";
        String v_sql_dropable_approver = "DROP TABLE #LOCAL_TEMP_APPROVER";
        String v_sql_dropable_referer  = "DROP TABLE #LOCAL_TEMP_REFERER";
        String v_sql_dropable_type     = "DROP TABLE #LOCAL_TEMP_TYPE";
        String v_sql_dropable_item     = "DROP TABLE #LOCAL_TEMP_ITEM";
        String v_sql_dropable_dtl      = "DROP TABLE #LOCAL_TEMP_DTL";


        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMaster = new StringBuffer();
        v_sql_createTableMaster.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MATER ");
        v_sql_createTableMaster.append("(");
        v_sql_createTableMaster.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableMaster.append("APPROVAL_NUMBER       NVARCHAR(30),");        
        v_sql_createTableMaster.append("CHAIN_CODE            NVARCHAR(30),");
        v_sql_createTableMaster.append("APPROVAL_TYPE_CODE    NVARCHAR(30),");
        v_sql_createTableMaster.append("APPROVAL_TITLE        NVARCHAR(300),");
        v_sql_createTableMaster.append("APPROVAL_CONTENTS     NCLOB,");
        v_sql_createTableMaster.append("APPROVE_STATUS_CODE   NVARCHAR(30),");
        v_sql_createTableMaster.append("REQUESTOR_EMPNO       NVARCHAR(50),");
        v_sql_createTableMaster.append("REQUEST_DATE          NVARCHAR(8),");
        v_sql_createTableMaster.append("ATTCH_GROUP_NUMBER    NVARCHAR(100),");
        v_sql_createTableMaster.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableMaster.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableMaster.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableMaster.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableMaster.append(")");

        StringBuffer v_sql_createTableApprover = new StringBuffer();
        v_sql_createTableApprover.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_APPROVER ");
        v_sql_createTableApprover.append("(");
        v_sql_createTableApprover.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableApprover.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVE_SEQUENCE      NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVER_EMPNO        NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVER_TYPE_CODE    NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVE_STATUS_CODE   NVARCHAR(30),");
        v_sql_createTableApprover.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableApprover.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableApprover.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableApprover.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableApprover.append(")");

        StringBuffer v_sql_createTableReferer = new StringBuffer();
        v_sql_createTableReferer.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_Referer ");
        v_sql_createTableReferer.append("(");
        v_sql_createTableReferer.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableReferer.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableReferer.append("REFERER_EMPNO         NVARCHAR(30),");
        v_sql_createTableReferer.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableReferer.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableReferer.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableReferer.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableReferer.append(")");

        StringBuffer v_sql_createTableType = new StringBuffer();
        v_sql_createTableType.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_TYPE ");
        v_sql_createTableType.append("(");
        v_sql_createTableType.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableType.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableType.append("NET_PRICE_TYPE_CODE   NVARCHAR(30),");
        v_sql_createTableType.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableType.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableType.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableType.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableType.append(")");


        StringBuffer v_sql_createTableItem = new StringBuffer();
        v_sql_createTableItem.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_Item ");
        v_sql_createTableItem.append("(");
        v_sql_createTableItem.append("TENANT_ID              NVARCHAR(5),");
        v_sql_createTableItem.append("APPROVAL_NUMBER        NVARCHAR(30),");
        v_sql_createTableItem.append("ITEM_SEQUENCE          NVARCHAR(50),");
        v_sql_createTableItem.append("COMPANY_CODE           NVARCHAR(10),");
        v_sql_createTableItem.append("BIZUNIT_CODE           NVARCHAR(10),");
        v_sql_createTableItem.append("MANAGEMENT_MPRICE_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("BASE_YEAR              NVARCHAR(4),");
        v_sql_createTableItem.append("APPLY_START_YYYYMM     NVARCHAR(6),");
        v_sql_createTableItem.append("APPLY_END_YYYYMM       NVARCHAR(6),");
        v_sql_createTableItem.append("BIZDIVISION_CODE       NVARCHAR(10),");
        v_sql_createTableItem.append("PLANT_CODE             NVARCHAR(10),");
        v_sql_createTableItem.append("SUPPLY_PLANT_CODE      NVARCHAR(10),");
        v_sql_createTableItem.append("SUPPLIER_CODE          NVARCHAR(10),");
        v_sql_createTableItem.append("MATERIAL_CODE          NVARCHAR(40),");
        v_sql_createTableItem.append("MATERIAL_NAME          NVARCHAR(240),");
        v_sql_createTableItem.append("VENDOR_POOL_CODE       NVARCHAR(20),");
        v_sql_createTableItem.append("CURRENCY_CODE          NVARCHAR(3),");
        v_sql_createTableItem.append("BASE_UOM_CODE          NVARCHAR(30),");
        v_sql_createTableItem.append("BUYER_EMPNO            NVARCHAR(30),");
        v_sql_createTableItem.append("BASE_PRICE             DECIMAL(19, 4),");
        v_sql_createTableItem.append("PCST                   DECIMAL(34),");
        v_sql_createTableItem.append("METAL_NET_PRICE        DECIMAL(34),");
        v_sql_createTableItem.append("COATING_MAT_NET_PRICE  DECIMAL(34),");
        v_sql_createTableItem.append("FABRIC_NET_PRICE       DECIMAL(34),");
        v_sql_createTableItem.append("LOCAL_CREATE_DTM       SECONDDATE,");
        v_sql_createTableItem.append("LOCAL_UPDATE_DTM       SECONDDATE,");
        v_sql_createTableItem.append("CREATE_USER_ID         NVARCHAR(255),");
        v_sql_createTableItem.append("UPDATE_USER_ID         NVARCHAR(255)");
        v_sql_createTableItem.append(")");

        StringBuffer v_sql_createTableDtl = new StringBuffer();
        v_sql_createTableDtl.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_DTL ");
        v_sql_createTableDtl.append("(");
        v_sql_createTableDtl.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableDtl.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableDtl.append("ITEM_SEQUENCE         DECIMAL(34,0),");
        v_sql_createTableDtl.append("METAL_TYPE_CODE       NVARCHAR(30),");
        v_sql_createTableDtl.append("METAL_NET_PRICE       DECIMAL(19, 4),");
        v_sql_createTableDtl.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableDtl.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableDtl.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableDtl.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableDtl.append(")");

        // local temp table insert queary 
        String v_sql_insertTableMaster = "INSERT INTO #LOCAL_TEMP_MATER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableApprover = "INSERT INTO #LOCAL_TEMP_APPROVER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableReferer = "INSERT INTO #LOCAL_TEMP_REFERER VALUES (?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableType = "INSERT INTO #LOCAL_TEMP_TYPE VALUES (?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableItem = "INSERT INTO #LOCAL_TEMP_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableDtl = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Procedures call queary
        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_VI_BASE_PRICE_APRL_INSERT_PROC");        
        v_sql_callProc.append("(");
        v_sql_callProc.append("I_MASTER => #LOCAL_TEMP_MATER,");        
        v_sql_callProc.append("I_APPROVER => #LOCAL_TEMP_APPROVER,");        
        v_sql_callProc.append("I_REFERER => #LOCAL_TEMP_REFERER, ");        
        v_sql_callProc.append("I_TYPE => #LOCAL_TEMP_TYPE,");        
        v_sql_callProc.append("I_ITEM => #LOCAL_TEMP_ITEM,");        
        v_sql_callProc.append("I_DTL => #LOCAL_TEMP_DTL,");        
        v_sql_callProc.append("NET_PRICE_TYPE_CODE => ?,");        
        v_sql_callProc.append("O_MSG => ?");         
        v_sql_callProc.append(")");

        Collection<BasePriceAprlMstType> ViMst = context.getInputData().getBasePriceAprlMstType();
        Collection<BasePriceAprlApproverType> ViApproverType = context.getInputData().getBasePriceAprlApproverType();
        Collection<BasePriceAprlRefererType> ViRefererType = context.getInputData().getBasePriceAprlRefererType();
        Collection<BasePriceAprlTypeType> ViType = context.getInputData().getBasePriceAprlTypeType();
        Collection<BasePriceAprlItemType> ViItem = context.getInputData().getBasePriceAprlItemType();
        Collection<BasePriceAprlDtlType> ViMetalDetailType = context.getInputData().getBasePriceAprlDtlType();
        OutputDataType v_result = OutputDataType.create();

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        ResultSet v_rs = null;
        
        // Master Local Temp Table 생성
        jdbc.execute(v_sql_createTableMaster.toString());

        // Master Local Temp Table에 insert
        List<Object[]> batch_master = new ArrayList<Object[]>();
        if(!ViMst.isEmpty() && ViMst.size() > 0){
        log.info("-----> ViMst : " + ViMst.size());
            for(BasePriceAprlMstType v_inRow : ViMst){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("chain_code"),
                    v_inRow.get("approval_type_code"),
                    v_inRow.get("approval_title"),
                    v_inRow.get("approval_contents"),
                    v_inRow.get("approve_status_code"),
                    v_inRow.get("requestor_empno"),
                    v_inRow.get("request_date"),
                    v_inRow.get("attch_group_number"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_master.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableMaster, batch_master);
            log.info("batch_master : " + updateCounts);
        }



        // Approver Local Temp Table 생성
        jdbc.execute(v_sql_createTableApprover.toString());

        // Approver Local Temp Table에 insert
        List<Object[]> batch_Approver = new ArrayList<Object[]>();
        if(!ViApproverType.isEmpty() && ViApproverType.size() > 0){
        log.info("-----> ViApproverType : " + ViApproverType.size());
            for(BasePriceAprlApproverType v_inRow : ViApproverType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("approve_sequence"),
                    v_inRow.get("approver_empno"),
                    v_inRow.get("approver_type_code"),
                    v_inRow.get("approve_status_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Approver.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableApprover, batch_Approver);
            log.info("batch_Approver : " + updateCounts);
        }



        // Referer Local Temp Table 생성
        jdbc.execute(v_sql_createTableReferer.toString());

        // Referer Local Temp Table에 insert
        List<Object[]> batch_Referer = new ArrayList<Object[]>();
        if(!ViRefererType.isEmpty() && ViRefererType.size() > 0){
        log.info("-----> ViRefererType : " + ViRefererType.size());
            for(BasePriceAprlRefererType v_inRow : ViRefererType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("referer_empno"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Referer.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableReferer, batch_Referer);
            log.info("batch_Referer : " + updateCounts);
        }



        // Type Local Temp Table 생성
        jdbc.execute(v_sql_createTableType.toString());

        // Type Local Temp Table에 insert
        List<Object[]> batch_Type = new ArrayList<Object[]>();
        if(!ViType.isEmpty() && ViType.size() > 0){
        log.info("-----> ViType : " + ViType.size());
            for(BasePriceAprlTypeType v_inRow : ViType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("net_price_type_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Type.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableType, batch_Type);
            log.info("batch_Type : " + updateCounts);
        }


        
        // Item Local Temp Table 생성
        jdbc.execute(v_sql_createTableItem.toString());

        // Item Local Temp Table에 insert
        List<Object[]> batch_Item = new ArrayList<Object[]>();
        if(!ViItem.isEmpty() && ViItem.size() > 0){
        log.info("-----> ViItem : " + ViItem.size());
            for(BasePriceAprlItemType v_inRow : ViItem){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("item_sequence"),
                    v_inRow.get("company_code"),
                    v_inRow.get("bizunit_code"),
                    v_inRow.get("management_mprice_code"),
                    v_inRow.get("base_year"),
                    v_inRow.get("apply_start_yyyymm"),
                    v_inRow.get("apply_end_yyyymm"),
                    v_inRow.get("bizdivision_code"),
                    v_inRow.get("plant_code"),
                    v_inRow.get("supply_plant_code"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("material_name"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("base_uom_code"),
                    v_inRow.get("buyer_empno"),
                    v_inRow.get("base_price"),
                    v_inRow.get("pcst"),
                    v_inRow.get("metal_net_price"),
                    v_inRow.get("coating_mat_net_price"),
                    v_inRow.get("fabric_net_price"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Item.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableItem, batch_Item);
            log.info("batch_Item : " + updateCounts);
        }


        // Dtl Local Temp Table 생성
        jdbc.execute(v_sql_createTableDtl.toString());

        //Dtl Local Temp Table에 insert
        List<Object[]> batch_Dtl = new ArrayList<Object[]>();
        if(!ViMetalDetailType.isEmpty() && ViMetalDetailType.size() > 0){
        log.info("-----> ViMetalDetailType : " + ViMetalDetailType.size());
            for(BasePriceAprlDtlType v_inRow : ViMetalDetailType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("item_sequence"),
                    v_inRow.get("metal_type_code"),
                    v_inRow.get("metal_net_price"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Dtl.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableDtl, batch_Dtl);
            log.info("batch_Dtl  : " + updateCounts);
        }


        // Procedure output 담기
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        //프로시저 call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("NET_PRICE_TYPE_CODE", context.getInputData().getTypeCode());
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropable_master);
        jdbc.execute(v_sql_dropable_approver);
        jdbc.execute(v_sql_dropable_referer);
        jdbc.execute(v_sql_dropable_type);
        jdbc.execute(v_sql_dropable_item);
        jdbc.execute(v_sql_dropable_dtl);

        context.setResult(v_result);
        context.setCompleted();
        

        log.info("### SpviBasePriceArlServiceV4 ### End ###");
    }

    /**
     * 품의서 수정 프로시저 호출전 데이터 추가
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @Before(event=SpViBasePriceAprlUpdateProcContext.CDS_NAME)
    public void beforeSpViBasePriceAprlUpdateProc(SpViBasePriceAprlUpdateProcContext context) {
        
        log.info("#### before ###SpViBasePriceAprlUpdateProc");

        Instant localNow = TimezoneUtil.getZonedNow().toInstant(); //로컬 시간

        String SP_VI_APPROVAL_NUMBER_FUNC = "";

        Collection<BasePriceAprlMstType> BasePriceAprlMstTypes = context.getInputData().getBasePriceAprlMstType();
        Collection<BasePriceAprlApproverType> BasePriceAprlApproverTypes = context.getInputData().getBasePriceAprlApproverType();
        Collection<BasePriceAprlRefererType> BasePriceAprlRefererTypes = context.getInputData().getBasePriceAprlRefererType();
        Collection<BasePriceAprlTypeType> BasePriceAprlTypeTypes = context.getInputData().getBasePriceAprlTypeType();
        Collection<BasePriceAprlItemType> BasePriceAprlItemTypes = context.getInputData().getBasePriceAprlItemType();
        Collection<BasePriceAprlDtlType> BasePriceAprlDtlTypes = context.getInputData().getBasePriceAprlDtlType();

        
        //품의마스터 품의번호 세팅
        for(BasePriceAprlMstType BasePriceAprlMst : BasePriceAprlMstTypes){
            BasePriceAprlMst.setLocalUpdateDtm(localNow);
        }
        //양산가품의서유형 품의번호 세팅
        for(BasePriceAprlTypeType BasePriceAprlType : BasePriceAprlTypeTypes){
            BasePriceAprlType.setLocalUpdateDtm(localNow);
        }

        //품의참조자
        for(BasePriceAprlRefererType BasePriceAprlReferer : BasePriceAprlRefererTypes){
            BasePriceAprlReferer.setLocalUpdateDtm(localNow);
        }

        BigDecimal increament = new BigDecimal("1");
        BigDecimal item_sequence = new BigDecimal(1);

        //양산품의ITEM //Dtl
        for(BasePriceAprlItemType BasePriceAprlItem : BasePriceAprlItemTypes){

            BasePriceAprlItem.setLocalUpdateDtm(localNow);

            BasePriceAprlItem.setItemSequence(increament);
            increament = increament.add(new BigDecimal("1"));

            log.info("item_sequence : " + item_sequence);
            log.info("increament : " + increament);
        }

        int i_Approver = 1;
        //품의승인자 품의번호 세팅
        for(BasePriceAprlApproverType BasePriceAprlApprover : BasePriceAprlApproverTypes){
            
            BasePriceAprlApprover.setApproveSequence(Integer.toString(i_Approver));
            BasePriceAprlApprover.setLocalUpdateDtm(localNow); 
            i_Approver++;
        }

        //일반품의시 사용안함
        for(BasePriceAprlDtlType BasePriceAprlDtl : BasePriceAprlDtlTypes){
            BasePriceAprlDtl.setItemSequence(item_sequence);
            BasePriceAprlDtl.setLocalUpdateDtm(localNow);
            BasePriceAprlDtl.setMetalTypeCode("1");

           
        }
    }
    /**
     * 품의서 수정 프로시저 호출
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event=SpViBasePriceAprlUpdateProcContext.CDS_NAME)
    public void SpViBasePriceAprlUpdateProc(SpViBasePriceAprlUpdateProcContext context) {

        log.info("### SpViBasePriceAprlUpdateProc ### Start ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption      = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        String v_sql_dropable_master   = "DROP TABLE #LOCAL_TEMP_MATER";
        String v_sql_dropable_approver = "DROP TABLE #LOCAL_TEMP_APPROVER";
        String v_sql_dropable_referer  = "DROP TABLE #LOCAL_TEMP_REFERER";
        String v_sql_dropable_type     = "DROP TABLE #LOCAL_TEMP_TYPE";
        String v_sql_dropable_item     = "DROP TABLE #LOCAL_TEMP_ITEM";
        String v_sql_dropable_dtl      = "DROP TABLE #LOCAL_TEMP_DTL";


        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMaster = new StringBuffer();
        v_sql_createTableMaster.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MATER ");
        v_sql_createTableMaster.append("(");
        v_sql_createTableMaster.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableMaster.append("APPROVAL_NUMBER       NVARCHAR(30),");        
        v_sql_createTableMaster.append("CHAIN_CODE            NVARCHAR(30),");
        v_sql_createTableMaster.append("APPROVAL_TYPE_CODE    NVARCHAR(30),");
        v_sql_createTableMaster.append("APPROVAL_TITLE        NVARCHAR(300),");
        v_sql_createTableMaster.append("APPROVAL_CONTENTS     NCLOB,");
        v_sql_createTableMaster.append("APPROVE_STATUS_CODE   NVARCHAR(30),");
        v_sql_createTableMaster.append("REQUESTOR_EMPNO       NVARCHAR(50),");
        v_sql_createTableMaster.append("REQUEST_DATE          NVARCHAR(8),");
        v_sql_createTableMaster.append("ATTCH_GROUP_NUMBER    NVARCHAR(100),");
        v_sql_createTableMaster.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableMaster.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableMaster.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableMaster.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableMaster.append(")");

        StringBuffer v_sql_createTableApprover = new StringBuffer();
        v_sql_createTableApprover.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_APPROVER ");
        v_sql_createTableApprover.append("(");
        v_sql_createTableApprover.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableApprover.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVE_SEQUENCE      NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVER_EMPNO        NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVER_TYPE_CODE    NVARCHAR(30),");
        v_sql_createTableApprover.append("APPROVE_STATUS_CODE   NVARCHAR(30),");
        v_sql_createTableApprover.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableApprover.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableApprover.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableApprover.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableApprover.append(")");

        StringBuffer v_sql_createTableReferer = new StringBuffer();
        v_sql_createTableReferer.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_Referer ");
        v_sql_createTableReferer.append("(");
        v_sql_createTableReferer.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableReferer.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableReferer.append("REFERER_EMPNO         NVARCHAR(30),");
        v_sql_createTableReferer.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableReferer.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableReferer.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableReferer.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableReferer.append(")");

        StringBuffer v_sql_createTableType = new StringBuffer();
        v_sql_createTableType.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_TYPE ");
        v_sql_createTableType.append("(");
        v_sql_createTableType.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableType.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableType.append("NET_PRICE_TYPE_CODE   NVARCHAR(30),");
        v_sql_createTableType.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableType.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableType.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableType.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableType.append(")");


        StringBuffer v_sql_createTableItem = new StringBuffer();
        v_sql_createTableItem.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_Item ");
        v_sql_createTableItem.append("(");
        v_sql_createTableItem.append("TENANT_ID              NVARCHAR(5),");
        v_sql_createTableItem.append("APPROVAL_NUMBER        NVARCHAR(30),");
        v_sql_createTableItem.append("ITEM_SEQUENCE          NVARCHAR(50),");
        v_sql_createTableItem.append("COMPANY_CODE           NVARCHAR(10),");
        v_sql_createTableItem.append("BIZUNIT_CODE           NVARCHAR(10),");
        v_sql_createTableItem.append("MANAGEMENT_MPRICE_CODE NVARCHAR(30),");
        v_sql_createTableItem.append("BASE_YEAR              NVARCHAR(4),");
        v_sql_createTableItem.append("APPLY_START_YYYYMM     NVARCHAR(6),");
        v_sql_createTableItem.append("APPLY_END_YYYYMM       NVARCHAR(6),");
        v_sql_createTableItem.append("BIZDIVISION_CODE       NVARCHAR(10),");
        v_sql_createTableItem.append("PLANT_CODE             NVARCHAR(10),");
        v_sql_createTableItem.append("SUPPLY_PLANT_CODE      NVARCHAR(10),");
        v_sql_createTableItem.append("SUPPLIER_CODE          NVARCHAR(10),");
        v_sql_createTableItem.append("MATERIAL_CODE          NVARCHAR(40),");
        v_sql_createTableItem.append("MATERIAL_NAME          NVARCHAR(240),");
        v_sql_createTableItem.append("VENDOR_POOL_CODE       NVARCHAR(20),");
        v_sql_createTableItem.append("CURRENCY_CODE          NVARCHAR(3),");
        v_sql_createTableItem.append("BASE_UOM_CODE          NVARCHAR(30),");
        v_sql_createTableItem.append("BUYER_EMPNO            NVARCHAR(30),");
        v_sql_createTableItem.append("BASE_PRICE             DECIMAL(19, 4),");
        v_sql_createTableItem.append("PCST                   DECIMAL(34),");
        v_sql_createTableItem.append("METAL_NET_PRICE        DECIMAL(34),");
        v_sql_createTableItem.append("COATING_MAT_NET_PRICE  DECIMAL(34),");
        v_sql_createTableItem.append("FABRIC_NET_PRICE       DECIMAL(34),");
        v_sql_createTableItem.append("LOCAL_CREATE_DTM       SECONDDATE,");
        v_sql_createTableItem.append("LOCAL_UPDATE_DTM       SECONDDATE,");
        v_sql_createTableItem.append("CREATE_USER_ID         NVARCHAR(255),");
        v_sql_createTableItem.append("UPDATE_USER_ID         NVARCHAR(255)");
        v_sql_createTableItem.append(")");

        StringBuffer v_sql_createTableDtl = new StringBuffer();
        v_sql_createTableDtl.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_DTL ");
        v_sql_createTableDtl.append("(");
        v_sql_createTableDtl.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableDtl.append("APPROVAL_NUMBER       NVARCHAR(30),");
        v_sql_createTableDtl.append("ITEM_SEQUENCE         DECIMAL(34,0),");
        v_sql_createTableDtl.append("METAL_TYPE_CODE       NVARCHAR(30),");
        v_sql_createTableDtl.append("METAL_NET_PRICE       DECIMAL(19, 4),");
        v_sql_createTableDtl.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableDtl.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableDtl.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableDtl.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableDtl.append(")");

        // local temp table insert queary 
        String v_sql_insertTableMaster = "INSERT INTO #LOCAL_TEMP_MATER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableApprover = "INSERT INTO #LOCAL_TEMP_APPROVER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableReferer = "INSERT INTO #LOCAL_TEMP_REFERER VALUES (?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableType = "INSERT INTO #LOCAL_TEMP_TYPE VALUES (?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableItem = "INSERT INTO #LOCAL_TEMP_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableDtl = "INSERT INTO #LOCAL_TEMP_DTL VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Procedures call queary
        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_VI_BASE_PRICE_APRL_UPSERT_PROC");        
        v_sql_callProc.append("(");
        v_sql_callProc.append("I_MASTER => #LOCAL_TEMP_MATER,");        
        v_sql_callProc.append("I_APPROVER => #LOCAL_TEMP_APPROVER,");        
        v_sql_callProc.append("I_REFERER => #LOCAL_TEMP_REFERER, ");        
        v_sql_callProc.append("I_TYPE => #LOCAL_TEMP_TYPE,");        
        v_sql_callProc.append("I_ITEM => #LOCAL_TEMP_ITEM,");        
        v_sql_callProc.append("I_DTL => #LOCAL_TEMP_DTL,");        
        v_sql_callProc.append("NET_PRICE_TYPE_CODE => ?,");        
        v_sql_callProc.append("O_MSG => ?");         
        v_sql_callProc.append(")");

        Collection<BasePriceAprlMstType> ViMst = context.getInputData().getBasePriceAprlMstType();
        Collection<BasePriceAprlApproverType> ViApproverType = context.getInputData().getBasePriceAprlApproverType();
        Collection<BasePriceAprlRefererType> ViRefererType = context.getInputData().getBasePriceAprlRefererType();
        Collection<BasePriceAprlTypeType> ViType = context.getInputData().getBasePriceAprlTypeType();
        Collection<BasePriceAprlItemType> ViItem = context.getInputData().getBasePriceAprlItemType();
        Collection<BasePriceAprlDtlType> ViMetalDetailType = context.getInputData().getBasePriceAprlDtlType();
        OutputDataType v_result = OutputDataType.create();

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        ResultSet v_rs = null;
        
        // Master Local Temp Table 생성
        jdbc.execute(v_sql_createTableMaster.toString());

        // Master Local Temp Table에 insert
        List<Object[]> batch_master = new ArrayList<Object[]>();
        if(!ViMst.isEmpty() && ViMst.size() > 0){
        log.info("-----> ViMst : " + ViMst.size());
            for(BasePriceAprlMstType v_inRow : ViMst){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("chain_code"),
                    v_inRow.get("approval_type_code"),
                    v_inRow.get("approval_title"),
                    v_inRow.get("approval_contents"),
                    v_inRow.get("approve_status_code"),
                    v_inRow.get("requestor_empno"),
                    v_inRow.get("request_date"),
                    v_inRow.get("attch_group_number"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_master.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableMaster, batch_master);
            log.info("batch_master : " + updateCounts);
        }



        // Approver Local Temp Table 생성
        jdbc.execute(v_sql_createTableApprover.toString());

        // Approver Local Temp Table에 insert
        List<Object[]> batch_Approver = new ArrayList<Object[]>();
        if(!ViApproverType.isEmpty() && ViApproverType.size() > 0){
        log.info("-----> ViApproverType : " + ViApproverType.size());
            for(BasePriceAprlApproverType v_inRow : ViApproverType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("approve_sequence"),
                    v_inRow.get("approver_empno"),
                    v_inRow.get("approver_type_code"),
                    v_inRow.get("approve_status_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Approver.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableApprover, batch_Approver);
            log.info("batch_Approver : " + updateCounts);
        }



        // Referer Local Temp Table 생성
        jdbc.execute(v_sql_createTableReferer.toString());

        // Referer Local Temp Table에 insert
        List<Object[]> batch_Referer = new ArrayList<Object[]>();
        if(!ViRefererType.isEmpty() && ViRefererType.size() > 0){
        log.info("-----> ViRefererType : " + ViRefererType.size());
            for(BasePriceAprlRefererType v_inRow : ViRefererType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("referer_empno"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Referer.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableReferer, batch_Referer);
            log.info("batch_Referer : " + updateCounts);
        }



        // Type Local Temp Table 생성
        jdbc.execute(v_sql_createTableType.toString());

        // Type Local Temp Table에 insert
        List<Object[]> batch_Type = new ArrayList<Object[]>();
        if(!ViType.isEmpty() && ViType.size() > 0){
        log.info("-----> ViType : " + ViType.size());
            for(BasePriceAprlTypeType v_inRow : ViType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("net_price_type_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Type.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableType, batch_Type);
            log.info("batch_Type : " + updateCounts);
        }


        
        // Item Local Temp Table 생성
        jdbc.execute(v_sql_createTableItem.toString());

        // Item Local Temp Table에 insert
        List<Object[]> batch_Item = new ArrayList<Object[]>();
        if(!ViItem.isEmpty() && ViItem.size() > 0){
        log.info("-----> ViItem : " + ViItem.size());
            for(BasePriceAprlItemType v_inRow : ViItem){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("item_sequence"),
                    v_inRow.get("company_code"),
                    v_inRow.get("bizunit_code"),
                    v_inRow.get("management_mprice_code"),
                    v_inRow.get("base_year"),
                    v_inRow.get("apply_start_yyyymm"),
                    v_inRow.get("apply_end_yyyymm"),
                    v_inRow.get("bizdivision_code"),
                    v_inRow.get("plant_code"),
                    v_inRow.get("supply_plant_code"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("material_name"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("base_uom_code"),
                    v_inRow.get("buyer_empno"),
                    v_inRow.get("base_price"),
                    v_inRow.get("pcst"),
                    v_inRow.get("metal_net_price"),
                    v_inRow.get("coating_mat_net_price"),
                    v_inRow.get("fabric_net_price"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Item.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableItem, batch_Item);
            log.info("batch_Item : " + updateCounts);
        }


        // Dtl Local Temp Table 생성
        jdbc.execute(v_sql_createTableDtl.toString());

        //Dtl Local Temp Table에 insert
        List<Object[]> batch_Dtl = new ArrayList<Object[]>();
        if(!ViMetalDetailType.isEmpty() && ViMetalDetailType.size() > 0){
        log.info("-----> ViMetalDetailType : " + ViMetalDetailType.size());
            for(BasePriceAprlDtlType v_inRow : ViMetalDetailType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("item_sequence"),
                    v_inRow.get("metal_type_code"),
                    v_inRow.get("metal_net_price"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_Dtl.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableDtl, batch_Dtl);
            log.info("batch_Dtl  : " + updateCounts);
        }


        // Procedure output 담기
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        //프로시저 call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("NET_PRICE_TYPE_CODE", context.getInputData().getTypeCode());
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropable_master);
        jdbc.execute(v_sql_dropable_approver);
        jdbc.execute(v_sql_dropable_referer);
        jdbc.execute(v_sql_dropable_type);
        jdbc.execute(v_sql_dropable_item);
        jdbc.execute(v_sql_dropable_dtl);

        context.setResult(v_result);
        context.setCompleted();
        

        log.info("### SpViBasePriceAprlUpdateProc ### End ###");
    }

    /**
     * 품의서 삭세 프로시저 호출
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event=SpViBasePriceAprlDeleteProcContext.CDS_NAME)
    public void SpViBasePriceAprlDeleteProc(SpViBasePriceAprlDeleteProcContext context) {

        log.info("### SpViBasePriceAprlDeleteProc ### Start ###");

        Instant localNow = TimezoneUtil.getZonedNow().toInstant(); //로컬 시간


        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption      = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        String v_sql_dropable_master   = "DROP TABLE #LOCAL_TEMP_MATER";

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함        
        StringBuffer v_sql_createTableMaster = new StringBuffer();
        v_sql_createTableMaster.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MATER ");
        v_sql_createTableMaster.append("(");
        v_sql_createTableMaster.append("TENANT_ID             NVARCHAR(5),");
        v_sql_createTableMaster.append("APPROVAL_NUMBER       NVARCHAR(30),");        
        v_sql_createTableMaster.append("CHAIN_CODE            NVARCHAR(30),");
        v_sql_createTableMaster.append("APPROVAL_TYPE_CODE    NVARCHAR(30),");
        v_sql_createTableMaster.append("APPROVAL_TITLE        NVARCHAR(300),");
        v_sql_createTableMaster.append("APPROVAL_CONTENTS     NCLOB,");
        v_sql_createTableMaster.append("APPROVE_STATUS_CODE   NVARCHAR(30),");
        v_sql_createTableMaster.append("REQUESTOR_EMPNO       NVARCHAR(50),");
        v_sql_createTableMaster.append("REQUEST_DATE          NVARCHAR(8),");
        v_sql_createTableMaster.append("ATTCH_GROUP_NUMBER    NVARCHAR(100),");
        v_sql_createTableMaster.append("LOCAL_CREATE_DTM      SECONDDATE,");
        v_sql_createTableMaster.append("LOCAL_UPDATE_DTM      SECONDDATE,");
        v_sql_createTableMaster.append("CREATE_USER_ID        NVARCHAR(255),");
        v_sql_createTableMaster.append("UPDATE_USER_ID        NVARCHAR(255)");
        v_sql_createTableMaster.append(")");

        // local temp table insert queary 
        String v_sql_insertTableMaster = "INSERT INTO #LOCAL_TEMP_MATER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        // Procedures call queary
        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL SP_VI_BASE_PRICE_APRL_DELETE_PROC");        
        v_sql_callProc.append("(");
        v_sql_callProc.append("I_MASTER => #LOCAL_TEMP_MATER,");
        v_sql_callProc.append("O_MSG => ?");         
        v_sql_callProc.append(")");

        Collection<BasePriceAprlMstType> BasePriceAprlMst = context.getInputData().getBasePriceAprlMstType();
        OutputDataType v_result = OutputDataType.create();

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        ResultSet v_rs = null;
        
        // Master Local Temp Table 생성
        jdbc.execute(v_sql_createTableMaster.toString());

        // Master Local Temp Table에 insert
        List<Object[]> batch_master = new ArrayList<Object[]>();
        if(!BasePriceAprlMst.isEmpty() && BasePriceAprlMst.size() > 0){
        log.info("-----> BasePriceAprlMst : " + BasePriceAprlMst.size());
            for(BasePriceAprlMstType v_inRow : BasePriceAprlMst){
                v_inRow.setLocalCreateDtm(localNow);
                v_inRow.setLocalUpdateDtm(localNow);
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("approval_number"),
                    v_inRow.get("chain_code"),
                    v_inRow.get("approval_type_code"),
                    v_inRow.get("approval_title"),
                    v_inRow.get("approval_contents"),
                    v_inRow.get("approve_status_code"),
                    v_inRow.get("requestor_empno"),
                    v_inRow.get("request_date"),
                    v_inRow.get("attch_group_number"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id")
                };
                batch_master.add(values);
            }
            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTableMaster, batch_master);
            log.info("batch_master : " + updateCounts);
        }

        // Procedure output 담기
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        //프로시저 call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_dropable_master);

        context.setResult(v_result);
        context.setCompleted();
        

        log.info("### SpViBasePriceAprlDeleteProc ### End ###");
    }
}