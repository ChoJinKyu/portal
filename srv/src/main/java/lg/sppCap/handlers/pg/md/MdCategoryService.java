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

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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

import cds.gen.pg.mdcategoryservice.*;

@Component
@ServiceName("pg.MdCategoryService")
public class MdCategoryService implements EventHandler {

	private static final Logger log = LogManager.getLogger();

	@Autowired
	private JdbcTemplate jdbc;

	// 카테고리 Id 저장 전
	@Before(event=CdsService.EVENT_CREATE, entity=MdCategory_.CDS_NAME)
	public void createBeforeMdCategoryIdProc(List<MdCategory> cateIds) {

		Instant current = Instant.now();

		log.info("### ID Insert... [Before] ###");

		if(!cateIds.isEmpty() && cateIds.size() > 0){

			String cateCode = "";

			for(MdCategory cateId : cateIds) {

				cateId.setLocalCreateDtm(current);
				cateId.setLocalUpdateDtm(current);

				// DB처리
				try {
					Connection conn = jdbc.getDataSource().getConnection();
					// Item SPMD범주코드 생성 Function
					PreparedStatement v_statement_select = conn.prepareStatement("SELECT PG_MD_CATEGORY_CODE_FUNC(?) AS CATE_CODE FROM DUMMY");
					v_statement_select.setObject(1, "");    // Category 채번 구분값 없음.
					ResultSet rslt = v_statement_select.executeQuery();
					if(rslt.next()) cateCode = rslt.getString("CATE_CODE");

					//log.info("###[LOG-10]=> ["+cateCode+"]");

				} catch (SQLException sqlE) {
					sqlE.printStackTrace();
					log.error("### ErrCode : "+sqlE.getErrorCode()+"###");
					log.error("### ErrMesg : "+sqlE.getMessage()+"###");
				}

				//log.info("###[LOG-11]=> ["+cateCode+"]");

				cateId.setSpmdCategoryCode(cateCode);
			}
		}

	}

