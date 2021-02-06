package lg.sppCap.handlers.dp.vi;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Connection;
import java.sql.CallableStatement;
import java.sql.ResultSet;

// Java Util
// import java.time.ZonedDateTime;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

import org.apache.http.util.TextUtils;

// Log
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// Java Sql
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

// import com.sap.cds.services.cds.CdsService;
// import com.sap.cds.services.EventContext;
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

        // Cmd Validation
        String cmdString = context.getInputData().getCmd().toLowerCase();

        if (!cmdString.equals("insert") && !cmdString.equals("upsert") && !cmdString.equals("delete")) {
                String msg = super.getLanguageCode(context).equals("KO") ? "처리할 수 없는 요청입니다.\n[insert], [upsert], [delete]  명령어만 사용할 수 있습니다."
                                                                         : "This request cannot be processed.\nOnly commands [insert], [upsert], and [delete] can be used.";
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        String userID = (userInfo.getId() == null) ? "anonymous" : userInfo.getId();
        // ZonedDateTime localNow = TimezoneUtil.getZonedNow();
        Instant localNow = TimezoneUtil.getZonedNow().toInstant();

        String sql = "";

        Collection<BasePriceArlMstType> basePriceArlMasters = context.getInputData().getBasePriceArlMst();

        // // [Reference] If no input, error processing
        // if (basePriceArlMasters.isEmpty() || basePriceArlMasters.size() < 1) {
        //     String msg = super.getLanguageCode(context).equals("KO") ? "입력 값 형식이 올바르지 않습니다." : "The input value format is invalid.";
        //     throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        // }

        for (BasePriceArlMstType basePriceArlMaster : basePriceArlMasters) {
            // default value settings
            String tenant_id =  basePriceArlMaster.getTenantId();
            tenant_id = (tenant_id == null || tenant_id.equals("")) ? "L2100" : tenant_id;

            basePriceArlMaster.setTenantId(tenant_id);
            basePriceArlMaster.setChainCode("DP");

            // approval_number value settings
            String approval_number = "";
            
            if (basePriceArlMaster.getApprovalNumber() == null || basePriceArlMaster.getApprovalNumber().equals("")) {
                sql = "SELECT DP_VI_APPROVAL_NUMBER_FUNC(?) FROM DUMMY";
                approval_number = jdbc.queryForObject(sql, new Object[] { tenant_id }, String.class);
                basePriceArlMaster.setApprovalNumber(approval_number);
            } else {
                approval_number = basePriceArlMaster.getApprovalNumber();
            }

            // delete 요청이 아니면서 승인요청시(AR) 요청일자 설정
            if (!cmdString.equals("delete") && basePriceArlMaster.getApproveStatusCode().equals("AR")) {
                DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
                Date toDay = Date.from(localNow);
                // System.out.println("RequestDate : " + dateFormat.format(toDay));
                basePriceArlMaster.setRequestDate(dateFormat.format(toDay));
            }

            basePriceArlMaster.setLocalCreateDtm(localNow);
            basePriceArlMaster.setLocalUpdateDtm(localNow);
            basePriceArlMaster.setCreateUserId(userID);
            basePriceArlMaster.setUpdateUserId(userID);

            /** 
             * BasePriceArlApproverType
            */
            if (basePriceArlMaster.getApprovers() == null) {
                Collection<BasePriceArlApproverType> basePriceArlApprovers = new ArrayList<>();
                basePriceArlMaster.setApprovers(basePriceArlApprovers);

                // if null value, error handling
            } else {
                Collection<BasePriceArlApproverType> basePriceArlApprovers = basePriceArlMaster.getApprovers();

                for (BasePriceArlApproverType basePriceArlApprover : basePriceArlApprovers) {
                    // default value settings
                    basePriceArlApprover.setTenantId(tenant_id);
                    basePriceArlApprover.setApprovalNumber(approval_number);

                    basePriceArlApprover.setLocalCreateDtm(localNow);
                    basePriceArlApprover.setLocalUpdateDtm(localNow);
                    basePriceArlApprover.setCreateUserId(userID);
                    basePriceArlApprover.setUpdateUserId(userID);
                }
            }

            /** 
             * BasePriceArlRefererType
            */
            if (basePriceArlMaster.getReferers() == null) {
                Collection<BasePriceArlRefererType> basePriceArlReferers = new ArrayList<>();
                basePriceArlMaster.setReferers(basePriceArlReferers);

                // if null value, error handling
            } else {
                Collection<BasePriceArlRefererType> basePriceArlReferers = basePriceArlMaster.getReferers();

                for (BasePriceArlRefererType basePriceArlReferer : basePriceArlReferers) {
                    // default value settings
                    basePriceArlReferer.setTenantId(tenant_id);
                    basePriceArlReferer.setApprovalNumber(approval_number);

                    basePriceArlReferer.setLocalCreateDtm(localNow);
                    basePriceArlReferer.setLocalUpdateDtm(localNow);
                    basePriceArlReferer.setCreateUserId(userID);
                    basePriceArlReferer.setUpdateUserId(userID);
                }                
            }

            /** 
             * BasePriceArlDetailType
            */
            if (basePriceArlMaster.getDetails() == null) {
                Collection<BasePriceArlDtlType> basePriceArlDetails = new ArrayList<>();
                basePriceArlMaster.setDetails(basePriceArlDetails);

                // if null value, error handling
            } else {
                BigDecimal increament = new BigDecimal("1");

                Collection<BasePriceArlDtlType> basePriceArlDetails = basePriceArlMaster.getDetails();

                for (BasePriceArlDtlType basePriceArlDetail : basePriceArlDetails) {
                    // default value settings
                    basePriceArlDetail.setTenantId(tenant_id);
                    basePriceArlDetail.setApprovalNumber(approval_number);

                    basePriceArlDetail.setLocalCreateDtm(localNow);
                    basePriceArlDetail.setLocalUpdateDtm(localNow);
                    basePriceArlDetail.setCreateUserId(userID);
                    basePriceArlDetail.setUpdateUserId(userID);

                    // item_sequence value settings
                    BigDecimal item_sequence = new BigDecimal(1);

                    if (basePriceArlDetail.getItemSequence() == null) {
                        sql = "SELECT DP_VI_ITEM_SEQUENCE_FUNC(?, ?, ?) FROM DUMMY";
                        item_sequence = jdbc.queryForObject(sql, new Object[] { tenant_id, approval_number, increament }, BigDecimal.class);
                        basePriceArlDetail.setItemSequence(item_sequence);
                        increament = increament.add(new BigDecimal("1"));
                    } else {
                        item_sequence = basePriceArlDetail.getItemSequence();
                    }

                    // Null if blank characters
                    if (TextUtils.isEmpty(basePriceArlDetail.getChangeReasonCode())) basePriceArlDetail.setChangeReasonCode(null);
                    if (TextUtils.isEmpty(basePriceArlDetail.getReprMaterialCode())) basePriceArlDetail.setReprMaterialCode(null);
                    if (TextUtils.isEmpty(basePriceArlDetail.getReprMaterialSupplierCode())) basePriceArlDetail.setReprMaterialSupplierCode(null);
                    if (TextUtils.isEmpty(basePriceArlDetail.getReprMaterialOrgCode())) basePriceArlDetail.setReprMaterialOrgCode(null);

                    /** 
                     * BasePriceArlPriceType
                    */
                    if (basePriceArlDetail.getPrices() == null) {
                        Collection<BasePriceArlPriceType> basePriceArlPrices = new ArrayList<>();
                        basePriceArlDetail.setPrices(basePriceArlPrices);

                        // if null value, error handling
                    } else {
                        Collection<BasePriceArlPriceType> basePriceArlPrices = basePriceArlDetail.getPrices();

                        for (BasePriceArlPriceType basePriceArlPrice : basePriceArlPrices) {
                            // default value settings
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
        }
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=DpViBasePriceArlProcContext.CDS_NAME)
    public void onBasePriceArlProcContext(DpViBasePriceArlProcContext context) {
        log.info("#### onBasePriceArlProcContext");

        Boolean isDebug = (context.getInputData().getDebug() == null) ? false : context.getInputData().getDebug();
        validator.validationBasePriceArlMaster(context, context.getInputData().getBasePriceArlMst(), isDebug);

        // Sql Paragraph Display Flag
        boolean isDisplaySql = false;

        // DDL 실행시 auto-commit OFF 설정
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        jdbc.execute(v_sql_commitOption);

        // 01. Tempory Table Create
        this.makeTable("approval", isDisplaySql);

        // 02. Tempory Data Insert
        Collection<BasePriceArlMstType> basePriceArlMasters = context.getInputData().getBasePriceArlMst();
        this.createTempData(basePriceArlMasters, isDisplaySql);

        // 03. execute stored-procedure by cmd parameter
        String cmdString = context.getInputData().getCmd().toLowerCase();

        Map<String, Object> resultMap = null;

        switch (cmdString) {
            case "insert" :
                // System.out.println("insert");
                resultMap = this.insertProcedure(context, isDisplaySql);
                break;
            case "upsert" :
                // System.out.println("upsert");
                resultMap = this.upsertProcedure(context, isDisplaySql);
                break;
            case "delete" :
                // System.out.println("delete");
                resultMap = this.deleteProcedure(context, isDisplaySql);
                break;
            default :
                String msg = super.getLanguageCode(context).equals("KO") ? "처리할 수 없는 요청입니다.\n[insert], [upsert], [delete]  명령어만 사용할 수 있습니다."
                                                                         : "This request cannot be processed.\nOnly commands [insert], [upsert], and [delete] can be used.";
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        // 04. Tempory Table Drop
        this.destoryTable("approval", isDisplaySql);

        // 05. Return Value : Processing
        for (String key : resultMap.keySet()) { 
            System.out.println("key : " + key + " / value : " + resultMap.get(key).toString()); 
        }

        ArrayList<OutputDataType> returnDBParam = (ArrayList)resultMap.get("O_TABLE");
        OutputDataType returnDBValue = (OutputDataType)returnDBParam.get(0);
        String returnCode = returnDBValue.getReturnCode();
        String returnMsg = returnDBValue.getReturnMsg();
        String returnParam = returnDBValue.getReturnParam();
        // System.out.println("Return Code : " + returnCode + " / Return Message : " + returnMsg + " / Return Param : " + returnParam);

        switch (returnCode) {
            case "200" :
                System.out.println(cmdString + " Success");
                break;
            case "500" :
                System.out.println("중복키 오류");
                break;
            case "510" :
                System.out.println("해당 데이터 없슴");
                break;
            default :
                System.out.println("알 수 없는 오류 발생");
                break;
        }

        // 06. Return Value : Regist
        OutputDataType v_result = OutputDataType.create();

        v_result.setReturnCode(returnCode);

        switch (cmdString) {
            case "insert" :
                // v_result.setReturnCode("200");
                v_result.setReturnMsg("Insert Success!");
                v_result.setReturnRs(context.getInputData().getBasePriceArlMst());
                break;
            case "upsert" :
                // v_result.setReturnCode("200");
                v_result.setReturnMsg("Upsert Success!");
                v_result.setReturnRs(context.getInputData().getBasePriceArlMst());
                break;
            case "delete" :
                // v_result.setReturnCode("200");
                v_result.setReturnMsg("Delete Success!");
                Collection<BasePriceArlMstType> basePriceArlMstType = new ArrayList<>();
                v_result.setReturnRs(basePriceArlMstType);
                break;
            default :
                String msg = super.getLanguageCode(context).equals("KO") ? "처리할 수 없는 요청입니다.\n[insert], [upsert], [delete]  명령어만 사용할 수 있습니다."
                                                                         : "This request cannot be processed.\nOnly commands [insert], [upsert], and [delete] can be used.";
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        context.setResult(v_result);
        context.setCompleted();
    }

    @Transactional(rollbackFor = SQLException.class)
    @Before(event=DpViBasePriceChangeRequestorProcContext.CDS_NAME)
    public void beforeBasePriceChangeRequestorProcContext(DpViBasePriceChangeRequestorProcContext context) {
        log.info("#### beforeBasePriceChangeRequestorProcContext");

        // Cmd Validation
        String cmdString = context.getInputData().getCmd().toLowerCase();

        if (!cmdString.equals("upsert")) {
                String msg = super.getLanguageCode(context).equals("KO") ? "처리할 수 없는 요청입니다.\n[upsert]  명령어만 사용할 수 있습니다."
                                                                         : "This request cannot be processed.\nOnly commands [upsert] can be used.";
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        String userID = (userInfo.getId() == null) ? "anonymous" : userInfo.getId();
        // ZonedDateTime localNow = TimezoneUtil.getZonedNow();
        Instant localNow = TimezoneUtil.getZonedNow().toInstant();

        String sql = "";

        Collection<BasePriceArlChangeRequestorType> basePriceArlChangeRequestors = context.getInputData().getBasePriceArlChangeRequestor();


        for (BasePriceArlChangeRequestorType basePriceArlChangeRequestor : basePriceArlChangeRequestors) {
            basePriceArlChangeRequestor.setLocalCreateDtm(localNow);
            basePriceArlChangeRequestor.setLocalUpdateDtm(localNow);
            basePriceArlChangeRequestor.setCreateUserId(userID);
            basePriceArlChangeRequestor.setUpdateUserId(userID);
        }
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event=DpViBasePriceChangeRequestorProcContext.CDS_NAME)
    public void oneBasePriceChangeRequestorProcContext(DpViBasePriceChangeRequestorProcContext context) {
        log.info("#### oneBasePriceChangeRequestorProcContext");

        Boolean isDebug = (context.getInputData().getDebug() == null) ? false : context.getInputData().getDebug();
        validator.validationBasePriceArlChangeRequestor(context, context.getInputData().getBasePriceArlChangeRequestor(), isDebug);

        // Sql Paragraph Display Flag
        boolean isDisplaySql = false;

        // DDL 실행시 auto-commit OFF 설정
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        jdbc.execute(v_sql_commitOption);

        // 01. Tempory Table Create
        this.makeTable("change", isDisplaySql);

        // 02. Tempory Data Insert
        Collection<BasePriceArlChangeRequestorType> basePriceArlChangeRequestors = context.getInputData().getBasePriceArlChangeRequestor();
        this.createTempChangeData(basePriceArlChangeRequestors, isDisplaySql);

        // 03. execute stored-procedure by cmd parameter
        String cmdString = context.getInputData().getCmd().toLowerCase();

        Map<String, Object> resultMap = null;

        switch (cmdString) {
            case "upsert" :
                System.out.println("upsert");
                resultMap = this.upsertRequestorProcedure(context, isDisplaySql);
                break;
            default :
                String msg = super.getLanguageCode(context).equals("KO") ? "처리할 수 없는 요청입니다.\n[upsert] 명령어만 사용할 수 있습니다."
                                                                         : "This request cannot be processed.\nOnly commands [upsert] can be used.";
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        // 04. Tempory Table Drop
        this.destoryTable("change", isDisplaySql);

        // 05. Return Value : Processing
        // for (String key : resultMap.keySet()) { 
        //     System.out.println("key : " + key + " / value : " + resultMap.get(key).toString()); 
        // }

        ArrayList<OutputDataType> returnDBParam = (ArrayList)resultMap.get("O_TABLE");
        OutputDataType returnDBValue = (OutputDataType)returnDBParam.get(0);
        String returnCode = returnDBValue.getReturnCode();
        String returnMsg = returnDBValue.getReturnMsg();
        String returnParam = returnDBValue.getReturnParam();
        // System.out.println("Return Code : " + returnCode + " / Return Message : " + returnMsg + " / Return Param : " + returnParam);

        switch (returnCode) {
            case "200" :
                System.out.println(cmdString + " Success");
                break;
            case "500" :
                System.out.println("중복키 오류");
                break;
            case "510" :
                System.out.println("해당 데이터 없슴");
                break;
            default :
                System.out.println("알 수 없는 오류 발생");
                break;
        }

        // 06. Return Value : Regist
        OutputDataChangeRequestorType v_result = OutputDataChangeRequestorType.create();

        v_result.setReturnCode("200");

        switch (cmdString) {
            case "upsert" :
                v_result.setReturnMsg("Upsert Success!");
                v_result.setReturnRs(context.getInputData().getBasePriceArlChangeRequestor());
                break;
            default :
                String msg = super.getLanguageCode(context).equals("KO") ? "처리할 수 없는 요청입니다.\n[upsert] 명령어만 사용할 수 있습니다."
                                                                         : "This request cannot be processed.\nOnly commands [upsert] can be used.";
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        }

        context.setResult(v_result);
        context.setCompleted();
    }

    /**
     * Temporary Table Create
     * @param isDisplaySql
     */
    @Transactional(rollbackFor = SQLException.class)
    private void makeTable(String procName, boolean isDisplaySql) {
        log.info("## makeTable Method Started....");

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함  
        if (procName.equals("approval")) {
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
            v_sql_createTable_BasePriceArlApprover.append("  APPROVAL_NUMBER        NVARCHAR(30),");
            v_sql_createTable_BasePriceArlApprover.append("  APPROVE_SEQUENCE       NVARCHAR(10),");
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
            v_sql_createTable_BasePriceArlDetail.append("  TENANT_ID                    NVARCHAR(5),");
            v_sql_createTable_BasePriceArlDetail.append("  APPROVAL_NUMBER              NVARCHAR(30),");
            v_sql_createTable_BasePriceArlDetail.append("  ITEM_SEQUENCE                DECIMAL(34),");
            v_sql_createTable_BasePriceArlDetail.append("  COMPANY_CODE                 NVARCHAR(10),");
            v_sql_createTable_BasePriceArlDetail.append("  ORG_TYPE_CODE                NVARCHAR(2),");
            v_sql_createTable_BasePriceArlDetail.append("  ORG_CODE                     NVARCHAR(10),");
            v_sql_createTable_BasePriceArlDetail.append("  MATERIAL_CODE                NVARCHAR(40),");
            v_sql_createTable_BasePriceArlDetail.append("  BASE_UOM_CODE                NVARCHAR(3),");
            v_sql_createTable_BasePriceArlDetail.append("  SUPPLIER_CODE                NVARCHAR(10),");
            v_sql_createTable_BasePriceArlDetail.append("  BASE_DATE                    DATE,");
            v_sql_createTable_BasePriceArlDetail.append("  BASE_PRICE_GROUND_CODE       NVARCHAR(30),");
            v_sql_createTable_BasePriceArlDetail.append("  CHANGE_REASON_CODE           NVARCHAR(30),");
            v_sql_createTable_BasePriceArlDetail.append("  REPR_MATERIAL_CODE           NVARCHAR(40),");
            v_sql_createTable_BasePriceArlDetail.append("  REPR_MATERIAL_SUPPLIER_CODE  NVARCHAR(10),");
            v_sql_createTable_BasePriceArlDetail.append("  REPR_MATERIAL_ORG_CODE       NVARCHAR(10),");
            v_sql_createTable_BasePriceArlDetail.append("  LOCAL_CREATE_DTM             SECONDDATE,");
            v_sql_createTable_BasePriceArlDetail.append("  LOCAL_UPDATE_DTM             SECONDDATE,");
            v_sql_createTable_BasePriceArlDetail.append("  CREATE_USER_ID               NVARCHAR(255),");
            v_sql_createTable_BasePriceArlDetail.append("  UPDATE_USER_ID               NVARCHAR(255)");
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

            if (isDisplaySql) {
                System.out.println(v_sql_createTable_BasePriceArlMaster + ";");
                System.out.println(v_sql_createTable_BasePriceArlApprover + ";");
                System.out.println(v_sql_createTable_BasePriceArlReferer + ";");
                System.out.println(v_sql_createTable_BasePriceArlDetail + ";");
                System.out.println(v_sql_createTable_BasePriceArlPrice + ";");
            }
        } else if (procName.equals("change")) {
            // 1. BasePriceArlPriceChangeRequestor 관련 테이블    
            StringBuffer v_sql_createTable_BasePriceArlChangeRequestor = new StringBuffer();
            v_sql_createTable_BasePriceArlChangeRequestor.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_CHANGE_REQUESTOR (");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  TENANT_ID                         NVARCHAR(5),");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  APPROVAL_NUMBER                   NVARCHAR(30),");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  CHANGER_EMPNO                     NVARCHAR(30),");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  CREATOR_EMPNO                     NVARCHAR(30),");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  LOCAL_CREATE_DTM                  SECONDDATE,");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  LOCAL_UPDATE_DTM                  SECONDDATE,");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  CREATE_USER_ID                    NVARCHAR(255),");
            v_sql_createTable_BasePriceArlChangeRequestor.append("  UPDATE_USER_ID                    NVARCHAR(255)");
            v_sql_createTable_BasePriceArlChangeRequestor.append(")");
            jdbc.execute(v_sql_createTable_BasePriceArlChangeRequestor.toString());

            if (isDisplaySql) {
                System.out.println(v_sql_createTable_BasePriceArlChangeRequestor + ";");
            }       
        }

    }

    /**
     * Temp Data Create
     * @param basePriceArlMasters
     * @param isDisplaySql
     */
    @Transactional(rollbackFor = SQLException.class)
    private void createTempData(Collection<BasePriceArlMstType> basePriceArlMasters, boolean isDisplaySql) {
        log.info("## createTempData Method Started....");

        String v_sql_batchInsert = "";

        String v_sql_insert_BasePriceArlMaster   = "INSERT INTO #LOCAL_TEMP_MASTER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insert_BasePriceArlApprover = "INSERT INTO #LOCAL_TEMP_APPROVER VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insert_BasePriceArlReferer  = "INSERT INTO #LOCAL_TEMP_REFERER VALUES (?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insert_BasePriceArlDetail   = "INSERT INTO #LOCAL_TEMP_DETAIL VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insert_BasePriceArlPrice    = "INSERT INTO #LOCAL_TEMP_PRICE VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        List<Object[]> v_batchInsert_BasePriceArlMaster   = new ArrayList<Object[]>();
        List<Object[]> v_batchInsert_BasePriceArlApprover = new ArrayList<Object[]>();
        List<Object[]> v_batchInsert_BasePriceArlReferer  = new ArrayList<Object[]>();
        List<Object[]> v_batchInsert_BasePriceArlDetail   = new ArrayList<Object[]>();
        List<Object[]> v_batchInsert_BasePriceArlPrice    = new ArrayList<Object[]>();

        // Creating a temporary dataset : #LOCAL_TEMP_MASTER
        for (BasePriceArlMstType basePriceArlMaster : basePriceArlMasters) {
            // System.out.println("# tenant_id : " + basePriceArlMaster.getTenantId()); // Loop Data Check

            Object[] objMaster = new Object[] {
                basePriceArlMaster.get("tenant_id"),
                basePriceArlMaster.get("approval_number"),
                basePriceArlMaster.get("chain_code"),
                basePriceArlMaster.get("approval_type_code"),
                basePriceArlMaster.get("approval_title"),
                basePriceArlMaster.get("approval_contents"),
                basePriceArlMaster.get("approve_status_code"),
                basePriceArlMaster.get("requestor_empno"),
                basePriceArlMaster.get("request_date"),
                basePriceArlMaster.get("attch_group_number"),
                basePriceArlMaster.get("local_create_dtm"),
                basePriceArlMaster.get("local_update_dtm"),
                basePriceArlMaster.get("create_user_id"),
                basePriceArlMaster.get("update_user_id")
            };
            v_batchInsert_BasePriceArlMaster.add(objMaster);

            v_sql_batchInsert = v_sql_batchInsert + "INSERT INTO #LOCAL_TEMP_MASTER VALUES (" + Arrays.toString(objMaster) + ");\n";

            /** 
             * BasePriceArlApproverType
            */
            if (basePriceArlMaster.getApprovers() != null) {
                Collection<BasePriceArlApproverType> basePriceArlApprovers = basePriceArlMaster.getApprovers();

                // Creating a temporary dataset : #LOCAL_TEMP_APPROVER
                for (BasePriceArlApproverType basePriceArlApprover : basePriceArlApprovers) {
                    // System.out.println("\t# approver_empno : " + basePriceArlApprover.getApproverEmpno()); // Loop Data Check

                    Object[] objApprover = new Object[] {
                        basePriceArlApprover.get("tenant_id"),
                        basePriceArlApprover.get("approval_number"),
                        basePriceArlApprover.get("approve_sequence"),
                        basePriceArlApprover.get("approver_empno"),
                        basePriceArlApprover.get("approver_type_code"),
                        basePriceArlApprover.get("approve_status_code"),
                        basePriceArlApprover.get("local_create_dtm"),
                        basePriceArlApprover.get("local_update_dtm"),
                        basePriceArlApprover.get("create_user_id"),
                        basePriceArlApprover.get("update_user_id")
                    };
                    v_batchInsert_BasePriceArlApprover.add(objApprover);

                    v_sql_batchInsert = v_sql_batchInsert + "INSERT INTO #LOCAL_TEMP_APPROVER VALUES (" + Arrays.toString(objApprover) + ");\n";
                }
            }

            /** 
             * BasePriceArlRefererType
            */
            if (basePriceArlMaster.getReferers() != null) {
                Collection<BasePriceArlRefererType> basePriceArlReferers = basePriceArlMaster.getReferers();

                // Creating a temporary dataset : #LOCAL_TEMP_REFERER
                for (BasePriceArlRefererType basePriceArlReferer : basePriceArlReferers) {
                    // System.out.println("\t# referer_empno : " + basePriceArlReferer.getRefererEmpno()); // Loop Data Check

                    Object[] objReferer = new Object[] {
                        basePriceArlReferer.get("tenant_id"),
                        basePriceArlReferer.get("approval_number"),
                        basePriceArlReferer.get("referer_empno"),
                        basePriceArlReferer.get("local_create_dtm"),
                        basePriceArlReferer.get("local_update_dtm"),
                        basePriceArlReferer.get("create_user_id"),
                        basePriceArlReferer.get("update_user_id")
                    };
                    v_batchInsert_BasePriceArlReferer.add(objReferer);

                    v_sql_batchInsert = v_sql_batchInsert + "INSERT INTO #LOCAL_TEMP_REFERER VALUES (" + Arrays.toString(objReferer) + ");\n";
                }
            }

            /** 
             * BasePriceArlDetailType
            */
            if (basePriceArlMaster.getDetails() != null) {
                Collection<BasePriceArlDtlType> basePriceArlDetails = basePriceArlMaster.getDetails();

                // Creating a temporary dataset : #LOCAL_TEMP_DETAIL
                for (BasePriceArlDtlType basePriceArlDetail : basePriceArlDetails) {
                    // System.out.println("\t# item_sequence : " + basePriceArlDetail.getItemSequence()); // Loop Data Check

                    Object[] objDetail = new Object[] {
                        basePriceArlDetail.get("tenant_id"),
                        basePriceArlDetail.get("approval_number"),
                        basePriceArlDetail.get("item_sequence"),
                        basePriceArlDetail.get("company_code"),
                        basePriceArlDetail.get("org_type_code"),
                        basePriceArlDetail.get("org_code"),
                        basePriceArlDetail.get("material_code"),
                        basePriceArlDetail.get("base_uom_code"),
                        basePriceArlDetail.get("supplier_code"),
                        basePriceArlDetail.get("base_date"),
                        basePriceArlDetail.get("base_price_ground_code"),
                        basePriceArlDetail.get("change_reason_code"),
                        basePriceArlDetail.get("repr_material_code"),
                        basePriceArlDetail.get("repr_material_supplier_code"),
                        basePriceArlDetail.get("repr_material_org_code"),
                        basePriceArlDetail.get("local_create_dtm"),
                        basePriceArlDetail.get("local_update_dtm"),
                        basePriceArlDetail.get("create_user_id"),
                        basePriceArlDetail.get("update_user_id")
                    };
                    v_batchInsert_BasePriceArlDetail.add(objDetail);

                    v_sql_batchInsert = v_sql_batchInsert + "INSERT INTO #LOCAL_TEMP_DETAIL VALUES (" + Arrays.toString(objDetail) + ");\n";

                    /** 
                     * BasePriceArlPriceType
                    */
                    if (basePriceArlDetail.getPrices() != null) {
                        Collection<BasePriceArlPriceType> basePriceArlPrices = basePriceArlDetail.getPrices();

                        // Creating a temporary dataset : #LOCAL_TEMP_PRICE
                        for (BasePriceArlPriceType basePriceArlPrice : basePriceArlPrices) {
                            // System.out.println("\t\t# market_code : " + basePriceArlPrice.getMarketCode()); // Loop Data Check

                            Object[] objPrice = new Object[] {
                                basePriceArlPrice.get("tenant_id"),
                                basePriceArlPrice.get("approval_number"),
                                basePriceArlPrice.get("item_sequence"),
                                basePriceArlPrice.get("market_code"),
                                basePriceArlPrice.get("new_base_price"),
                                basePriceArlPrice.get("new_base_price_currency_code"),
                                basePriceArlPrice.get("current_base_price"),
                                basePriceArlPrice.get("current_base_price_currency_code"),
                                basePriceArlPrice.get("first_purchasing_net_price"),
                                basePriceArlPrice.get("first_pur_netprice_curr_cd"),
                                basePriceArlPrice.get("first_pur_netprice_str_dt"),
                                basePriceArlPrice.get("local_create_dtm"),
                                basePriceArlPrice.get("local_update_dtm"),
                                basePriceArlPrice.get("create_user_id"),
                                basePriceArlPrice.get("update_user_id")
                            };
                            v_batchInsert_BasePriceArlPrice.add(objPrice);

                            v_sql_batchInsert = v_sql_batchInsert + "INSERT INTO #LOCAL_TEMP_PRICE VALUES (" + Arrays.toString(objPrice) + ");\n";
                        }
                    }
                }
            }
        }

        /**
         * SQL batch execution
        */

        // try {
        //     int[] returnCntMaster = jdbc.batchUpdate(v_sql_insert_BasePriceArlMaster, v_batchInsert_BasePriceArlMaster);
        // } catch (Exception e) {
        //     String msg = "입력 데이터에 오류가 있습니다.";
        //     throw new ServiceException(ErrorStatuses.BAD_REQUEST, msg);
        // }

        // 01. #LOCAL_TEMP_MASTER
        int[] returnCntMaster = jdbc.batchUpdate(v_sql_insert_BasePriceArlMaster, v_batchInsert_BasePriceArlMaster);
        // System.out.println("# [#LOCAL_TEMP_MASTER] Insertion Count : " + this.getIntArraySum(returnCntMaster) + " / " + Arrays.toString(returnCntMaster));

        // 02. #LOCAL_TEMP_APPROVER
        int[] returnCntApprover = jdbc.batchUpdate(v_sql_insert_BasePriceArlApprover, v_batchInsert_BasePriceArlApprover);
        // System.out.println("# [#LOCAL_TEMP_APPROVER] Insertion Count : " + this.getIntArraySum(returnCntApprover) + " / " + Arrays.toString(returnCntApprover));

        // 03. #LOCAL_TEMP_REFERER
        int[] returnCntReferer = jdbc.batchUpdate(v_sql_insert_BasePriceArlReferer, v_batchInsert_BasePriceArlReferer);
        // System.out.println("# [#LOCAL_TEMP_REFERER] Insertion Count : " + this.getIntArraySum(returnCntReferer) + " / " + Arrays.toString(returnCntReferer));

        // 04. #LOCAL_TEMP_DETAIL
        int[] returnCntDetail = jdbc.batchUpdate(v_sql_insert_BasePriceArlDetail, v_batchInsert_BasePriceArlDetail);
        // System.out.println("# [#LOCAL_TEMP_DETAIL] Insertion Count : " + this.getIntArraySum(returnCntDetail) + " / " + Arrays.toString(returnCntDetail));

        // 05. #LOCAL_TEMP_PRICE
        int[] returnCntPrice = jdbc.batchUpdate(v_sql_insert_BasePriceArlPrice, v_batchInsert_BasePriceArlPrice);
        // System.out.println("# [#LOCAL_TEMP_PRICE] Insertion Count : " + this.getIntArraySum(returnCntPrice) + " / " + Arrays.toString(returnCntPrice));
        
        if (isDisplaySql) {
            // v_sql_batchInsert.replace("[", "(").replace(", ", "','").replace("]", "");
            System.out.println(v_sql_batchInsert + "\n");

            System.out.println("SELECT * FROM #LOCAL_TEMP_MASTER;");
            System.out.println("SELECT * FROM #LOCAL_TEMP_APPROVER;");
            System.out.println("SELECT * FROM #LOCAL_TEMP_REFERER;");
            System.out.println("SELECT * FROM #LOCAL_TEMP_DETAIL;");
            System.out.println("SELECT * FROM #LOCAL_TEMP_PRICE;\n");
        }
    }

    /**
     * Temp Data(Change Requestor) Create
     * @param basePriceArlMasters
     * @param isDisplaySql
     */
    @Transactional(rollbackFor = SQLException.class)
    private void createTempChangeData(Collection<BasePriceArlChangeRequestorType> basePriceArlChangeRequestors, boolean isDisplaySql) {
        log.info("## createTempData(ChangeRequestor) Method Started....");

        String v_sql_batchInsert = "";

        String v_sql_insert_BasePriceArlChangeRequestor   = "INSERT INTO #LOCAL_TEMP_CHANGE_REQUESTOR VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        List<Object[]> v_batchInsert_BasePriceArlChangeRequestor   = new ArrayList<Object[]>();

        // Creating a temporary dataset : #LOCAL_TEMP_CHANGE_REQUESTOR
        for (BasePriceArlChangeRequestorType basePriceArlChangeRequestor : basePriceArlChangeRequestors) {

            Object[] objMaster = new Object[] {
                basePriceArlChangeRequestor.get("tenant_id"),
                basePriceArlChangeRequestor.get("approval_number"),
                basePriceArlChangeRequestor.get("changer_empno"),
                basePriceArlChangeRequestor.get("creator_empno"),
                basePriceArlChangeRequestor.get("local_create_dtm"),
                basePriceArlChangeRequestor.get("local_update_dtm"),
                basePriceArlChangeRequestor.get("create_user_id"),
                basePriceArlChangeRequestor.get("update_user_id")
            };
            v_batchInsert_BasePriceArlChangeRequestor.add(objMaster);

            v_sql_batchInsert = v_sql_batchInsert + "INSERT INTO #LOCAL_TEMP_CHANGE_REQUESTOR VALUES (" + Arrays.toString(objMaster) + ");\n";
        }

        // 01. #LOCAL_TEMP_CHANGE_REQUESTOR
        int[] returnCntChangeRequestor = jdbc.batchUpdate(v_sql_insert_BasePriceArlChangeRequestor, v_batchInsert_BasePriceArlChangeRequestor);
        // System.out.println("# [#LOCAL_TEMP_CHANGE_REQUESTOR] Insertion Count : " + this.getIntArraySum(returnCntChangeRequestor) + " / " + Arrays.toString(returnCntChangeRequestor));

        if (isDisplaySql) {
            System.out.println(v_sql_batchInsert + "\n");
            System.out.println("SELECT * FROM #LOCAL_TEMP_CHANGE_REQUESTOR;");
        }

    }

    private int getIntArraySum(int[] iCnt) {
        int sum = 0;

        if (iCnt == null || iCnt.length < 0) return sum;
        
        for (int i = 0; i < iCnt.length; i++) {
            sum += iCnt[i];
        }

        return sum;
    }

    /**
     * Insert Procedure Call
     * @param context
     * @param isDisplaySql
     * @return
     */
    @Transactional(rollbackFor = SQLException.class)
    private Map<String, Object> insertProcedure(DpViBasePriceArlProcContext context, boolean isDisplaySql) {
        log.info("## insertProcedure Method Started....");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL DP_VI_BASE_PRICE_ARL_INSERT_PROC(");        
        v_sql_callProc.append("     I_MASTER => #LOCAL_TEMP_MASTER,");        
        v_sql_callProc.append("     I_APPROVER => #LOCAL_TEMP_APPROVER,");        
        v_sql_callProc.append("     I_REFERER => #LOCAL_TEMP_REFERER, ");        
        v_sql_callProc.append("     I_DETAIL => #LOCAL_TEMP_DETAIL,");        
        v_sql_callProc.append("     I_PRICE => #LOCAL_TEMP_PRICE,");        
        v_sql_callProc.append("     O_MSG => ?)"); 

        if (isDisplaySql) {
            System.out.println("\n" + v_sql_callProc);
        }

        OutputDataType v_result = OutputDataType.create();

        //CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet rs, int rowNum) throws SQLException {
                v_result.setReturnCode(rs.getString("return_code"));
                v_result.setReturnMsg(rs.getString("return_msg"));
                v_result.setReturnParam(rs.getString("return_param"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        //paramList.add(new SqlParameter("USER_ID", Types.VARCHAR));
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                // callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                return callableStatement;
            }
        }, paramList);

        return resultMap;
    }

    /**
     * upsert Procedure Call
     * @param context
     * @param isDisplaySql
     * @return
     */
    @Transactional(rollbackFor = SQLException.class)
    private Map<String, Object> upsertProcedure(DpViBasePriceArlProcContext context, boolean isDisplaySql) {
        log.info("## upsertProcedure Method Started....");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL DP_VI_BASE_PRICE_ARL_UPSERT_PROC(");        
        v_sql_callProc.append("     I_MASTER => #LOCAL_TEMP_MASTER,");        
        v_sql_callProc.append("     I_APPROVER => #LOCAL_TEMP_APPROVER,");        
        v_sql_callProc.append("     I_REFERER => #LOCAL_TEMP_REFERER, ");        
        v_sql_callProc.append("     I_DETAIL => #LOCAL_TEMP_DETAIL,");        
        v_sql_callProc.append("     I_PRICE => #LOCAL_TEMP_PRICE,");        
        v_sql_callProc.append("     O_MSG => ?)"); 

        if (isDisplaySql) {
            System.out.println("\n" + v_sql_callProc);
        }

        OutputDataType v_result = OutputDataType.create();

        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet rs, int rowNum) throws SQLException {
                v_result.setReturnCode(rs.getString("return_code"));
                v_result.setReturnMsg(rs.getString("return_msg"));
                v_result.setReturnParam(rs.getString("return_param"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                return callableStatement;
            }
        }, paramList);

        return resultMap;
    }

    /**
     * delete Procedure Call
     * @param context
     * @param isDisplaySql
     * @return
     */
    @Transactional(rollbackFor = SQLException.class)
    private Map<String, Object> deleteProcedure(DpViBasePriceArlProcContext context, boolean isDisplaySql) {
        log.info("## deleteProcedure Method Started....");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL DP_VI_BASE_PRICE_ARL_DELETE_PROC(");        
        v_sql_callProc.append("     I_MASTER => #LOCAL_TEMP_MASTER,");        
        v_sql_callProc.append("     O_MSG => ?)"); 

        if (isDisplaySql) {
            System.out.println("\n" + v_sql_callProc);
        }

        OutputDataType v_result = OutputDataType.create();

        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet rs, int rowNum) throws SQLException {
                v_result.setReturnCode(rs.getString("return_code"));
                v_result.setReturnMsg(rs.getString("return_msg"));
                v_result.setReturnParam(rs.getString("return_param"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                return callableStatement;
            }
        }, paramList);

        return resultMap;
    }

    /**
     * upsert Requestor Procedure Call
     * @param context
     * @param isDisplaySql
     * @return
     */
    @Transactional(rollbackFor = SQLException.class)
    private Map<String, Object> upsertRequestorProcedure(DpViBasePriceChangeRequestorProcContext context, boolean isDisplaySql) {
        log.info("## upsertRequestorProcedure Method Started....");

        StringBuffer v_sql_callProc = new StringBuffer();
        v_sql_callProc.append("CALL DP_VI_BASE_PRICE_ARL_CHANGE_REQUESTOR_UPSERT_PROC(");        
        v_sql_callProc.append("     I_REQUESTOR => #LOCAL_TEMP_CHANGE_REQUESTOR,");        
        v_sql_callProc.append("     O_MSG => ?)"); 

        if (isDisplaySql) {
            System.out.println("\n" + v_sql_callProc);
        }

        OutputDataType v_result = OutputDataType.create();

        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputDataType>(){
            @Override
            public OutputDataType mapRow(ResultSet rs, int rowNum) throws SQLException {
                v_result.setReturnCode(rs.getString("return_code"));
                v_result.setReturnMsg(rs.getString("return_msg"));
                v_result.setReturnParam(rs.getString("return_param"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                return callableStatement;
            }
        }, paramList);

        return resultMap;
    }

    @Transactional(rollbackFor = SQLException.class)
    private void destoryTable(String procName, boolean isDisplaySql) {
        log.info("## destoryTable Method Started....");

        if (procName.equals("approval")) {
            // 1. BasePriceArlMstType 관련 테이블
            destoryTempTable("#LOCAL_TEMP_MASTER", isDisplaySql);
            
            // 2. BasePriceArlApproverType 관련 테이블
            destoryTempTable("#LOCAL_TEMP_APPROVER", isDisplaySql);

            // 3. BasePriceArlRefererType 관련 테이블
            destoryTempTable("#LOCAL_TEMP_REFERER", isDisplaySql);

            // 4. BasePriceArlDtlType 관련 테이블
            destoryTempTable("#LOCAL_TEMP_DETAIL", isDisplaySql);

            // 5. BasePriceArlPriceType 관련 테이블
            destoryTempTable("#LOCAL_TEMP_PRICE", isDisplaySql);
        } else if (procName.equals("change")) {
            // 6. BasePriceArlChangeRequestorType 관련 테이블
            destoryTempTable("#LOCAL_TEMP_CHANGE_REQUESTOR", isDisplaySql);
        }
    }

    @Transactional(rollbackFor = SQLException.class)
    private void destoryTempTable(String tempTableName, boolean isDisplaySql) {
        log.info("## destoryTempTable Method Started.... : " + tempTableName);

        String v_sql_dropTable = "";

        v_sql_dropTable  = "DO BEGIN";
        v_sql_dropTable += "  IF EXISTS (SELECT * FROM m_temporary_tables WHERE table_name = '" + tempTableName + "') THEN ";
        v_sql_dropTable += "     DROP TABLE " + tempTableName + ";";
        v_sql_dropTable += "  END IF;";
        v_sql_dropTable += "END;";
        jdbc.execute(v_sql_dropTable);

        if (isDisplaySql) 
            System.out.println(v_sql_dropTable + ";");
    }

}

