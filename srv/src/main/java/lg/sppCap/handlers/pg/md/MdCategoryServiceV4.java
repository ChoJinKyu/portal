package lg.sppCap.handlers.pg.md;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.pg.mdcategoryv4service.CommonReturnType;
import cds.gen.pg.mdcategoryv4service.MdCategoryV4Service_;
import cds.gen.pg.mdcategoryv4service.MdVpMappingItemMultiProcContext;
import cds.gen.pg.mdcategoryv4service.MdVpMappingItemProcType;
import cds.gen.pg.mdcategoryv4service.MdVpMappingItemView;
import cds.gen.pg.mdcategoryv4service.MdVpMappingItemView_;
import cds.gen.pg.mdcategoryv4service.MdVpMappingStatusMultiProcContext;
import cds.gen.pg.mdcategoryv4service.MdVpMappingStatusProcType;
import cds.gen.pg.mdcategoryv4service.MdVpMaterialMappSaveProcContext;
import cds.gen.pg.mdcategoryv4service.ReturnRslt;
import cds.gen.pg.mdcategoryv4service.VpMaterialValue;
import cds.gen.pg.mdcategoryv4service.VpValueInfo;
import lg.sppCap.frame.user.SppUserSession;
import lg.sppCap.util.StringUtil;

@Component
@ServiceName("pg.MdCategoryV4Service")
public class MdCategoryServiceV4 implements EventHandler {

    private final static Logger log = LoggerFactory.getLogger(MdCategoryServiceV4.class);

    @Autowired
    SppUserSession sppUserSession;

	@Autowired
	private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(MdCategoryV4Service_.CDS_NAME)
    private CdsService mdCategoryV4Service;

