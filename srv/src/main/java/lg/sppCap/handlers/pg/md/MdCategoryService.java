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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.changeset.ChangeSetListener;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import lg.sppCap.util.StringUtil;

import cds.gen.pg.mdcategoryservice.*;

@Component
@ServiceName("pg.MdCategoryService")
public class MdCategoryService implements EventHandler {

	private static final Logger log = LogManager.getLogger();

	@Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(MdCategoryService_.CDS_NAME)
    private CdsService mdCategoryService;
    
    // Multi Key값 Count
    private int iMultiArrayCnt = 0;

	// 카테고리 Id 저장 전
	@Before(event=CdsService.EVENT_CREATE, entity=MdCategory_.CDS_NAME)
	public void createBeforeMdCategoryIdProc(List<MdCategory> cateIds) {

		Instant current = Instant.now();

		log.info("### ID Insert... [Before] ###");

		if(!cateIds.isEmpty() && cateIds.size() > 0){

			String cateCode = "";

			for(MdCategory cateId : cateIds) {

                cateCode = cateId.getSpmdCategoryCode();

                if (StringUtils.isEmpty(cateCode)) {

                    cateId.setLocalCreateDtm(current);
                    cateId.setLocalUpdateDtm(current);

                    // DB처리
                    try {
                        // Category 범주코드 사업본부별 신규채번
                        StringBuffer v_sql_get_query = new StringBuffer();

                        v_sql_get_query.append(" SELECT ")
                            .append("		IFNULL(MAX(SUBSTRING(SPMD_CATEGORY_CODE,2)), 0)+1 AS MAX_COUNT ")
                            .append("	FROM PG_MD_CATEGORY_ID ")
                            .append("	WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? ");                        
                
                        int iMaxCount = jdbc.queryForObject(v_sql_get_query.toString()
																, new Object[] {
																	cateId.getTenantId()
																	, cateId.getCompanyCode()
																	, cateId.getOrgTypeCode()
																	, cateId.getOrgCode()
                                                                }
																, Integer.class);
						iMultiArrayCnt = (iMultiArrayCnt > 0) ? iMultiArrayCnt+1 : iMaxCount;

						cateCode = "C"+StringUtil.getFillZero(String.valueOf(iMultiArrayCnt), 3);

                        log.info("###[LOG-10]=> ["+cateCode+"]");

                    } catch (Exception ex) {
                        ex.printStackTrace();
                        log.error("### ErrMesg : "+ex.getMessage()+"###");
                    } finally {

                    }
                    //log.info("###[LOG-11]=> ["+cateCode+"]");
                    cateId.setSpmdCategoryCode(cateCode);
                }
            }
        }

	}

    // 카테고리 Id 저장
    /*
	@On(event={CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
	public void createOnMdCategoryIdProc(List<MdCategory> cateId) {
		log.info("### Id Insert [On] ###");
    }
    */

