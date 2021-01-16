package lg.sppCap.handlers.dp.vi;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

// Java Util
import java.time.ZonedDateTime;
import java.time.Instant;
import java.util.Collection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

// Log
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Java Sql
import java.sql.SQLException;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import com.sap.cds.services.request.UserInfo;

import lg.sppCap.frame.handler.BaseEventHandler;
import lg.sppCap.handlers.dp.vi.BasePriceArlValidationV4;
import lg.sppCap.util.TimezoneUtil;

import cds.gen.dp.basepricearlv4service.*;

@Component
@ServiceName(BasePriceArlV4Service_.CDS_NAME)
public class BasePriceArlServiceV4 extends BaseEventHandler {

    private static final Logger log = LoggerFactory.getLogger(BasePriceArlServiceV4.class);

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    UserInfo userInfo;

    @Autowired
    ParameterInfo parameterInfo;

    @Autowired
    BasePriceArlValidationV4 validator;

    @Transactional(rollbackFor = SQLException.class)
    @Before(event=DpViBasePriceArlProcContext.CDS_NAME)
    public void beforeBasePriceArlProcContext(DpViBasePriceArlProcContext context) {
        log.info("#### beforeBasePriceArlProcContext");

        String tenant_id = "L2100";
        String userID = (userInfo.getId() == null) ? "anonymous" : userInfo.getId();
        // ZonedDateTime localNow = TimezoneUtil.getZonedNow();
        Instant localNow = TimezoneUtil.getZonedNow().toInstant();

        String sql = "";

        Collection<BasePriceArlMstType> basePriceArlMasters = context.getInputData().getBasePriceArlMst();

        // // 입력값이 없을 경우, 에러 처리
        // if (basePriceArlMasters.isEmpty() || basePriceArlMasters.size() < 1) {
        //     // 메시지코드 정의 필요
        //     String msg = this.getMessage("EDP30001", context);
        //     throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        // }

        for (BasePriceArlMstType basePriceArlMaster : basePriceArlMasters) {
            basePriceArlMaster.setTenantId(tenant_id);
            basePriceArlMaster.setChainCode("DP");

            // Init Data Setting : approval_number
            String approval_number = "";
            
            if (basePriceArlMaster.getApprovalNumber() == null || basePriceArlMaster.getApprovalNumber().equals("")) {
                sql = "SELECT DP_APPROVAL_NUMBER_FUNC(?) FROM DUMMY";
                approval_number = jdbc.queryForObject(sql, new Object[] { tenant_id }, String.class);
                basePriceArlMaster.setApprovalNumber(approval_number);
            } else {
                approval_number = basePriceArlMaster.getApprovalNumber();
            }

            basePriceArlMaster.setLocalCreateDtm(localNow);
            basePriceArlMaster.setLocalUpdateDtm(localNow);
            basePriceArlMaster.setCreateUserId(userID);
            basePriceArlMaster.setUpdateUserId(userID);

            /** 
             * BasePriceArlApproverType
            */
            // Details가 없으면 종료
            if (basePriceArlMaster.getApprovers() == null) return;

            Collection<BasePriceArlApproverType> basePriceArlApprovers = basePriceArlMaster.getApprovers();

            for (BasePriceArlApproverType basePriceArlApprover : basePriceArlApprovers) {
                basePriceArlApprover.setTenantId(tenant_id);
                basePriceArlApprover.setApprovalNumber(approval_number);

                basePriceArlApprover.setLocalCreateDtm(localNow);
                basePriceArlApprover.setLocalUpdateDtm(localNow);
                basePriceArlApprover.setCreateUserId(userID);
                basePriceArlApprover.setUpdateUserId(userID);
            }

            /** 
             * BasePriceArlRefererType
            */
            Collection<BasePriceArlRefererType> basePriceArlReferers = basePriceArlMaster.getReferers();

            for (BasePriceArlRefererType basePriceArlReferer : basePriceArlReferers) {
                basePriceArlReferer.setTenantId(tenant_id);
                basePriceArlReferer.setApprovalNumber(approval_number);

                basePriceArlReferer.setLocalCreateDtm(localNow);
                basePriceArlReferer.setLocalUpdateDtm(localNow);
                basePriceArlReferer.setCreateUserId(userID);
                basePriceArlReferer.setUpdateUserId(userID);
            }

            /** 
             * BasePriceArlDetailType
            */
            // Details가 없으면 종료
            if (basePriceArlMaster.getDetails() == null) return;

            BigDecimal increament = new BigDecimal("1");

            Collection<BasePriceArlDtlType> basePriceArlDetails = basePriceArlMaster.getDetails();

            for (BasePriceArlDtlType basePriceArlDetail : basePriceArlDetails) {
                basePriceArlDetail.setTenantId(tenant_id);
                basePriceArlDetail.setApprovalNumber(approval_number);

                basePriceArlDetail.setLocalCreateDtm(localNow);
                basePriceArlDetail.setLocalUpdateDtm(localNow);
                basePriceArlDetail.setCreateUserId(userID);
                basePriceArlDetail.setUpdateUserId(userID);

                // Init Data Setting : item_sequence
                BigDecimal item_sequence = new BigDecimal(1);

                if (basePriceArlDetail.getItemSequence() == null) {
                    sql = "SELECT DP_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
                    item_sequence = jdbc.queryForObject(sql, new Object[] { tenant_id, approval_number, increament }, BigDecimal.class);
                    basePriceArlDetail.setItemSequence(item_sequence);
                    increament = increament.add(new BigDecimal("1"));
                } else {
                    item_sequence = basePriceArlDetail.getItemSequence();
                }

                /** 
                 * BasePriceArlDetailType
                */
                // Prices가 없으면 종료
                if (basePriceArlDetail.getPrices() == null) return;

                Collection<BasePriceArlPriceType> basePriceArlPrices = basePriceArlDetail.getPrices();

                for (BasePriceArlPriceType basePriceArlPrice : basePriceArlPrices) {
                    basePriceArlPrice.setTenantId(tenant_id);
                    basePriceArlPrice.setApprovalNumber(approval_number);
                    basePriceArlPrice.setItemSequence(item_sequence);

                    basePriceArlPrice.setLocalCreateDtm(localNow);
                    basePriceArlPrice.setLocalUpdateDtm(localNow);
                    basePriceArlPrice.setCreateUserId(userID);
                    basePriceArlPrice.setUpdateUserId(userID);
                }
            }
        }
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=DpViBasePriceArlProcContext.CDS_NAME)
    public void onBasePriceArlProcContext(DpViBasePriceArlProcContext context) {
        log.info("#### onBasePriceArlProcContext");

        validator.validationBasePriceArlMaster(context, context.getInputData().getBasePriceArlMst());

        // DDL 실행시 auto-commit OFF 설정
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        jdbc.execute(v_sql_commitOption);

        this.makeTable();
        this.destoryTable();

        // return 처리
        OutputDataType v_result = OutputDataType.create();

        v_result.setReturnCode("200");
        v_result.setReturnMsg("Success!");
        v_result.setReturnRs(context.getInputData().getBasePriceArlMst());

        context.setResult(v_result);
        context.setCompleted();
    }