    // Vendor Pool별 Material/Supplier Mapping 목록 Value Keyin 저장 처리
    @Transactional(rollbackFor = SQLException.class)
    @On(event=MdVpMaterialMappSaveProcContext.CDS_NAME)
	public void onMdVpMaterialMappSaveProc(MdVpMaterialMappSaveProcContext context) {

        if(log.isDebugEnabled()) log.debug("### onMdVpMaterialMappSaveProc array건 처리 [On] ###");

        // Paramter 입력값
        VpValueInfo v_params = context.getParams();
        //if(log.isDebugEnabled()) log.debug("### VpValueInfo array ###{}#{}#{}#{}#{}###", v_params.getTenantId(), v_params.getCompanyCode(), v_params.getOrgTypeCode(), v_params.getOrgCode(), v_params.getVendorPoolCode());
        // Array건 입력값
        Collection<VpMaterialValue> v_values = v_params.getValues();
    
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_VALUE( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("ORG_TYPE_CODE NVARCHAR(30), ")
									.append("ORG_CODE NVARCHAR(10), ")
									.append("VENDOR_POOL_CODE NVARCHAR(20), ")
									.append("MATERIAL_CODE NVARCHAR(40), ")
									.append("SUPPLIER_CODE NVARCHAR(10), ")
									.append("SPMD_CHARACTER_SERIAL_NO BIGINT, ")
									.append("ATTR_VALUE NVARCHAR(100), ")
									.append("UPDATE_USER_ID NVARCHAR(255) ")
								.append(")");
        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_VALUE";
		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_MD_VP_MAPPING_VALUE VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL PG_MD_VP_MAPPING_VALUE_SAVE_PROC( I_TABLE => #LOCAL_TEMP_PG_MD_VP_MAPPING_VALUE, O_TABLE => ? )";

        // Result return
        ReturnRslt rtnRslt = ReturnRslt.create();
        Map<String, Object> rsltInfoMap = new HashMap<String, Object>();
        ObjectMapper oMapper = new ObjectMapper();
    
		try {
            // Commit Option
            jdbc.execute(v_sql_commitOption);
            // Local Temp Table 생성
            jdbc.execute(v_sql_createTable.toString());

            // Local Temp Table에 insert
            List<Object[]> batch = new ArrayList<Object[]>();
            if(!v_values.isEmpty() && v_values.size() > 0){
                for(VpMaterialValue v_inRow : v_values){
                    
                    //if(log.isDebugEnabled()) log.debug("### VpMaterialValue array ###["+v_inRow.get("material_code")+"]###["+v_inRow.get("supplier_code")+"]###["+v_inRow.get("item_serial_no")+"]###["+v_inRow.get("attr_value")+"]###");
                    Object[] values = new Object[] {
                        v_params.getTenantId()
                        , v_params.getCompanyCode()
                        , v_params.getOrgTypeCode()
                        , v_params.getOrgCode()
                        , v_params.getVendorPoolCode()

                        , v_inRow.get("material_code")
                        , v_inRow.get("supplier_code")
                        , Integer.parseInt((String)v_inRow.get("item_serial_no"))
                        , v_inRow.get("attr_value")
                        , sppUserSession.getUserId() // "procSaveId"   // 세션 ID로 처리
                    };

                    //for(Object sObj : values) if(log.isDebugEnabled()) log.debug("######### array ###{}###", sObj);
                    batch.add(values);
                }
            }

            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);
            //for(int iInsrtCnt : updateCounts) if(log.isDebugEnabled()) log.debug("### [2-1] array ###{}###", iInsrtCnt);

            // Procedure Call
            List<Map<String, String>> rsltList = new ArrayList<Map<String, String>>();
            SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<Map<String, String>>() {
                @Override
                public Map<String, String> mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    Map<String, String> rsltMap = new HashMap<String, String>();
                    rsltMap.put("return_code", v_rs.getString("return_code"));
                    rsltMap.put("return_msg", v_rs.getString("return_msg"));

                    rsltList.add(rsltMap);  // 결과값 Return;

                    return rsltMap;
                }
            });

            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(oTable);

            Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                @Override
                public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                    CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                    return callableStatement;
                }
            }, paramList);

            String rsltCd = "999";
            String rsltMesg = "DB Procedure process Error.";
            for(Map<String, String> rtnRow : rsltList){
                if(log.isDebugEnabled()) log.debug("### Procedure Return Code #{}#", rtnRow.get("return_code"));
			    if ("00000".equals((String)rtnRow.get("return_code"))) {
			        rsltCd = "000";
			        rsltMesg = "SUCCESS";
			        break;
			    } else { 
			        rsltCd = (String)rtnRow.get("return_code");
			        rsltMesg = "DB Procedure process STEP Error.";
                }
			}
            // rsltList<Map<String, String>>의 마지막Row "return_code"가 '00000'이 아니면 Procedure Error로 판단.
            rsltInfoMap.put("procRslt", rsltList);  // Procedure Result

            rtnRslt.setRsltCd(rsltCd);
            rtnRslt.setRsltMesg(rsltMesg);

		} catch (Exception e) {
            e.printStackTrace();

            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("Exception Fail...");
		} finally {
            // Local Temp Table DROP
            try { jdbc.execute(v_sql_dropable); } catch(Exception ex) {}

            try { rtnRslt.setRsltInfo(oMapper.writeValueAsString(rsltInfoMap)); } catch(Exception ex) {}  // result 추가JSON 정보
            context.setResult(rtnRslt);
			context.setCompleted();
		}

    }

    // VendorPool Category Item Mapping 프로시져 array건 처리
    @Transactional(rollbackFor = SQLException.class)
    @On(event=MdVpMappingItemMultiProcContext.CDS_NAME)
	public void onMdVpMappingItemMultiProc(MdVpMappingItemMultiProcContext context) {

		if(log.isDebugEnabled()) log.debug("### onMdVpMappingItemMultiProc array건 처리 [On] ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("ORG_TYPE_CODE NVARCHAR(30), ")
									.append("ORG_CODE NVARCHAR(10), ")
									.append("SPMD_CATEGORY_CODE NVARCHAR(4), ")
									.append("SPMD_CHARACTER_CODE NVARCHAR(4), ")
									.append("SPMD_CHARACTER_SERIAL_NO BIGINT, ")
									.append("VENDOR_POOL_CODE NVARCHAR(20), ")
									.append("UPDATE_USER_ID NVARCHAR(255) ")
								.append(")");
        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM";
		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL PG_MD_VENDOR_POOL_MAPPING_ITEM_MULTI_PROC( I_TABLE => #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM, O_TABLE => ? )";

        // Result return
        ReturnRslt rtnRslt = ReturnRslt.create();
        Map<String, Object> rsltInfoMap = new HashMap<String, Object>();
        ObjectMapper oMapper = new ObjectMapper();
        // Array건 입력값
        Collection<MdVpMappingItemProcType> v_inRows = context.getItems();

		try {

            // Commit Option
            jdbc.execute(v_sql_commitOption);
            // Local Temp Table 생성
            jdbc.execute(v_sql_createTable.toString());

            // Local Temp Table에 insert
            List<Object[]> batch = new ArrayList<Object[]>();
            if(!v_inRows.isEmpty() && v_inRows.size() > 0){
                for(MdVpMappingItemProcType v_inRow : v_inRows){
                    Object[] values = new Object[] {
                        v_inRow.get("tenant_id")
                        , v_inRow.get("company_code")
                        , v_inRow.get("org_type_code")
                        , v_inRow.get("org_code")
                        , v_inRow.get("spmd_category_code")
                        , v_inRow.get("spmd_character_code")
                        , v_inRow.get("spmd_character_serial_no")
                        , v_inRow.get("vendor_pool_code")
                        , sppUserSession.getUserId() // "procMultiId"   // 세션 ID로 처리
                    };

                    //for(Object sObj : values) if(log.isDebugEnabled()) log.debug("### array ###["+sObj+"]###");
                    batch.add(values);
                }
            }

            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);
            //for(int iInsrtCnt : updateCounts) if(log.isDebugEnabled()) log.debug("### [2-1] array ###["+iInsrtCnt+"]###");

            // Procedure Call
            List<CommonReturnType> rsltList = new ArrayList<CommonReturnType>();
            SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<CommonReturnType>() {
                @Override
                public CommonReturnType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    CommonReturnType v_row = CommonReturnType.create();

                    // 처리결과 Return;
                    v_row.setReturnCode(v_rs.getString("return_code"));
                    v_row.setReturnMsg(v_rs.getString("return_msg"));

                    rsltList.add(v_row);  // 결과값 Return;

                    return v_row;
                }
            });

            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(oTable);

            Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                @Override
                public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                    CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                    return callableStatement;
                }
            }, paramList);

            String rsltCd = "999";
            String rsltMesg = "DB Procedure process Error.";
            for(CommonReturnType rtnRow : rsltList){
                if(log.isDebugEnabled()) log.debug("### Procedure Return Code {} ", rtnRow.getReturnCode());
			    if ("00000".equals(rtnRow.getReturnCode())) {
			        rsltCd = "000";
			        rsltMesg = "SUCCESS";
			        break;
			    } else { 
			        rsltCd = rtnRow.getReturnCode();
			        rsltMesg = "DB Procedure process STEP Error.";
                }
			}
            // rsltList<CommonReturnType>의 마지막Row getReturnCode()가 '00000'이 아니면 Procedure Error로 판단.
            rsltInfoMap.put("procRslt", rsltList);  // Procedure Result

            rtnRslt.setRsltCd(rsltCd);
            rtnRslt.setRsltMesg(rsltMesg);

		} catch (Exception e) {
            e.printStackTrace();

            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("Exception Fail...");
		} finally {
            // Local Temp Table DROP
            try { jdbc.execute(v_sql_dropable); } catch(Exception ex) {}

            try { rtnRslt.setRsltInfo(oMapper.writeValueAsString(rsltInfoMap)); } catch(Exception ex) {}  // result 추가JSON 정보
            context.setResult(rtnRslt);
			context.setCompleted();
		}

	}

    // VendorPool Category Item Mapping 상태처리 프로시져 array건 처리
    @Transactional(rollbackFor = SQLException.class)
	@On(event=MdVpMappingStatusMultiProcContext.CDS_NAME)
	public void onMdVpMappingStatusMultiProc(MdVpMappingStatusMultiProcContext context) {

		if(log.isDebugEnabled()) log.debug("### onMdVpMappingStatusMultiProc array건 처리 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
		// local Temp table은 테이블명이 #(샵) 으로 시작해야 함
		StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS ( ")
									.append("TENANT_ID NVARCHAR(5), ")
									.append("COMPANY_CODE NVARCHAR(10), ")
									.append("ORG_TYPE_CODE NVARCHAR(30), ")
									.append("ORG_CODE NVARCHAR(10), ")
									.append("VENDOR_POOL_CODE NVARCHAR(20), ")
									.append("CONFIRMED_STATUS_CODE NVARCHAR(3), ")
									.append("UPDATE_USER_ID NVARCHAR(500) ")
								.append(")");
        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS";
		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS VALUES (?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL PG_MD_VENDOR_POOL_MAPPING_STATUS_MULTI_PROC( I_TABLE => #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS, O_TABLE => ? )";

        // Result return
        //Collection<ReturnRslt> v_result = new ArrayList<>();
        ReturnRslt rtnRslt = ReturnRslt.create();
        Map<String, Object> rsltInfoMap = new HashMap<String, Object>();
        ObjectMapper oMapper = new ObjectMapper();
        // Array건 입력값
        Collection<MdVpMappingStatusProcType> v_inRows = context.getItems();

        try {
            // Commit Option
            jdbc.execute(v_sql_commitOption);
            // Local Temp Table 생성
            jdbc.execute(v_sql_createTable.toString());

            // Local Temp Table에 insert
            List<Object[]> batch = new ArrayList<Object[]>();
            if(!v_inRows.isEmpty() && v_inRows.size() > 0){
                for(MdVpMappingStatusProcType v_inRow : v_inRows){
                    Object[] values = new Object[] {
                        v_inRow.get("tenant_id")
                        , v_inRow.get("company_code")
                        , v_inRow.get("org_type_code")
                        , v_inRow.get("org_code")
                        , v_inRow.get("vendor_pool_code")
                        , "300"             // 100:신규(최초), 200:저장, 300:확정(품위결제)
                        , sppUserSession.getUserId() // "UpdateMultiId"   // 세션 ID로 처리
                    };

                    batch.add(values);
                }
            }

            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);
            
            // Procedure Call
            List<CommonReturnType> rsltList = new ArrayList<CommonReturnType>();
            SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<CommonReturnType>() {
                @Override
                public CommonReturnType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    CommonReturnType v_row = CommonReturnType.create();
                    
                    // 처리결과 Return;
                    v_row.setReturnCode(v_rs.getString("return_code"));
                    v_row.setReturnMsg(v_rs.getString("return_msg"));

                    rsltList.add(v_row);  // 결과값 Return;

                    return v_row;
                }
            });

            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            paramList.add(oTable);

            Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
                @Override
                public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                    CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                    return callableStatement;
                }
            }, paramList);

            String rsltCd = "999";
            String rsltMesg = "DB Procedure process Error.";
            for(CommonReturnType rtnRow : rsltList){
                if(log.isDebugEnabled()) log.debug("### Procedure Return Code {} ", rtnRow.getReturnCode());        
			    if ("00000".equals(rtnRow.getReturnCode())) {
			        rsltCd = "000";
			        rsltMesg = "SUCCESS";
			        break;
			    } else { 
			        rsltCd = rtnRow.getReturnCode();
			        rsltMesg = "DB Procedure process STEP Error.";
                }
			}
            // rsltList<CommonReturnType>의 마지막Row getReturnCode()가 '00000'이 아니면 Procedure Error로 판단.
            rsltInfoMap.put("procRslt", rsltList);  // Procedure Result

            rtnRslt.setRsltCd(rsltCd);
            rtnRslt.setRsltMesg(rsltMesg);

		}catch (Exception e) {
            e.printStackTrace();

            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("Exception Fail...");
		} finally {
            // Local Temp Table DROP
            try { jdbc.execute(v_sql_dropable); } catch(Exception ex) {}

            try { rtnRslt.setRsltInfo(oMapper.writeValueAsString(rsltInfoMap)); } catch(Exception ex) {}  // result 추가JSON 정보
            context.setResult(rtnRslt);
			context.setCompleted();
		}
	}


	// Vendor Pool Item매핑 목록
	@After(event = CdsService.EVENT_READ, entity=MdVpMappingItemView_.CDS_NAME)
	public void readAfterMdVpMappingItemViewProc(List<MdVpMappingItemView> lists) {

		if(log.isDebugEnabled()) log.debug("### readAfterMdVpMappingItemViewProc Read [After] ###");

        /*
        // DB Function에서 가공 처리
		if(!lists.isEmpty() && lists.size() > 0) {
			for(MdVpMappingItemView list : lists) {
					list = setVpItemMappingAttr(list);
			}
        }
        */
    }

	/**
	* Map을 Vo로 변환
	* @param map
	* @param obj
	* @return
	*/
	public Object mapToObject(Map<String, Object> map, Object obj){
		String keyAttribute = null;
		String setMethodString = "set";
		String methodString = null;
		Iterator itr = map.keySet().iterator();

		while(itr.hasNext()){
			keyAttribute = (String) itr.next();
			methodString = setMethodString+keyAttribute.substring(0,1).toUpperCase()+keyAttribute.substring(1);
			Method[] methods = obj.getClass().getDeclaredMethods();
			for(int i=0;i<methods.length;i++){
				if(methodString.equals(methods[i].getName())){
					try{
						methods[i].invoke(obj, map.get(keyAttribute));
					}catch(Exception e){
						e.printStackTrace();
					}
				}
			}
		}
		return obj;
	}

	/**
	* 특정 변수를 제외해서 vo를 map형식으로 변환해서 반환.
	* @param vo VO
	* @param arrExceptList 제외할 property 명 리스트
	* @return
	* @throws Exception
	*/
	public Map<String, Object> objectToMap(Object vo, String[] arrExceptList) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			BeanInfo info = Introspector.getBeanInfo(vo.getClass());
			for (PropertyDescriptor pd : info.getPropertyDescriptors()) {
				Method reader = pd.getReadMethod();
				if (reader != null) {
					if(arrExceptList != null && arrExceptList.length > 0 && isContain(arrExceptList, pd.getName())) continue;
					result.put(pd.getName(), reader.invoke(vo));
				}
			}
		} catch (Exception ex) { ex.printStackTrace(); }
		return result;
	}

	public Boolean isContain(String[] arrList, String name) {
		for (String arr : arrList) {
			if (StringUtils.contains(arr, name))
				return true;
		}
		return false;
	}

	// 건별 attr parsing
	private MdVpMappingItemView setVpItemMappingAttr (MdVpMappingItemView list) {
		//if(log.isDebugEnabled()) log.debug("### setVpItemMappingAttr ###");

		Map<String, Object> hMap = new HashMap<String, Object>();
		hMap = objectToMap(list, null);

		String[] arrStr = new String[300];
		int iColCnt = 0;
		for (int i=1; i<=300; i++) {
			String sFillZeroNo = StringUtil.getFillZero(String.valueOf(i), 3);
			if("Y".equals(hMap.get("spmdAttr"+sFillZeroNo))) {
				 arrStr[iColCnt++] = StringUtils.defaultString((String) hMap.get("spmdAttrInfo"+sFillZeroNo), "");
			}
			// Attr init
			hMap.put("spmdAttr"+sFillZeroNo, "");
			hMap.put("spmdAttrInfo"+sFillZeroNo, "");
		}

		// reSet Value
		for (int i=1; i<=iColCnt; i++) {
			String sFillZeroNo = StringUtil.getFillZero(String.valueOf(i), 3);
			hMap.put("spmdAttr"+sFillZeroNo, "Y");
			hMap.put("spmdAttrInfo"+sFillZeroNo, arrStr[i-1]);
		}

		return (MdVpMappingItemView) mapToObject(hMap, list);

    }


    

