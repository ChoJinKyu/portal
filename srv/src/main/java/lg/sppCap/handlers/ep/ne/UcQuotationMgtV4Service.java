package lg.sppCap.handlers.ep.ne;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

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

import cds.gen.ep.ucquotationmgtv4service.*;

@Component
@ServiceName(UcQuotationMgtV4Service_.CDS_NAME)
public class UcQuotationMgtV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    //협력사공사물량 저장
    @Transactional(rollbackFor = SQLException.class)
	@On(event=SaveUcQuotationDtlProcContext.CDS_NAME)
	public void onSaveUcQuotationDtlProc(SaveUcQuotationDtlProcContext context) {

        log.info("### EP_UC_QUOTATION_HD_SAVE_PROC 프로시저 호출시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";          

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTableH = new StringBuffer();
		v_sql_createTableH.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_H_UC ( ")
									.append("TENANT_ID                  NVARCHAR(5)		, ")
                                    .append("COMPANY_CODE               NVARCHAR(10)    , ")
                                    .append("CONST_QUOTATION_NUMBER     NVARCHAR(30)    , ")
                                    .append("ORG_CODE                   NVARCHAR(10)    , ")
                                    .append("ORG_NAME                   NVARCHAR(10)    , ")
                                    .append("CONST_NAME                 NVARCHAR(200)   , ")
                                    .append("EP_ITEM_CODE               NVARCHAR(200)   , ")
                                    .append("CONST_START_DATE           DATE            , ")
                                    .append("CONST_END_DATE             DATE            , ")
                                    .append("QUOTATION_STATUS_CODE      NVARCHAR(30)    , ")
                                    .append("QUOTATION_STATUS_NAME      NVARCHAR(30)    , ")
                                    .append("SUPPLIER_CODE              NVARCHAR(30)    , ")
                                    .append("BUYER_EMPNO                NVARCHAR(30)    , ")
                                    .append("BUYER_NAME                 NVARCHAR(30)    , ")
                                    .append("CONST_PERSON_EMPNO         NVARCHAR(30)    , ")
                                    .append("CONST_PERSON_NAME          NVARCHAR(30)    , ")
                                    .append("PURCHASING_DEPARTMENT_CODE NVARCHAR(50)    , ")
                                    .append("PURCHASING_DEPARTMENT_NAME NVARCHAR(50)    , ")
                                    .append("PR_NUMBER                  NVARCHAR(50)    , ")
                                    .append("QUOTATION_WRITE_DATE       DATE            , ")
                                    .append("REMARK                     NVARCHAR(3000)  , ")
                                    .append("CURRENCY_CODE              NVARCHAR(15)    , ")
                                    .append("ATTCH_GROUP_NUMBER         NVARCHAR(100)   , ")
                                    .append("SUPPLIER_WRITE_FLAG        BOOLEAN         , ")
                                    .append("COMPLETION_FLAG            BOOLEAN         , ")
                                    .append("COMPLETION_DATE            DATE            , ")
                                    .append("FACILITY_PERSON_EMPNO      NVARCHAR(30)    , ")
                                    .append("FACILITY_PERSON_NAME       NVARCHAR(30)    , ")
                                    .append("FACILITY_DEPARTMENT_CODE   NVARCHAR(50)    , ")
                                    .append("COMPLETION_ATTCH_GROUP_NUMBER NVARCHAR(50) , ")
                                    .append("LOCAL_CREATE_DTM SECONDDATE                , ")
                                    .append("LOCAL_UPDATE_DTM SECONDDATE                , ")
                                    .append("CREATE_USER_ID NVARCHAR(255)               , ")
                                    .append("UPDATE_USER_ID NVARCHAR(255)               , ")
                                    .append("SYSTEM_CREATE_DTM SECONDDATE               , ")
                                    .append("SYSTEM_UPDATE_DTM SECONDDATE               , ")
                                    .append("ROW_STATE NVARCHAR(1)                       ")
                                .append(")");

		StringBuffer v_sql_createTableD = new StringBuffer();
		v_sql_createTableD.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_D_UC ( ")
									.append("TENANT_ID                        NVARCHAR(5) , ")
                                    .append("COMPANY_CODE                     NVARCHAR(10), ")
                                    .append("CONST_QUOTATION_NUMBER           NVARCHAR(30), ")
                                    .append("CONST_QUOTATION_ITEM_NUMBER      NVARCHAR(50), ")
                                    .append("ITEM_SEQUENCE                    DECIMAL     , ")
                                    .append("EP_ITEM_CODE                     NVARCHAR(50), ")
                                    .append("ITEM_DESC                        NVARCHAR(2000), ")
                                    .append("SPEC_DESC                        NVARCHAR(100 ), ")
                                    .append("QUOTATION_QUANTITY               DECIMAL     , ")
                                    .append("EXTRA_RATE                       DECIMAL     , ")
                                    .append("UNIT                             NVARCHAR(3) , ")
                                    .append("CURRENCY_CODE                    NVARCHAR(15), ")
                                    .append("CURRENCY_NAME                    NVARCHAR(15), ")
                                    .append("MATERIAL_APPLY_FLAG              BOOLEAN     , ")
                                    .append("LABOR_APPLY_FLAG                 BOOLEAN     , ")
                                    .append("NET_PRICE_CHANGE_ALLOW_FLAG      BOOLEAN     , ")
                                    .append("BASE_MATERIAL_NET_PRICE          DECIMAL     , ")
                                    .append("BASE_LABOR_NET_PRICE             DECIMAL     , ")
                                    .append("MATERIAL_NET_PRICE               DECIMAL     , ")
                                    .append("MATERIAL_AMOUNT                  DECIMAL     , ")
                                    .append("LABOR_NET_PRICE                  DECIMAL     , ")
                                    .append("LABOR_AMOUNT                     DECIMAL     , ")
                                    .append("SUM_AMOUNT                       DECIMAL     , ")
                                    .append("REMARK                           NVARCHAR(3000), ")
                                    .append("NET_PRICE_CONTRACT_DOCUMENT_NO   NVARCHAR(50), ")
                                    .append("NET_PRICE_CONTRACT_DEGREE        DECIMAL     , ")
                                    .append("NET_PRICE_CONTRACT_ITEM_NUMBER   NVARCHAR(50), ")
                                    .append("SUPPLIER_ITEM_CREATE_FLAG        BOOLEAN     , ")                    
                                    .append("LOCAL_CREATE_DTM SECONDDATE, ")
                                    .append("LOCAL_UPDATE_DTM SECONDDATE, ")
                                    .append("CREATE_USER_ID NVARCHAR(255), ")
                                    .append("UPDATE_USER_ID NVARCHAR(255), ")
                                    .append("SYSTEM_CREATE_DTM SECONDDATE, ")
                                    .append("SYSTEM_UPDATE_DTM SECONDDATE, ")   
                                    .append("ROW_STATE NVARCHAR(1) ") 
								.append(")");

        // String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC";                                        
		// String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?)";
        // String v_sql_callProc = "CALL EP_UC_QUOTATION_HD_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC, O_TABLE_MESSAGE => ? )";
        
        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_H_UC";
        String v_sql_dropableD = "DROP TABLE #LOCAL_TEMP_D_UC";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_H_UC VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_D_UC VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String v_sql_callProc = "CALL EP_UC_QUOTATION_HD_SAVE_PROC(I_M_TABLE => #LOCAL_TEMP_H_UC, I_D_TABLE => #LOCAL_TEMP_D_UC, O_M_TABLE => ?, O_D_TABLE => ?)";

        Collection<UcMasterData> v_inHeaders = context.getInputData().getUcMasterData();
        Collection<UcDetailData> v_inDetails = context.getInputData().getUcDetailData();



        //Collection<OutType> v_result = new ArrayList<>(); 
        SaveReturnType v_result = SaveReturnType.create();
        Collection<UcMasterData> v_resultM = new ArrayList<>();
        Collection<UcDetailData> v_resultD = new ArrayList<>();

  

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableH.toString());
        jdbc.execute(v_sql_createTableD.toString());



        //Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
            for(UcMasterData v_inRow : v_inHeaders){
                log.info("master ---->  tenant_id="+v_inRow.get("tenant_id"));
                log.info("master ---->  company_code="+v_inRow.get("company_code"));
                log.info("master ---->  const_quotation_number="+v_inRow.get("const_quotation_number"));
                log.info("master ---->  org_code="+v_inRow.get("org_code"));
                log.info("master ---->  org_name="+v_inRow.get("org_name"));
                log.info("master ---->  const_name="+v_inRow.get("const_name"));
                log.info("master ---->  ep_item_code="+v_inRow.get("ep_item_code"));
                log.info("master ---->  const_start_date="+v_inRow.get("const_start_date"));
                log.info("master ---->  const_end_date="+v_inRow.get("const_end_date"));
                log.info("master ---->  quotation_status_code="+v_inRow.get("quotation_status_code"));
                log.info("master ---->  quotation_status_name="+v_inRow.get("quotation_status_name"));
                log.info("master ---->  supplier_code="+v_inRow.get("supplier_code"));
                log.info("master ---->  buyer_empno="+v_inRow.get("buyer_empno"));
                log.info("master ---->  buyer_name="+v_inRow.get("buyer_name"));
                log.info("master ---->  const_person_empno="+v_inRow.get("const_person_empno"));
                log.info("master ---->  const_person_name="+v_inRow.get("const_person_name"));
                log.info("master ---->  purchasing_department_code="+v_inRow.get("purchasing_department_code"));
                log.info("master ---->  purchasing_department_name="+v_inRow.get("purchasing_department_name"));
                log.info("master ---->  pr_number="+v_inRow.get("pr_number"));
                log.info("master ---->  quotation_write_date="+v_inRow.get("quotation_write_date"));
                log.info("master ---->  remark="+v_inRow.get("remark"));
                log.info("master ---->  currency_code="+v_inRow.get("currency_code"));
                log.info("master ---->  attch_group_number="+v_inRow.get("attch_group_number"));
                log.info("master ---->  supplier_write_flag="+v_inRow.get("supplier_write_flag"));
                log.info("master ---->  completion_flag="+v_inRow.get("completion_flag"));
                log.info("master ---->  completion_date="+v_inRow.get("completion_date"));
                log.info("master ---->  facility_person_empno="+v_inRow.get("facility_person_empno"));
                log.info("master ---->  facility_person_name="+v_inRow.get("facility_person_name"));
                log.info("master ---->  facility_department_code="+v_inRow.get("facility_department_code"));
                log.info("master ---->  completion_attch_group_number="+v_inRow.get("completion_attch_group_number"));
                log.info("master ---->  row_state="+v_inRow.get("row_state"));
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id                  "),	
                    v_inRow.get("company_code               "), 
                    v_inRow.get("const_quotation_number     "), 
                    v_inRow.get("org_code                   "), 
                    v_inRow.get("org_name                   "), 
                    v_inRow.get("const_name                 "), 
                    v_inRow.get("ep_item_code               "), 
                    v_inRow.get("const_start_date           "), 
                    v_inRow.get("const_end_date             "), 
                    v_inRow.get("quotation_status_code      "), 
                    v_inRow.get("quotation_status_name      "), 
                    v_inRow.get("supplier_code              "), 
                    v_inRow.get("buyer_empno                "), 
                    v_inRow.get("buyer_name                 "), 
                    v_inRow.get("const_person_empno         "), 
                    v_inRow.get("const_person_name          "), 
                    v_inRow.get("purchasing_department_code "), 
                    v_inRow.get("purchasing_department_name "), 
                    v_inRow.get("pr_number                  "), 
                    v_inRow.get("quotation_write_date       "), 
                    v_inRow.get("remark                     "), 
                    v_inRow.get("currency_code              "), 
                    v_inRow.get("attch_group_number         "), 
                    v_inRow.get("supplier_write_flag        "), 
                    v_inRow.get("completion_flag            "), 
                    v_inRow.get("completion_date            "), 
                    v_inRow.get("facility_person_empno      "), 
                    v_inRow.get("facility_person_name       "), 
                    v_inRow.get("facility_department_code   "), 
                    v_inRow.get("completion_attch_group_number"),
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),     
                    v_inRow.get("row_state")
                };
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTableH, batchH);


        // Detail Local Temp Table에 insert
        List<Object[]> batchD = new ArrayList<Object[]>();
        if(!v_inDetails.isEmpty() && v_inDetails.size() > 0){
            for(UcDetailData v_inRow : v_inDetails){
                log.info("tenant_id="+v_inRow.get("tenant_id"));
                log.info("company_code="+v_inRow.get("company_code"));
                log.info("const_quotation_number="+v_inRow.get("const_quotation_number"));
                log.info("const_quotation_item_number="+v_inRow.get("const_quotation_item_number"));
                log.info("item_sequence="+v_inRow.get("item_sequence"));
                log.info("ep_item_code="+v_inRow.get("ep_item_code"));
                log.info("item_desc="+v_inRow.get("item_desc"));
                log.info("spec_desc="+v_inRow.get("spec_desc"));
                log.info("quotation_quantity="+v_inRow.get("quotation_quantity"));
                log.info("unit="+v_inRow.get("unit"));
                log.info("currency_code="+v_inRow.get("currency_code"));
                log.info("currency_name="+v_inRow.get("currency_name"));
                log.info("material_apply_flag="+v_inRow.get("material_apply_flag"));
                log.info("labor_apply_flag="+v_inRow.get("labor_apply_flag"));
                log.info("net_price_change_allow_flag="+v_inRow.get("net_price_change_allow_flag"));
                log.info("base_material_net_price="+v_inRow.get("base_material_net_price"));
                log.info("base_labor_net_price="+v_inRow.get("base_labor_net_price"));
                log.info("material_net_price="+v_inRow.get("material_net_price"));
                log.info("material_amount="+v_inRow.get("material_amount"));
                log.info("labor_net_price="+v_inRow.get("labor_net_price"));
                log.info("labor_amount="+v_inRow.get("labor_amount"));
                log.info("sum_amount="+v_inRow.get("sum_amount"));
                log.info("remark="+v_inRow.get("remark"));
                log.info("net_price_contract_document_no="+v_inRow.get("net_price_contract_document_no"));
                log.info("net_price_contract_degree="+v_inRow.get("net_price_contract_degree"));
                log.info("net_price_contract_item_number="+v_inRow.get("net_price_contract_item_number"));
                log.info("supplier_item_create_flag="+v_inRow.get("supplier_item_create_flag"));
                log.info("row_state="+v_inRow.get("row_state"));

                Object[] values = new Object[] {
                    v_inRow.get("tenant_id                       "),
                    v_inRow.get("company_code                    "),
                    v_inRow.get("const_quotation_number          "),
                    v_inRow.get("const_quotation_item_number     "),
                    v_inRow.get("item_sequence                   "),
                    v_inRow.get("ep_item_code                    "),
                    v_inRow.get("item_desc                       "),
                    v_inRow.get("spec_desc                       "),
                    v_inRow.get("quotation_quantity              "),
                    v_inRow.get("extra_rate                      "),
                    v_inRow.get("unit                            "),
                    v_inRow.get("currency_code                   "),
                    v_inRow.get("currency_name                   "),
                    v_inRow.get("material_apply_flag             "),
                    v_inRow.get("labor_apply_flag                "),
                    v_inRow.get("net_price_change_allow_flag     "),
                    v_inRow.get("base_material_net_price         "),
                    v_inRow.get("base_labor_net_price            "),
                    v_inRow.get("material_net_price              "),
                    v_inRow.get("material_amount                 "),
                    v_inRow.get("labor_net_price                 "),
                    v_inRow.get("labor_amount                    "),
                    v_inRow.get("sum_amount                      "),
                    v_inRow.get("remark                          "),
                    v_inRow.get("net_price_contract_document_no  "),
                    v_inRow.get("net_price_contract_degree       "),
                    v_inRow.get("net_price_contract_item_number  "),
                    v_inRow.get("supplier_item_create_flag       "),
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),     
                    v_inRow.get("row_state")
                };
                batchD.add(values);
            }
        }    

        int[] updateCountsD = jdbc.batchUpdate(v_sql_insertTableD, batchD);


        boolean delFlag = false;

        SqlReturnResultSet oMTable = new SqlReturnResultSet("O_M_TABLE", new RowMapper<UcMasterData>(){
            @Override
            public UcMasterData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                UcMasterData v_row = UcMasterData.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setConstQuotationNumber(v_rs.getString("const_quotation_number"));
                v_row.setOrgCode(v_rs.getString("org_code"));
                v_row.setOrgName(v_rs.getString("org_name"));
                v_row.setConstName(v_rs.getString("const_name"));
                v_row.setEpItemCode(v_rs.getString("ep_item_code"));
                v_row.setConstStartDate(v_rs.getDate("const_start_date").toLocalDate());
                v_row.setConstEndDate(v_rs.getDate("const_end_date").toLocalDate());
                v_row.setQuotationStatusCode(v_rs.getString("quotation_status_code"));
                v_row.setQuotationStatusName(v_rs.getString("quotation_status_name"));
                v_row.setSupplierCode(v_rs.getString("supplier_code"));
                v_row.setBuyerEmpno(v_rs.getString("buyer_empno"));
                v_row.setBuyerName(v_rs.getString("buyer_name"));
                v_row.setConstPersonEmpno(v_rs.getString("const_person_empno"));
                v_row.setConstPersonName(v_rs.getString("const_person_name"));
                v_row.setPurchasingDepartmentCode(v_rs.getString("purchasing_department_code"));
                v_row.setPurchasingDepartmentName(v_rs.getString("purchasing_department_name"));
                v_row.setPrNumber(v_rs.getString("pr_number"));
                v_row.setQuotationWriteDate(v_rs.getDate("quotation_write_date").toLocalDate());
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setCurrencyCode(v_rs.getString("currency_code"));
                v_row.setAttchGroupNumber(v_rs.getString("attch_group_number"));
                v_row.setSupplierWriteFlag(v_rs.getBoolean("supplier_write_flag"));
                v_row.setCompletionFlag(v_rs.getBoolean("completion_flag"));
                v_row.setCompletionDate(v_rs.getDate("completion_date").toLocalDate());
                v_row.setFacilityPersonEmpno(v_rs.getString("facility_person_empno"));
                v_row.setFacilityPersonName(v_rs.getString("facility_person_name"));
                v_row.setFacilityDepartmentCode(v_rs.getString("facility_department_code"));
                v_row.setCompletionAttchGroupNumber(v_rs.getString("completion_attch_group_number"));
                v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultM.add(v_row);
                return v_row;
            }
        });

        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_D_TABLE", new RowMapper<UcDetailData>(){
            @Override
            public UcDetailData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                UcDetailData v_row = UcDetailData.create();

                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setConstQuotationNumber(v_rs.getString("const_quotation_number"));
                v_row.setConstQuotationItemNumber(v_rs.getString("const_quotation_item_number"));
                v_row.setItemSequence(v_rs.getBigDecimal("item_sequence"));
                v_row.setEpItemCode(v_rs.getString("ep_item_code"));
                v_row.setItemDesc(v_rs.getString("item_desc"));
                v_row.setSpecDesc(v_rs.getString("spec_desc"));
                v_row.setQuotationQuantity(v_rs.getBigDecimal("quotation_quantity"));
                v_row.setExtraRate(v_rs.getBigDecimal("extra_rate"));
                v_row.setUnit(v_rs.getString("unit"));
                v_row.setCurrencyCode(v_rs.getString("currency_code"));
                v_row.setCurrencyName(v_rs.getString("currency_name"));
                v_row.setMaterialApplyFlag(v_rs.getBoolean("material_apply_flag"));
                v_row.setLaborApplyFlag(v_rs.getBoolean("labor_apply_flag"));
                v_row.setNetPriceChangeAllowFlag(v_rs.getBoolean("net_price_change_allow_flag"));
                v_row.setBaseMaterialNetPrice(v_rs.getBigDecimal("base_material_net_price"));
                v_row.setBaseLaborNetPrice(v_rs.getBigDecimal("base_labor_net_price"));
                v_row.setMaterialNetPrice(v_rs.getBigDecimal("material_net_price"));
                v_row.setMaterialAmount(v_rs.getBigDecimal("material_amount"));
                v_row.setLaborNetPrice(v_rs.getBigDecimal("labor_net_price"));
                v_row.setLaborAmount(v_rs.getBigDecimal("labor_amount"));
                v_row.setSumAmount(v_rs.getBigDecimal("sum_amount"));
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setNetPriceContractDocumentNo(v_rs.getString("net_price_contract_document_no"));
                v_row.setNetPriceContractDegree(v_rs.getLong("net_price_contract_degree"));
                v_row.setNetPriceContractItemNumber(v_rs.getString("net_price_contract_item_number"));
                v_row.setSupplierItemCreateFlag(v_rs.getBoolean("supplier_item_create_flag"));
                v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultD.add(v_row);
                return v_row;
            }
        });


        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oMTable);
        paramList.add(oDTable);


 
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                String callProc = "";

                callProc = v_sql_callProc;
                
                CallableStatement callableStatement = connection.prepareCall(callProc);
                return callableStatement;
            }
        }, paramList);     
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropableH);
        jdbc.execute(v_sql_dropableD);
        // jdbc.execute(v_sql_dropableS);
        // jdbc.execute(v_sql_dropableE);

        v_result.setUcMasterData(v_resultM);
        v_result.setUcDetailData(v_resultD);

        context.setResult(v_result);            
        context.setCompleted();          

        log.info("### EP_UC_QUOTATION_HD_SAVE_PROC 프로시저 호출종료 ###");

    }   


    //action SaveUcQuotationExtraProc(inputData : array of UcQuotationExtraData) returns UcQuotationExtraData;
    //공사계약할증 저장
    @Transactional(rollbackFor = SQLException.class)
	@On(event=SaveUcQuotationExtraProcContext.CDS_NAME)
	public void onSaveUcQuotationExtraProc(SaveUcQuotationExtraProcContext context) {

        log.info("### EP_UC_QUOTATION_EXTRA_SAVE_PROC 프로시저 호출시작 ###");
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";          

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTableH = new StringBuffer();
		v_sql_createTableH.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_H_UC ( ")
									.append("TENANT_ID NVARCHAR(5), ")
                                    .append("COMPANY_CODE NVARCHAR(10), ")
                                    .append("CONST_QUOTATION_NUMBER NVARCHAR(30), ")
                                    .append("CONST_QUOTATION_ITEM_NUMBER NVARCHAR(50), ")
                                    .append("APPLY_EXTRA_SEQUENCE DECIMAL, ")
                                    .append("NET_PRICE_CONTRACT_DOCUMENT_NO NVARCHAR(50), ")
                                    .append("NET_PRICE_CONTRACT_DEGREE DECIMAL, ")
                                    .append("NET_PRICE_CONTRACT_EXTRA_SEQ DECIMAL, ")
                                    .append("EXTRA_NUMBER NVARCHAR(30), ")
                                    .append("EXTRA_CLASS_NUMBER NVARCHAR(30), ")
                                    .append("EXTRA_RATE DECIMAL, ")
                                    .append("REMARK NVARCHAR(3000), ")
                                    .append("LOCAL_CREATE_DTM SECONDDATE, ")
                                    .append("LOCAL_UPDATE_DTM SECONDDATE, ")
                                    .append("CREATE_USER_ID NVARCHAR(255), ")
                                    .append("UPDATE_USER_ID NVARCHAR(255), ")
                                    .append("SYSTEM_CREATE_DTM SECONDDATE, ")
                                    .append("SYSTEM_UPDATE_DTM SECONDDATE, ")   
                                    .append("ROW_STATE NVARCHAR(1) ") 
                                .append(")");

		

        // String v_sql_dropTableD = "DROP TABLE #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC";                                        
		// String v_sql_insertTableD = "INSERT INTO #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?)";
        // String v_sql_callProc = "CALL EP_UC_QUOTATION_HD_SAVE_PROC( I_TABLE => #LOCAL_TEMP_EP_UC_QUOTATION_HD_SAVE_PROC, O_TABLE_MESSAGE => ? )";
        
        String v_sql_dropableH = "DROP TABLE #LOCAL_TEMP_H_UC";

        String v_sql_insertTableH = "INSERT INTO #LOCAL_TEMP_H_UC VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String v_sql_callProc = "CALL EP_UC_QUOTATION_EXTRA_SAVE_PROC(I_M_TABLE => #LOCAL_TEMP_H_UC, O_M_TABLE => ?)";

        //Collection<UcQuotationExtraData> v_inRows = context.getInputData();
        Collection<UcQuotationExtraData> v_inHeaders = context.getInputData();

        ///SaveReturnType v_result = inputData.create();
        Collection<UcQuotationExtraData> v_result = new ArrayList<>(); 
        Collection<UcQuotationExtraData> v_resultM = new ArrayList<>();


        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableH.toString());



        //Header Local Temp Table에 insert
        List<Object[]> batchH = new ArrayList<Object[]>();
        if(!v_inHeaders.isEmpty() && v_inHeaders.size() > 0){
            for(UcQuotationExtraData v_inRow : v_inHeaders){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("company_code"),
                    v_inRow.get("const_quotation_number"),
                    v_inRow.get("const_quotation_item_number"),
                    v_inRow.get("apply_extra_sequence"),
                    v_inRow.get("net_price_contract_document_no"),
                    v_inRow.get("net_price_contract_degree"),
                    v_inRow.get("net_price_contract_extra_seq"),
                    v_inRow.get("extra_number"),
                    v_inRow.get("extra_class_number"),
                    v_inRow.get("extra_rate"),
                    v_inRow.get("remark"),
                    v_inRow.get("local_create_dtm"),               
                    v_inRow.get("local_update_dtm"),               
                    v_inRow.get("create_user_id"),                 
                    v_inRow.get("update_user_id"),                 
                    v_inRow.get("system_create_dtm"),              
                    v_inRow.get("system_update_dtm"),     
                    v_inRow.get("row_state")
                };
                batchH.add(values);
            }
        }

        int[] updateCountsH = jdbc.batchUpdate(v_sql_insertTableH, batchH);

        boolean delFlag = false;

        SqlReturnResultSet oMTable = new SqlReturnResultSet("O_M_TABLE", new RowMapper<UcQuotationExtraData>(){
            @Override
            public UcQuotationExtraData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                UcQuotationExtraData v_row = UcQuotationExtraData.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setConstQuotationNumber(v_rs.getString("const_quotation_number"));
                v_row.setConstQuotationItemNumber(v_rs.getString("const_quotation_item_number"));
                v_row.setApplyExtraSequence(v_rs.getBigDecimal("apply_extra_sequence"));
                v_row.setNetPriceContractDocumentNo(v_rs.getString("net_price_contract_document_no"));
                v_row.setNetPriceContractDegree(v_rs.getLong("net_price_contract_degree"));
                v_row.setNetPriceContractExtraSeq(v_rs.getBigDecimal("net_price_contract_extra_seq"));
                v_row.setExtraNumber(v_rs.getString("extra_number"));
                v_row.setExtraClassNumber(v_rs.getString("extra_class_number"));
                v_row.setExtraRate(v_rs.getBigDecimal("extra_rate"));
                v_row.setRemark(v_rs.getString("remark"));
                v_row.setLocalCreateDtm(v_rs.getDate("local_create_dtm").toInstant());
                v_row.setLocalUpdateDtm(v_rs.getDate("local_update_dtm").toInstant());
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getDate("system_create_dtm").toInstant());
                v_row.setSystemUpdateDtm(v_rs.getDate("system_update_dtm").toInstant());
                v_row.setRowState(v_rs.getString("row_state"));
                v_resultM.add(v_row);
                return v_row;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oMTable);

 
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                String callProc = "";

                callProc = v_sql_callProc;
                
                CallableStatement callableStatement = connection.prepareCall(callProc);
                return callableStatement;
            }
        }, paramList);     
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_dropableH);
        // jdbc.execute(v_sql_dropableS);
        // jdbc.execute(v_sql_dropableE);

        //v_result.setInputData(v_resultM);

        //context.setResult(v_result);            
        context.setCompleted();          

        log.info("### EP_UC_QUOTATION_EXTRA_SAVE_PROC 프로시저 호출종료 ###");

    }   
    
}