	// 카테고리 Id 저장
	@On(event={CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
	public void createOnMdCategoryIdProc(List<MdCategory> cateId) {
		log.info("### Id Insert [On] ###");
	}

	// 카테고리 Id 저장 후
	@After(event={CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
	public void createAfterMdCategoryIdProc(List<MdCategory> cateId) {
		log.info("### Id Insert [After] ###");
	}


	// 카테고리 Id 수정 전
	@Before(event=CdsService.EVENT_UPDATE, entity=MdCategory_.CDS_NAME)
	public void updateBeforeMdCategoryIdProc(List<MdCategory> cateIds) {

		Instant current = Instant.now();

		log.info("### ID Update... [Before] ###");

		for(MdCategory cateId : cateIds) {
			cateId.setLocalUpdateDtm(current);
		}

	}


	// 카테고리 Id 수정 후
	@After(event=CdsService.EVENT_UPDATE, entity=MdCategory_.CDS_NAME)
	public void updateAfterMdCategoryIdProc(List<MdCategory> cateIds) {

		Instant current = Instant.now();

		log.info("### ID Update... [After] ###");

		for(MdCategory cateId : cateIds) {
			cateId.setLocalUpdateDtm(current);
		}

	}

	/*
	**********************************
	*** 카테고리 Item Event 처리
	**********************************
    */
    
	// 카테고리 Item 저장 전
	@Before(event=CdsService.EVENT_CREATE, entity=MdCategoryItem_.CDS_NAME)
	public void createBeforeMdCategoryItemProc(List<MdCategoryItem> items) {

		log.info("### Item Insert [Before] ###");
		//log.info("###"+items.toString()+"###");

		if(!items.isEmpty() && items.size() > 0){

			Instant current = Instant.now();

			String cateCode = "";
			String charCode = "";
			int charSerialNo = 0;

			for (MdCategoryItem item : items) {

				//log.info("###"+item.toString()+"###");

				item.setLocalCreateDtm(current);
				item.setLocalUpdateDtm(current);
				//item.setCreateUserId("guest");
				//item.setUpdateUserId("guest");

				cateCode = item.getSpmdCategoryCode();
				charCode = item.getSpmdCharacterCode();

				//if ("".equals(charCode) || charCode == null) {
				if (StringUtils.isEmpty(charCode)) {

					// DB처리
					try {

						Connection conn = jdbc.getDataSource().getConnection();

						// Item SPMD특성코드 생성 Function
						StringBuffer v_sql_get_code_fun = new StringBuffer();
						v_sql_get_code_fun.append("SELECT ")
							.append("   PG_MD_CHARACTER_CODE_FUNC(?) AS CHAR_CODE")
							.append("   , (SELECT IFNULL(MAX(SPMD_CHARACTER_SERIAL_NO), 0)+1 FROM PG_MD_CATEGORY_ITEM) AS CHAR_SERIAL_NO")
							.append(" FROM DUMMY");

						PreparedStatement v_statement_select = conn.prepareStatement(v_sql_get_code_fun.toString());
						v_statement_select.setObject(1, cateCode);

						ResultSet rslt = v_statement_select.executeQuery();

						if(rslt.next()) {
							charCode = rslt.getString("CHAR_CODE");
							charSerialNo = rslt.getInt("CHAR_SERIAL_NO");
						}

						log.info("###[LOG-10]=> ["+charCode+"] ["+charSerialNo+"] ["+new Long(charSerialNo)+"]");

					} catch (SQLException sqlE) {
						sqlE.printStackTrace();
						log.error("### ErrCode : "+sqlE.getErrorCode()+"###");
						log.error("### ErrMesg : "+sqlE.getMessage()+"###");
					}
				}

				//charCode = item.getSpmdCharacterCode();
				log.info("###[LOG-11]=> ["+charCode+"] ["+charSerialNo+"] ["+new Long(charSerialNo)+"]");

				item.setSpmdCharacterCode(charCode);
				item.setSpmdCharacterSerialNo(new Long(charSerialNo));

			}
		}

	}


	// 카테고리 Item 저장
	@On(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
	public void createOnMdCategoryItemItemProc(List<MdCategoryItem> items) {
		log.info("### Item Insert [On] ###");
	}

	// 카테고리 Item 저장 후
	@After(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
	public void createAfterMdCategoryItemProc(List<MdCategoryItem> items) {
		log.info("### Item Insert [After] ###");
	}


	// 카테고리 Item 수정 전
	@Before(event=CdsService.EVENT_UPDATE, entity=MdCategoryItem_.CDS_NAME)
	public void updateBeforeMdCategoryItemProc(List<MdCategoryItem> items) {

		Instant current = Instant.now();

		log.info("### Item Update... [Before] ###");

		for(MdCategoryItem item : items) {
			item.setLocalUpdateDtm(current);
		}

	}


	// 카테고리 Item 수정 후
	@After(event=CdsService.EVENT_UPDATE, entity=MdCategoryItem_.CDS_NAME)
	public void updateAfterMdCategoryItemIdProc(List<MdCategoryItem> items) {

		Instant current = Instant.now();

		log.info("### Item Update... [After] ###");

		for(MdCategoryItem item : items) {
			item.setLocalUpdateDtm(current);
		}

	}
	// 카테고리 Item 삭제 전
	@Before(event={CdsService.EVENT_DELETE}, entity=MdCategoryItem_.CDS_NAME)
	public void deleteBeforeMdCategoryItemItemProc(List<MdCategoryItem> items) {
		log.info("### Item Delete [Before] ###");
	}

	// 카테고리 Item 삭제
	@On(event={CdsService.EVENT_DELETE}, entity=MdCategoryItem_.CDS_NAME)
	public void deleteOnMdCategoryItemItemProc(List<MdCategoryItem> items) {
		log.info("### Item Delete [On] ###");
	}

	// 카테고리 Item 삭제 후
	@After(event={CdsService.EVENT_DELETE}, entity=MdCategoryItem_.CDS_NAME)
	public void deleteAfterMdCategoryItemProc(List<MdCategoryItem> items) {
		log.info("### Item Delete [After] ###");
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
			String sFillZeroNo = getFillZero(String.valueOf(i), 3);
			if("Y".equals(hMap.get("spmdAttr"+sFillZeroNo))) {
				 arrStr[iColCnt++] = StringUtils.defaultString((String) hMap.get("spmdAttrInfo"+sFillZeroNo), "");
			}
			// Attr init
			hMap.put("spmdAttr"+sFillZeroNo, "");
			hMap.put("spmdAttrInfo"+sFillZeroNo, "");
		}

		// reSet Value
		for (int i=1; i<=iColCnt; i++) {
			String sFillZeroNo = getFillZero(String.valueOf(i), 3);
			hMap.put("spmdAttr"+sFillZeroNo, "Y");
			hMap.put("spmdAttrInfo"+sFillZeroNo, arrStr[i-1]);
		}

		return (MdVpMappingItemView) mapToObject(hMap, list);

    }
    
	/**
	 *
	 * 전달받은 문자열에 지정된 길이에 맞게 0을 채운다
	 *
	 * @param des
	 * @param size
	 * @return
	 */
	private String getFillZero(String des, int size) {
		StringBuffer str = new StringBuffer();

		if (des == null) {
			for (int i = 0; i < size; i++)
				str.append("0");
			return str.toString();
		}

		if (des.trim().length() > size)
			return des.substring(0, size);
		else
			des = des.trim();

		int diffsize = size - des.length();

		for (int i = 0; i < diffsize; i++) {
			str = str.append("0");
		}

		str.append(des);

		return str.toString();
	}

}