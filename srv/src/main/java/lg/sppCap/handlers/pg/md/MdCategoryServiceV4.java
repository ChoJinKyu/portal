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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

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
	@On(event=MdVpMappingItemMultiProcContext.CDS_NAME)
	public void onMdVpMappingItemMultiProc(MdVpMappingItemMultiProcContext context) {

		log.info("### onMdVpMappingItemMultiProc array건 처리 [On] ###");

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
									.append("UPDATE_USER_ID NVARCHAR(500) ")
								.append(")");

		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL PG_MD_VENDOR_POOL_MAPPING_ITEM_MULTI_PROC( I_TABLE => #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM, O_RTN_MESG => ? )";

		Collection<MdVpMappingItemProcType> v_inRows = context.getItems();
        ReturnRslt rtnRslt = ReturnRslt.create();
        ObjectMapper oMapper = new ObjectMapper();
        Map<String, Object> rsltInfoMap = new HashMap<String, Object>();

		try {

			Connection conn = jdbc.getDataSource().getConnection();

			// Local Temp Table 생성
			PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
			v_statement_table.execute();

			// Local Temp Table에 insert
			PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

			if(!v_inRows.isEmpty() && v_inRows.size() > 0){
				for(MdVpMappingItemProcType v_inRow : v_inRows){

					log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getOrgTypeCode()+"###"+v_inRow.getOrgCode()+"###"+v_inRow.getSpmdCategoryCode()+"###"+v_inRow.getSpmdCharacterCode()+"###"+v_inRow.getSpmdCharacterSerialNo()+"###"+v_inRow.getVendorPoolCode()+"###");

					v_statement_insert.setString(1, v_inRow.getTenantId());
					v_statement_insert.setString(2, v_inRow.getCompanyCode());
					v_statement_insert.setString(3, v_inRow.getOrgTypeCode());
					v_statement_insert.setString(4, v_inRow.getOrgCode());
					v_statement_insert.setString(5, v_inRow.getSpmdCategoryCode());
					v_statement_insert.setString(6, v_inRow.getSpmdCharacterCode());
					v_statement_insert.setLong(7, v_inRow.getSpmdCharacterSerialNo());
					v_statement_insert.setString(8, v_inRow.getVendorPoolCode());
					v_statement_insert.setString(9, "multiMappUserId");	//TODO:세션 ID로 처리
					//v_statement_insert.executeUpdate();
					v_statement_insert.addBatch();
				}
				// Temp Table에 Multi건 등록
				v_statement_insert.executeBatch();
			}

			// Procedure Call
			CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            int iCnt = v_statement_proc.executeUpdate();
                        
            // Temp Table Drop처리
            Statement stmt = conn.createStatement();
            String v_sql_dropTable = "DROP TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_ITEM";
            stmt.executeUpdate(v_sql_dropTable);
            stmt.close();

            rsltInfoMap.put("procCnt", iCnt);

            rtnRslt.setRsltCd("000");
            rtnRslt.setRsltMesg("SUCCESS");

            v_statement_table.close();
            v_statement_insert.close();
            v_statement_proc.close();
            conn.close();
		} catch (SQLException sqlE) {
            sqlE.printStackTrace();
            
            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("SQLException Fail...");

		} catch (Exception e) {
            e.printStackTrace();
            
            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("Exception Fail...");
		} finally {
            try { rtnRslt.setRsltInfo(oMapper.writeValueAsString(rsltInfoMap)); } catch(Exception ex) {}  // result 추가JSON 정보 
            context.setResult(rtnRslt);
			context.setCompleted();
		}

	}

	// VendorPool Category Item Mapping 상태처리 프로시져 array건 처리
	@On(event=MdVpMappingStatusMultiProcContext.CDS_NAME)
	public void onMdVpMappingStatusMultiProc(MdVpMappingStatusMultiProcContext context) {

		log.info("### onMdVpMappingStatusMultiProc array건 처리 ###");

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

		String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS VALUES (?, ?, ?, ?, ?, ?, ?)";
		String v_sql_callProc = "CALL PG_MD_VENDOR_POOL_MAPPING_STATUS_MULTI_PROC( I_TABLE => #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS, O_RTN_MESG => ? )";

		Collection<MdVpMappingStatusProcType> v_inRows = context.getItems();
        ReturnRslt rtnRslt = ReturnRslt.create();
        ObjectMapper oMapper = new ObjectMapper();
        Map<String, Object> rsltInfoMap = new HashMap<String, Object>();

		try {

			Connection conn = jdbc.getDataSource().getConnection();

			// Local Temp Table 생성
			PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
			v_statement_table.execute();

			// Local Temp Table에 insert
			PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

			if(!v_inRows.isEmpty() && v_inRows.size() > 0){
				for(MdVpMappingStatusProcType v_inRow : v_inRows){
					
					log.info("###"+v_inRow.getTenantId()+"###"+v_inRow.getCompanyCode()+"###"+v_inRow.getOrgTypeCode()+"###"+v_inRow.getOrgCode()+"###"+v_inRow.getVendorPoolCode()+"###");

					v_statement_insert.setString(1, v_inRow.getTenantId());
					v_statement_insert.setString(2, v_inRow.getCompanyCode());
					v_statement_insert.setString(3, v_inRow.getOrgTypeCode());
					v_statement_insert.setString(4, v_inRow.getOrgCode());
					v_statement_insert.setString(5, v_inRow.getVendorPoolCode());
					v_statement_insert.setString(6, "300");				//  100:신규(최초), 200:저장, 300:확정(품위결제)
					v_statement_insert.setString(7, "UpdateMultiId");	//TODO:세션 ID로 처리
					//v_statement_insert.executeUpdate();
					v_statement_insert.addBatch();
				}
				// Temp Table에 Multi건 등록
				int[] iCnt = v_statement_insert.executeBatch();
			}

			// Procedure Call
			CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            int iCnt = v_statement_proc.executeUpdate();
                        
            // Temp Table Drop처리
            Statement stmt = conn.createStatement();
            String v_sql_dropTable = "DROP TABLE #LOCAL_TEMP_PG_MD_VP_MAPPING_STATUS";
            stmt.executeUpdate(v_sql_dropTable);
            stmt.close();
            
            rsltInfoMap.put("procCnt", iCnt);

            rtnRslt.setRsltCd("000");
            rtnRslt.setRsltMesg("SUCCESS");

            v_statement_table.close();
            v_statement_insert.close();
            v_statement_proc.close();
            conn.close();
		} catch (SQLException sqlE) {
            sqlE.printStackTrace();
            
            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("SQLException Fail...");

		} catch (Exception e) {
            e.printStackTrace();
            
            rtnRslt.setRsltCd("999");
            rtnRslt.setRsltMesg("Exception Fail...");
		} finally {
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