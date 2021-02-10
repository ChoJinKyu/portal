package lg.sppCap.handlers.pg.md;

import java.util.List;
import java.util.Map;

import com.sap.cds.Result;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.pg.mdcategoryservice.MdCategory;
import cds.gen.pg.mdcategoryservice.MdCategoryItem;
import cds.gen.pg.mdcategoryservice.MdCategoryItemLng;
import cds.gen.pg.mdcategoryservice.MdCategoryItemLng_;
import cds.gen.pg.mdcategoryservice.MdCategoryItem_;
import cds.gen.pg.mdcategoryservice.MdCategoryLng;
import cds.gen.pg.mdcategoryservice.MdCategoryLng_;
import cds.gen.pg.mdcategoryservice.MdCategoryService_;
import cds.gen.pg.mdcategoryservice.MdCategory_;
import lg.sppCap.frame.user.SppUserSession;

@Component
@ServiceName("pg.MdCategoryService")
public class MdCategoryService implements EventHandler {

    private final static Logger log = LoggerFactory.getLogger(MdCategoryService.class);

    @Autowired
    private PersistenceService db;
    
	@Autowired
    private JdbcTemplate jdbc;
    
    @Autowired
    SppUserSession sppUserSession;

    @Autowired
    @Qualifier(MdCategoryService_.CDS_NAME)
    private CdsService mdCategoryService;

	// 카테고리 Id 저장 전
	@Before(event=CdsService.EVENT_CREATE, entity=MdCategory_.CDS_NAME)
	public void createBeforeMdCategoryIdProc(List<MdCategory> cateIds) {

        if(log.isDebugEnabled()) log.debug("### ID Insert... [Before] ###");
        
		for(MdCategory cateId : cateIds) {
			
			if(log.isDebugEnabled()) log.debug("### ID Param Info : {} {} {}", cateId.getSpmdCategoryCode(), cateId.getSpmdCategoryCodeName(), cateId.getRgbFontColorCode());

			CqnSelect query = Select.from(MdCategory_.class)
				.columns("spmd_category_code")
				.where(b -> 
					b.tenant_id().eq(cateId.getTenantId())
					.and(b.company_code().eq(cateId.getCompanyCode()))
					.and(b.org_type_code().eq(cateId.getOrgTypeCode()))
					.and(b.org_code().eq(cateId.getOrgCode()))
					.and(b.spmd_category_code().eq(cateId.getSpmdCategoryCode()))
				);
			Result rslt = db.run(query);
			//Result rslt = mdCategoryService.run(query);
			
			if(log.isDebugEnabled()) log.debug("### Result RowCount : {}", rslt.rowCount());
			if (rslt.rowCount() > 0) {
				String spmd_category_code = (String) rslt.first().get().get("spmd_category_code");
				//for(Map<String, Object> v_inRow : rslt) spmd_category_code = (String) v_inRow.get("spmd_category_code");
				if(log.isErrorEnabled()) log.error("### Error Result Info : {}", spmd_category_code);
				//Category범주 신규코드가 이미 존재하여 저장할 수 없습니다.
				throw new ServiceException(ErrorStatuses.BAD_REQUEST, "The registered CategoryCode["+spmd_category_code+"] exists and cannot be saved.");
			}
		}
	}