	// 카테고리 Id 저장 후
	@After(event={CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
	public void createAfterMdCategoryIdProc(List<MdCategory> cateId) {
		log.info("### Id Insert [After] ###");
	}


	// 카테고리 Id 수정 전
	@Before(event=CdsService.EVENT_UPDATE, entity=MdCategory_.CDS_NAME)
	public void updateBeforeMdCategoryIdProc(List<MdCategory> cateIds) {
        log.info("### ID Update... [Before] ###");
/*
		Instant current = Instant.now();
		for(MdCategory cateId : cateIds) {
			cateId.setLocalUpdateDtm(current);
		}
*/
	}


	// 카테고리 Id 수정 후
	@After(event=CdsService.EVENT_UPDATE, entity=MdCategory_.CDS_NAME)
	public void updateAfterMdCategoryIdProc(List<MdCategory> cateIds) {
		log.info("### ID Update... [After] ###");
/*
		Instant current = Instant.now();
		for(MdCategory cateId : cateIds) {
			cateId.setLocalUpdateDtm(current);
		}
*/
    }
    
	// 카테고리 Id / Item 읽기 전
	@Before(event=CdsService.EVENT_READ, entity={MdCategory_.CDS_NAME, MdCategoryItem_.CDS_NAME})
	public void readBeforeMdCategoryAndItemProc(EventContext context) {
        iMultiArrayCnt=0; // 초기화
		log.info("### ID/ITEM Read... [Before] ###"+context.getEvent()+"###"+context.getModel().toString()+"###"+context.getUserInfo()+"###");
    }
    
    // 카테고리 Id / Item 저장   
    @On(event={CdsService.EVENT_CREATE}, entity={MdCategory_.CDS_NAME, MdCategoryItem_.CDS_NAME})
    public void createOnMdCategoryAndItemProc(CdsCreateEventContext context) { 
        log.info("### ID/ITEM Insert [On] ###");
    
        ChangeSetContext changeSet = context.getChangeSetContext();
        changeSet.register(new ChangeSetListener() {

            @Override
            public void beforeClose() {
                // do something before changeset is closed
                log.info("### Item Insert [On] - beforeClose() ###");
            }

            @Override
            public void afterClose(boolean completed) {
                // do something after changeset is closed
                log.info("### Item Insert [On] - afterClose()-1 ###["+completed+"]###["+iMultiArrayCnt+"]###");
            }

        });
    }

	// 카테고리 삭제 전
	@Before(event=CdsService.EVENT_DELETE, entity=MdCategory_.CDS_NAME)
    public void deleteBeforeMdCategoryIdProc(CdsDeleteEventContext context) {
        log.info("### ID Delete [Before] ###");
        
        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> param = result.targetValues();

        log.info("###"+param.get("tenant_id")+"###"+param.get("company_code")+"###"+param.get("org_type_code")+"###"+param.get("org_code")+"###"+param.get("spmd_category_code")+"###");
        
        // Category 범주코드 삭제시 Item등록여부체크
        StringBuffer v_sql_get_query = new StringBuffer();

        v_sql_get_query.append(" SELECT ")
            .append("		COUNT(*) AS CNT ")
            .append("	FROM PG_MD_CATEGORY_ITEM ")
            .append("	WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? AND SPMD_CATEGORY_CODE=? ");                        

        int iCnt = jdbc.queryForObject(v_sql_get_query.toString()
                                                , new Object[] {
                                                    param.get("tenant_id")
                                                    , param.get("company_code")
                                                    , param.get("org_type_code")
                                                    , param.get("org_code")
                                                    , param.get("spmd_category_code")
                                                }
                                                , Integer.class);

        log.info("###[LOG-10]=> ["+iCnt+"]");
        if (iCnt > 0) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Category 범주에 등록된 Item특성이 존재하여 삭제할 수 없습니다.");
        } else {
            // Multi Language Delete
            MdCategoryLng filter = MdCategoryLng.create();
            filter.setTenantId((String) param.get("tenant_id"));
            filter.setCompanyCode((String) param.get("company_code"));
            filter.setOrgTypeCode((String) param.get("org_type_code"));
            filter.setOrgCode((String) param.get("org_code"));
            filter.setSpmdCategoryCode((String) param.get("spmd_category_code"));
            CqnDelete delete = Delete.from(MdCategoryLng_.CDS_NAME).matching(filter);
            Result rslt = mdCategoryService.run(delete);
        }
        log.info("###[LOG-11]=> ["+iCnt+"]");
    }

	/*
	**********************************
	*** 카테고리 Item Event 처리
	**********************************
    */
	// 카테고리 Item 저장 전
	@Before(event=CdsService.EVENT_CREATE, entity=MdCategoryItem_.CDS_NAME)
	public void createBeforeMdCategoryItemProc(EventContext context, List<MdCategoryItem> items) {

		log.info("### Item Insert [Before] ###");
		//log.info("###"+items.toString()+"###");

		if(!items.isEmpty() && items.size() > 0){

			Instant current = Instant.now();

			String cateCode = "";
			String charCode = "";
			int iCharSerialNo = 0;

			for (MdCategoryItem item : items) {

				//log.info("###"+item.toString()+"###");

				item.setLocalCreateDtm(current);
				item.setLocalUpdateDtm(current);
				//item.setCreateUserId("guest");
				//item.setUpdateUserId("guest");

				cateCode = item.getSpmdCategoryCode();
				charCode = item.getSpmdCharacterCode();

				if (StringUtils.isEmpty(charCode)) {

					// DB처리
					try {

						// Item 특성코드 신규채번
                        StringBuffer v_sql_get_query = new StringBuffer();

                        v_sql_get_query.append(" SELECT ")
                            .append("		IFNULL(MAX(SPMD_CHARACTER_SERIAL_NO), 0)+1 AS CHAR_SERIAL_NO ")
                            .append("	FROM PG_MD_CATEGORY_ITEM ")
                            .append("	WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? ");                        
                
                        iCharSerialNo = jdbc.queryForObject(v_sql_get_query.toString()
																, new Object[] {
																	item.getTenantId()
																	, item.getCompanyCode()
																	, item.getOrgTypeCode()
																	, item.getOrgCode()
                                                                }
																, Integer.class);

						iMultiArrayCnt = (iMultiArrayCnt > 0) ? iMultiArrayCnt+1 : iCharSerialNo;

						charCode = "T"+StringUtil.getFillZero(String.valueOf(iMultiArrayCnt), 3);

						//log.info("###[LOG-10]=> ["+charCode+"] ["+iCharSerialNo+"] ["+new Long(iMultiArrayCnt)+"]");

					} catch (Exception ex) {
                        ex.printStackTrace();
                        log.error("### ErrMesg : "+ex.getMessage()+"###");
                    } finally {

                    }
                        
                    item.setSpmdCharacterCode(charCode);
                    item.setSpmdCharacterSerialNo(new Long(iMultiArrayCnt));
				}
				//charCode = item.getSpmdCharacterCode();
				log.info("###[LOG-11]=> ["+charCode+"] ["+iCharSerialNo+"] ["+new Long(iMultiArrayCnt)+"]");

			}
		}

	}


    // 카테고리 Item 저장
    /*
	@On(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
	public void createOnMdCategoryItemItemProc(List<MdCategoryItem> items) {
		log.info("### Item Insert [On] ###");
    }
    */

	// 카테고리 Item 저장 후
	@After(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
	public void createAfterMdCategoryItemProc(List<MdCategoryItem> items) {
		log.info("### Item Insert [After] ###");
	}


	// 카테고리 Item 수정 전
	@Before(event=CdsService.EVENT_UPDATE, entity=MdCategoryItem_.CDS_NAME)
	public void updateBeforeMdCategoryItemProc(List<MdCategoryItem> items) {

        log.info("### Item Update... [Before] ###");
        /*
		Instant current = Instant.now();
		for(MdCategoryItem item : items) {
			item.setLocalUpdateDtm(current);
        }
        */
	}


	// 카테고리 Item 수정 후
	@After(event=CdsService.EVENT_UPDATE, entity=MdCategoryItem_.CDS_NAME)
	public void updateAfterMdCategoryItemIdProc(List<MdCategoryItem> items) {
		log.info("### Item Update... [After] ###");
    }
    
	// 카테고리 Item 삭제 전
	@Before(event={CdsService.EVENT_DELETE}, entity=MdCategoryItem_.CDS_NAME)
	public void deleteBeforeMdCategoryItemItemProc(CdsDeleteEventContext context) {
        log.info("### Item Delete [Before] ###");

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> param = result.targetValues();

        log.info("###"+param.get("tenant_id")+"###"+param.get("company_code")+"###"+param.get("org_type_code")+"###"+param.get("org_code")+"###"+param.get("spmd_category_code")+"###"+param.get("spmd_character_code")+"###");
        
        // Item특성코드 삭제시 VendorPool-3별 Mapping 등록 유무 체크
        StringBuffer v_sql_get_query = new StringBuffer();

        v_sql_get_query.append(" SELECT ")
            .append("		COUNT(*) AS CNT ")
            .append("	FROM PG_MD_VP_ITEM_MAPPING_ATTR ")
            .append("	WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? AND SPMD_CATEGORY_CODE=? AND SPMD_CHARACTER_CODE=? ");                        

        int iCnt = jdbc.queryForObject(v_sql_get_query.toString()
                                                , new Object[] {
                                                    param.get("tenant_id")
                                                    , param.get("company_code")
                                                    , param.get("org_type_code")
                                                    , param.get("org_code")
                                                    , param.get("spmd_category_code")
                                                    , param.get("spmd_character_code")
                                                }
                                                , Integer.class);

        log.info("###[LOG-10]=> ["+iCnt+"]");
        if (iCnt > 0) {
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Vendor Pool에 Mapping된 Item특성이 존재하여 삭제할 수 없습니다.");
        } else {
            // Multi Language Delete
            MdCategoryItemLng filter = MdCategoryItemLng.create();
            filter.setTenantId((String) param.get("tenant_id"));
            filter.setCompanyCode((String) param.get("company_code"));
            filter.setOrgTypeCode((String) param.get("org_type_code"));
            filter.setOrgCode((String) param.get("org_code"));
            filter.setSpmdCategoryCode((String) param.get("spmd_category_code"));
            filter.setSpmdCharacterCode((String) param.get("spmd_character_code"));
            CqnDelete delete = Delete.from(MdCategoryItemLng_.CDS_NAME).matching(filter);
            mdCategoryService.run(delete);

        }
		log.info("###[LOG-11]=> ["+iCnt+"]");
    }

    

}