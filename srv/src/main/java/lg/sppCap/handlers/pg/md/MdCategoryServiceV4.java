package lg.sppCap.handlers.pg.md;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Iterator;
import java.time.Instant;
import java.beans.Introspector;
import java.beans.BeanInfo;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import lg.sppCap.util.StringUtil;

import cds.gen.pg.mdcategoryv4service.*;

@Component
@ServiceName("pg.MdCategoryV4Service")
public class MdCategoryServiceV4 implements EventHandler {

	private static final Logger log = LogManager.getLogger();

	@Autowired
	private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(MdCategoryV4Service_.CDS_NAME)
    private CdsService mdCategoryV4Service;

    // VendorPool Category Item Mapping 프로시져 array건 처리
    @Transactional(rollbackFor = SQLException.class)
    @On(event=MdVpMappingItemMultiProcContext.CDS_NAME)
	public void onMdVpMappingItemMultiProc(MdVpMappingItemMultiProcContext context) {

		log.info("### onMdVpMappingItemMultiProc array건 처리 [On] ###");

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
                        , "procMultiId"   // TODO:세션 ID로 처리
                    };

                    //for(Object sObj : values) log.info("### array ###["+sObj+"]###");
                    batch.add(values);
                }
            }

            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);
            //for(int iInsrtCnt : updateCounts) log.info("### [2-1] array ###["+iInsrtCnt+"]###");

            // Procedure Call
            List<MdVpMappingItemProcType> rsltList = new ArrayList<MdVpMappingItemProcType>();
            SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<MdVpMappingItemProcType>() {
                @Override
                public MdVpMappingItemProcType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    MdVpMappingItemProcType v_row = MdVpMappingItemProcType.create();

                    v_row.setTenantId(v_rs.getString("tenant_id"));
                    v_row.setCompanyCode(v_rs.getString("company_code"));
                    v_row.setOrgTypeCode(v_rs.getString("org_type_code"));
                    v_row.setOrgCode(v_rs.getString("org_code"));
                    v_row.setVendorPoolCode(v_rs.getString("vendor_pool_code"));
                    v_row.setSpmdCategoryCode(v_rs.getString("spmd_category_code"));
                    v_row.setSpmdCharacterCode(v_rs.getString("spmd_character_code"));

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

            rsltInfoMap.put("procRslt", rsltList);  // Procedure Result

            rtnRslt.setRsltCd("000");
            rtnRslt.setRsltMesg("SUCCESS");

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

		log.info("### onMdVpMappingStatusMultiProc array건 처리 ###");

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
                        , "UpdateMultiId"   // TODO:세션 ID로 처리
                    };

                    batch.add(values);
                }
            }

            int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);

            // Procedure Call
            List<MdVpMappingStatusProcType> rsltList = new ArrayList<MdVpMappingStatusProcType>();
            SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<MdVpMappingStatusProcType>() {
                @Override
                public MdVpMappingStatusProcType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                    MdVpMappingStatusProcType v_row = MdVpMappingStatusProcType.create();

                    v_row.setTenantId(v_rs.getString("tenant_id"));
                    v_row.setCompanyCode(v_rs.getString("company_code"));
                    v_row.setOrgTypeCode(v_rs.getString("org_type_code"));
                    v_row.setOrgCode(v_rs.getString("org_code"));
                    v_row.setVendorPoolCode(v_rs.getString("vendor_pool_code"));
                    v_row.setConfirmedStatusCode(v_rs.getString("confirmed_status_code"));
                    v_row.setUpdateUserId(v_rs.getString("update_user_id"));

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

            rsltInfoMap.put("procRslt", rsltList);  // Procedure Result

            rtnRslt.setRsltCd("000");
            rtnRslt.setRsltMesg("SUCCESS");

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

		log.info("### readAfterMdVpMappingItemViewProc Read [After] ###");

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
		//log.info("### setVpItemMappingAttr ###");

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

}