/*    

    // VendorPool Category Item Mapping 프로시져 array건 처리
    @Transactional(rollbackFor = SQLException.class)
    @On(event=MdVpMappingItemViewProcContext.CDS_NAME)
	public void getMdMappingItemViewProcList(MdVpMappingItemViewProcContext context) {

        if(log.isDebugEnabled()) log.debug("### onMdVpMappingItemMultiProc array건 처리 [On] ###");

        
        // Array건 입력값
        //Collection<MdVpMappingItemProcType> v_inRows = context.getItems();
        //Collection<DynamicParamType> param = context.get.getParams();

        //if(log.isDebugEnabled()) log.debug("### [0] ###"+param.getLanguageCode()+"###");

        // Result return
        MdVpMappingItemViewData rtnRsltData = MdVpMappingItemViewData.create();

        // Result return
        //DynamicTitle rtnTitleRslt = DynamicTitle.create();
        //DynamicRecord rtnBodyRslt = DynamicRecord.create();


        int iTotColCnt = 6+20;  // 전체Title수 (기본Title수 + 가변Title수)
        int iRowCnt = 10;       // 전체 Row수
        
        List<DynamicTitle> listTitles = new ArrayList<>();

        for(int i=0; i<iTotColCnt; i++){

            DynamicTitle column = DynamicTitle.create();

            if(i == 0){
                column.setColId("NO");
                column.setLabel("No");
            }else if(i == 1){
                column.setColId("VPLVL1");
                column.setLabel("VP Lvl1");
            }else if(i == 2){
                column.setColId("VPLVL2");
                column.setLabel("VP Lvl2");
            }else if(i == 3){
                column.setColId("VPLVL3");
                column.setLabel("VP Lvl3");
            }else if(i == 4){
                column.setColId("TEAM");
                column.setLabel("구매팀");
            }else if(i == 5){
                column.setColId("STATUS");
                column.setLabel("상태");
            }else{
                column.setColId("CELLID" + (i-5));
                column.setLabel("관리항목" + (i-5));
            }

            listTitles.add(column);
        }

        rtnRsltData.setTitles(listTitles);

        if(log.isDebugEnabled()) log.debug("### [1] ###"+listTitles.size()+"###");

        List<DynamicRecord> listRecords = new ArrayList<>();
        for(int rowNo=0; rowNo<iRowCnt; rowNo++){ // Select Data Row Count

            List<String> colIds = new ArrayList<>();
            List<String> values = new ArrayList<>();

            for(int i=0; i<iTotColCnt; i++){

                if(i == 0){
                    colIds.add("NO");
                    values.add("NO-"+rowNo);
                }else if(i == 1){
                    colIds.add("VPLVL1");
                    values.add(rowNo+"-VP Lvl1-값");
                }else if(i == 2){
                    colIds.add("VPLVL2");
                    values.add(rowNo+"-VP Lvl2-값");
                }else if(i == 3){
                    colIds.add("VPLVL3");
                    values.add(rowNo+"-VP Lvl3-값");
                }else if(i == 4){
                    colIds.add("TEAM");
                    values.add(rowNo+"-구매팀-값");
                }else if(i == 5){
                    colIds.add("STATUS");
                    values.add(rowNo+"-상태-값");
                }else{
                    colIds.add("CELLID" + (i-5));
                    values.add(rowNo+"데이터 값" + (i-5));
                }

            }

            DynamicRecord recordData = DynamicRecord.create();
            recordData.setColIds(colIds);
            recordData.setValues(values);
            
            listRecords.add(recordData);
        }
        rtnRsltData.setRecords(listRecords);

        if(log.isDebugEnabled()) log.debug("### [2] ###"+listRecords.size()+"###");
        

        context.setResult(rtnRsltData);
        context.setCompleted();
        
    }
*/
}