	// 카테고리 Id 저장 후
	@After(event={CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
	public void createAfterMdCategoryIdProc(List<MdCategory> cateId) {
		if(log.isDebugEnabled()) log.debug("### Id Insert [After] ###");
	}


	// 카테고리 Id 수정 전
	@Before(event=CdsService.EVENT_UPDATE, entity=MdCategory_.CDS_NAME)
	public void updateBeforeMdCategoryIdProc(List<MdCategory> cateIds) {
        if(log.isDebugEnabled()) log.debug("### ID Update... [Before] ###");
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
		if(log.isDebugEnabled()) log.debug("### ID Update... [After] ###");
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
		if(log.isDebugEnabled()) {
			log.debug("### ID/ITEM Read... [Before] ###");
			log.debug("### ID/ITEM Read... [Before] [1]### {} {} {} {} ", sppUserSession.getUserId(), sppUserSession.getCompanyCode(), sppUserSession.getLanguageCode(), sppUserSession.getEmployeeName());
		}
    }
    
    // 카테고리 Id / Item 저장   
    @On(event={CdsService.EVENT_CREATE}, entity={MdCategory_.CDS_NAME, MdCategoryItem_.CDS_NAME})
    public void createOnMdCategoryAndItemProc(CdsCreateEventContext context) { 
        if(log.isDebugEnabled()) log.debug("### ID/ITEM Insert [On] ###");
    }

	// 카테고리 삭제 전
	@Before(event=CdsService.EVENT_DELETE, entity=MdCategory_.CDS_NAME)
    public void deleteBeforeMdCategoryIdProc(CdsDeleteEventContext context) {
        if(log.isDebugEnabled()) log.debug("### ID Delete [Before] ###");

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> param = result.targetValues();

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

        if(log.isDebugEnabled()) log.debug("###[LOG-10]=> ["+iCnt+"]");
        if (iCnt > 0) {
            //Category 범주에 등록된 Item특성이 존재하여 삭제할 수 없습니다.
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, "The registered item exists and cannot be deleted.");
        }
        
    }
    
	// 카테고리 삭제 
    @On(event = CdsService.EVENT_DELETE, entity=MdCategory_.CDS_NAME)
    public void deleteOnMdCategoryIdProc(CdsDeleteEventContext context) { 
        if(log.isDebugEnabled()) log.debug("### ID Delete [On] ###");

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> param = result.targetValues();

        if(log.isDebugEnabled()) log.debug("###"+param.get("tenant_id")+"###"+param.get("company_code")+"###"+param.get("org_type_code")+"###"+param.get("org_code")+"###"+param.get("spmd_category_code")+"###");
    
        // Multi Language Delete
        MdCategoryLng filter = MdCategoryLng.create();
        filter.setTenantId((String) param.get("tenant_id"));
        filter.setCompanyCode((String) param.get("company_code"));
        filter.setOrgTypeCode((String) param.get("org_type_code"));
        filter.setOrgCode((String) param.get("org_code"));
        filter.setSpmdCategoryCode((String) param.get("spmd_category_code"));
        CqnDelete delete = Delete.from(MdCategoryLng_.CDS_NAME).matching(filter);
        Result rslt = mdCategoryService.run(delete);

        if(log.isDebugEnabled()) log.debug("### Delete count ### {} ", rslt.rowCount());
    
/*        
        List<MdCategory> v_results = new ArrayList<MdCategory>();
        MdCategory v_result = MdCategory.create();
        v_result.setTenantId((String) param.get("tenant_id"));
        v_result.setCompanyCode((String) param.get("company_code"));
        v_result.setOrgTypeCode((String) param.get("org_type_code"));
        v_result.setOrgCode((String) param.get("org_code"));
        v_result.setSpmdCategoryCode((String) param.get("spmd_category_code"));

        v_results.add(v_result);

        context.setResult(v_results);
        context.setCompleted();
*/

    }

	/*
	**********************************
	*** 카테고리 Item Event 처리
	**********************************
    */
	// 카테고리 Item 저장 전
	@Before(event=CdsService.EVENT_CREATE, entity=MdCategoryItem_.CDS_NAME)
	public void createBeforeMdCategoryItemProc(EventContext context, List<MdCategoryItem> items) {

        if(log.isDebugEnabled()) log.debug("### Item Insert [Before] ###");
        
			for (MdCategoryItem item : items) {

                CqnSelect query = Select.from(MdCategoryItem_.class)
                    .columns("spmd_character_code")
                    .where(b -> 
                        b.tenant_id().eq(item.getTenantId())
                        .and(b.company_code().eq(item.getCompanyCode()))
                        .and(b.org_type_code().eq(item.getOrgTypeCode()))
                        .and(b.org_code().eq(item.getOrgCode()))
                        .and(b.spmd_category_code().eq(item.getSpmdCategoryCode()))
                        .and(b.spmd_character_code().eq(item.getSpmdCharacterCode()))
                    );
                Result rslt = db.run(query);
                //Result rslt = mdCategoryService.run(query);

                if(log.isDebugEnabled()) log.debug("### Result RowCount : {}", rslt.rowCount());
                if (rslt.rowCount() > 0) {
                    String spmd_character_code = (String) rslt.first().get().get("spmd_character_code");
                    
                    //for(Map<String, Object> v_inRow : rslt) spmd_character_code = (String) v_inRow.get("spmd_character_code");
                    if(log.isDebugEnabled()) log.debug("### Error Result Info : {} ", spmd_character_code);
                    //Item특성 신규코드가 이미 존재하여 저장할 수 없습니다.
                    throw new ServiceException(ErrorStatuses.BAD_REQUEST, "The registered ItemCode["+spmd_character_code+"] exists and cannot be saved.");
                }
			}

	}


    // 카테고리 Item 저장
    /*
	@On(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
	public void createOnMdCategoryItemItemProc(List<MdCategoryItem> items) {
		if(log.isDebugEnabled()) log.debug("### Item Insert [On] ###");
    }
    */

	// 카테고리 Item 저장 후
	@After(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
	public void createAfterMdCategoryItemProc(List<MdCategoryItem> items) {
		if(log.isDebugEnabled()) log.debug("### Item Insert [After] ###");
	}


	// 카테고리 Item 수정 전
	@Before(event=CdsService.EVENT_UPDATE, entity=MdCategoryItem_.CDS_NAME)
	public void updateBeforeMdCategoryItemProc(List<MdCategoryItem> items) {

        if(log.isDebugEnabled()) log.debug("### Item Update... [Before] ###");
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
		if(log.isDebugEnabled()) log.debug("### Item Update... [After] ###");
    }
    
	// 카테고리 Item 삭제 전
	@Before(event={CdsService.EVENT_DELETE}, entity=MdCategoryItem_.CDS_NAME)
	public void deleteBeforeMdCategoryItemItemProc(CdsDeleteEventContext context) {
        if(log.isDebugEnabled()) log.debug("### Item Delete [Before] ###");

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> param = result.targetValues();

        if(log.isDebugEnabled()) log.debug("###"+param.get("tenant_id")+"###"+param.get("company_code")+"###"+param.get("org_type_code")+"###"+param.get("org_code")+"###"+param.get("spmd_category_code")+"###"+param.get("spmd_character_code")+"###");
        
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

        if(log.isDebugEnabled()) log.debug("###[LOG-10]=> {}", iCnt);
        if (iCnt > 0) {
            //Vendor Pool에 Mapping된 Item특성이 존재하여 삭제할 수 없습니다.
            throw new ServiceException(ErrorStatuses.BAD_REQUEST, "The mapped item exists and cannot be deleted.");
        }

    }
    
	// 카테고리 Item 삭제 
    @On(event = CdsService.EVENT_DELETE, entity=MdCategoryItem_.CDS_NAME)
    public void deleteOnMdCategoryItemItemProc(CdsDeleteEventContext context) { 
        if(log.isDebugEnabled()) log.debug("### Item Delete [On] ###");

        CdsModel cdsModel = context.getModel();
        CqnAnalyzer cqnAnalyzer = CqnAnalyzer.create(cdsModel);
        CqnStatement cqn = context.getCqn();
        AnalysisResult result = cqnAnalyzer.analyze(cqn.ref());
        Map<String, Object> param = result.targetValues();

        if(log.isDebugEnabled()) log.debug("###"+param.get("tenant_id")+"###"+param.get("company_code")+"###"+param.get("org_type_code")+"###"+param.get("org_code")+"###"+param.get("spmd_category_code")+"###"+param.get("spmd_character_code")+"###");
    
        // Multi Language Delete
        MdCategoryItemLng filter = MdCategoryItemLng.create();
        filter.setTenantId((String) param.get("tenant_id"));
        filter.setCompanyCode((String) param.get("company_code"));
        filter.setOrgTypeCode((String) param.get("org_type_code"));
        filter.setOrgCode((String) param.get("org_code"));
        filter.setSpmdCategoryCode((String) param.get("spmd_category_code"));
        filter.setSpmdCharacterCode((String) param.get("spmd_character_code"));
        CqnDelete delete = Delete.from(MdCategoryItemLng_.CDS_NAME).matching(filter);
        Result rslt = mdCategoryService.run(delete);

        if(log.isDebugEnabled()) log.debug("### Delete count ### {} ", rslt.rowCount());
        /*
        List<MdCategoryItem> v_results = new ArrayList<MdCategoryItem>();
        MdCategoryItem v_result = MdCategoryItem.create();
        
        v_result.setTenantId((String) param.get("tenant_id"));
        v_result.setCompanyCode((String) param.get("company_code"));
        v_result.setOrgTypeCode((String) param.get("org_type_code"));
        v_result.setOrgCode((String) param.get("org_code"));
        v_result.setSpmdCategoryCode((String) param.get("spmd_category_code"));
        v_result.setSpmdCharacterCode((String) param.get("spmd_character_code"));

        v_results.add(v_result);

        context.setResult(v_results);
        context.setCompleted();
        */

    }

    

}