    @Transactional(rollbackFor = SQLException.class)
    private void makeTable() {
        log.info("## makeTable Method Started....");

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함  
        // 1. BasePriceArlMstType 관련 테이블    
        StringBuffer v_sql_createTable_BasePriceArlMaster = new StringBuffer();
        v_sql_createTable_BasePriceArlMaster.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MASTER (");
        v_sql_createTable_BasePriceArlMaster.append("  TENANT_ID                NVARCHAR(5),");
        v_sql_createTable_BasePriceArlMaster.append("  APPROVAL_NUMBER          NVARCHAR(30),");
        v_sql_createTable_BasePriceArlMaster.append("  CHAIN_CODE               NVARCHAR(30),");
        v_sql_createTable_BasePriceArlMaster.append("  APPROVAL_TYPE_CODE       NVARCHAR(30),");
        v_sql_createTable_BasePriceArlMaster.append("  APPROVAL_TITLE           NVARCHAR(300),");
        v_sql_createTable_BasePriceArlMaster.append("  APPROVAL_CONTENTS        NCLOB,");
        v_sql_createTable_BasePriceArlMaster.append("  APPROVE_STATUS_CODE      NVARCHAR(30),");
        v_sql_createTable_BasePriceArlMaster.append("  REQUESTOR_EMPNO          NVARCHAR(30),");
        v_sql_createTable_BasePriceArlMaster.append("  REQUEST_DATE             NVARCHAR(8),");
        v_sql_createTable_BasePriceArlMaster.append("  ATTCH_GROUP_NUMBER       NVARCHAR(100),");
        v_sql_createTable_BasePriceArlMaster.append("  LOCAL_CREATE_DTM         SECONDDATE,");
        v_sql_createTable_BasePriceArlMaster.append("  LOCAL_UPDATE_DTM         SECONDDATE,");
        v_sql_createTable_BasePriceArlMaster.append("  CREATE_USER_ID           NVARCHAR(255),");
        v_sql_createTable_BasePriceArlMaster.append("  UPDATE_USER_ID           NVARCHAR(255)");
        v_sql_createTable_BasePriceArlMaster.append(")");
        jdbc.execute(v_sql_createTable_BasePriceArlMaster.toString());

        // 2. BasePriceArlApproverType 관련 테이블    
        StringBuffer v_sql_createTable_BasePriceArlApprover = new StringBuffer();
        v_sql_createTable_BasePriceArlApprover.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_APPROVER (");
        v_sql_createTable_BasePriceArlApprover.append("  TENANT_ID              NVARCHAR(5),");
        v_sql_createTable_BasePriceArlApprover.append("  APPROVAL_NUMBER        NVARCHAR(10),");
        v_sql_createTable_BasePriceArlApprover.append("  APPROVE_SEQUENCE       NVARCHAR(30),");
        v_sql_createTable_BasePriceArlApprover.append("  APPROVER_EMPNO         NVARCHAR(30),");
        v_sql_createTable_BasePriceArlApprover.append("  APPROVER_TYPE_CODE     NVARCHAR(30),");
        v_sql_createTable_BasePriceArlApprover.append("  APPROVE_STATUS_CODE    NVARCHAR(30),");
        v_sql_createTable_BasePriceArlApprover.append("  LOCAL_CREATE_DTM       SECONDDATE,");
        v_sql_createTable_BasePriceArlApprover.append("  LOCAL_UPDATE_DTM       SECONDDATE,");
        v_sql_createTable_BasePriceArlApprover.append("  CREATE_USER_ID         NVARCHAR(255),");
        v_sql_createTable_BasePriceArlApprover.append("  UPDATE_USER_ID         NVARCHAR(255)");
        v_sql_createTable_BasePriceArlApprover.append(")");
        jdbc.execute(v_sql_createTable_BasePriceArlApprover.toString());

        // 3. BasePriceArlRefererType 관련 테이블    
        StringBuffer v_sql_createTable_BasePriceArlReferer = new StringBuffer();
        v_sql_createTable_BasePriceArlReferer.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_REFERER (");
        v_sql_createTable_BasePriceArlReferer.append("  TENANT_ID               NVARCHAR(5),");
        v_sql_createTable_BasePriceArlReferer.append("  APPROVAL_NUMBER         NVARCHAR(30),");
        v_sql_createTable_BasePriceArlReferer.append("  REFERER_EMPNO           NVARCHAR(30),");
        v_sql_createTable_BasePriceArlReferer.append("  LOCAL_CREATE_DTM        SECONDDATE,");
        v_sql_createTable_BasePriceArlReferer.append("  LOCAL_UPDATE_DTM        SECONDDATE,");
        v_sql_createTable_BasePriceArlReferer.append("  CREATE_USER_ID          NVARCHAR(255),");
        v_sql_createTable_BasePriceArlReferer.append("  UPDATE_USER_ID          NVARCHAR(255)");
        v_sql_createTable_BasePriceArlReferer.append(")");
        jdbc.execute(v_sql_createTable_BasePriceArlReferer.toString());

        // 4. BasePriceArlDtlType 관련 테이블    
        StringBuffer v_sql_createTable_BasePriceArlDetail = new StringBuffer();
        v_sql_createTable_BasePriceArlDetail.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_DETAIL (");
        v_sql_createTable_BasePriceArlDetail.append("  TENANT_ID               NVARCHAR(5),");
        v_sql_createTable_BasePriceArlDetail.append("  APPROVAL_NUMBER         NVARCHAR(30),");
        v_sql_createTable_BasePriceArlDetail.append("  ITEM_SEQUENCE           DECIMAL(34),");
        v_sql_createTable_BasePriceArlDetail.append("  COMPANY_CODE            NVARCHAR(10),");
        v_sql_createTable_BasePriceArlDetail.append("  ORG_TYPE_CODE           NVARCHAR(2),");
        v_sql_createTable_BasePriceArlDetail.append("  ORG_CODE                NVARCHAR(10),");
        v_sql_createTable_BasePriceArlDetail.append("  AU_CODE                 NVARCHAR(10),");
        v_sql_createTable_BasePriceArlDetail.append("  MATERIAL_CODE           NVARCHAR(40),");
        v_sql_createTable_BasePriceArlDetail.append("  SUPPLIER_CODE           NVARCHAR(10),");
        v_sql_createTable_BasePriceArlDetail.append("  BASE_DATE               DATE,");
        v_sql_createTable_BasePriceArlDetail.append("  BASE_PRICE_GROUND_CODE  NVARCHAR(30),");
        v_sql_createTable_BasePriceArlDetail.append("  LOCAL_CREATE_DTM        SECONDDATE,");
        v_sql_createTable_BasePriceArlDetail.append("  LOCAL_UPDATE_DTM        SECONDDATE,");
        v_sql_createTable_BasePriceArlDetail.append("  CREATE_USER_ID          NVARCHAR(255),");
        v_sql_createTable_BasePriceArlDetail.append("  UPDATE_USER_ID          NVARCHAR(255)");
        v_sql_createTable_BasePriceArlDetail.append(")");
        jdbc.execute(v_sql_createTable_BasePriceArlDetail.toString());

        // 5. BasePriceArlPriceType 관련 테이블    
        StringBuffer v_sql_createTable_BasePriceArlPrice = new StringBuffer();
        v_sql_createTable_BasePriceArlPrice.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PRICE (");
        v_sql_createTable_BasePriceArlPrice.append("  TENANT_ID                         NVARCHAR(5),");
        v_sql_createTable_BasePriceArlPrice.append("  APPROVAL_NUMBER                   NVARCHAR(30),");
        v_sql_createTable_BasePriceArlPrice.append("  ITEM_SEQUENCE                     DECIMAL(34),");
        v_sql_createTable_BasePriceArlPrice.append("  MARKET_CODE                       NVARCHAR(30),");
        v_sql_createTable_BasePriceArlPrice.append("  NEW_BASE_PRICE                    DECIMAL(19,4),");
        v_sql_createTable_BasePriceArlPrice.append("  NEW_BASE_PRICE_CURRENCY_CODE      NVARCHAR(3),");
        v_sql_createTable_BasePriceArlPrice.append("  CURRENT_BASE_PRICE                DECIMAL(19,4),");
        v_sql_createTable_BasePriceArlPrice.append("  CURRENT_BASE_PRICE_CURRENCY_CODE  NVARCHAR(3),");
        v_sql_createTable_BasePriceArlPrice.append("  FIRST_PURCHASING_NET_PRICE        DECIMAL(19,4),");
        v_sql_createTable_BasePriceArlPrice.append("  FIRST_PUR_NETPRICE_CURR_CD        NVARCHAR(3),");
        v_sql_createTable_BasePriceArlPrice.append("  FIRST_PUR_NETPRICE_STR_DT         DATE,");
        v_sql_createTable_BasePriceArlPrice.append("  LOCAL_CREATE_DTM                  SECONDDATE,");
        v_sql_createTable_BasePriceArlPrice.append("  LOCAL_UPDATE_DTM                  SECONDDATE,");
        v_sql_createTable_BasePriceArlPrice.append("  CREATE_USER_ID                    NVARCHAR(255),");
        v_sql_createTable_BasePriceArlPrice.append("  UPDATE_USER_ID                    NVARCHAR(255)");
        v_sql_createTable_BasePriceArlPrice.append(")");
        jdbc.execute(v_sql_createTable_BasePriceArlPrice.toString());
    }

    @Transactional(rollbackFor = SQLException.class)
    private void destoryTable() {
        log.info("## destoryTable Method Started....");

        // 1. BasePriceArlMstType 관련 테이블
        String v_sql_dropTable_BasePriceArlMaster = "DROP TABLE #LOCAL_TEMP_MASTER";
        jdbc.execute(v_sql_dropTable_BasePriceArlMaster);

        // 2. BasePriceArlApproverType 관련 테이블
        String v_sql_dropTable_BasePriceArlApprover = "DROP TABLE #LOCAL_TEMP_APPROVER";
        jdbc.execute(v_sql_dropTable_BasePriceArlApprover);

        // 3. BasePriceArlRefererType 관련 테이블
        String v_sql_dropTable_BasePriceArlReferer = "DROP TABLE #LOCAL_TEMP_REFERER";
        jdbc.execute(v_sql_dropTable_BasePriceArlReferer);

        // 4. BasePriceArlDtlType 관련 테이블
        String v_sql_dropTable_BasePriceArlDetail = "DROP TABLE #LOCAL_TEMP_DETAIL";
        jdbc.execute(v_sql_dropTable_BasePriceArlDetail);

        // 5. BasePriceArlPriceType 관련 테이블
        String v_sql_dropTable_BasePriceArlPrice = "DROP TABLE #LOCAL_TEMP_PRICE";
        jdbc.execute(v_sql_dropTable_BasePriceArlPrice);
    }

}