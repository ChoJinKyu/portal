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
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsCreateEventContext;
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

				cateId.setLocalCreateDtm(current);
				cateId.setLocalUpdateDtm(current);

                // DB처리
				try {
					Connection conn = jdbc.getDataSource().getConnection();
                    // Item SPMD범주코드 생성 Function
					StringBuffer v_sql_get_code_fun = new StringBuffer();
                    v_sql_get_code_fun.append("SELECT ")
                        .append("   PG_MD_CATEGORY_CODE_FUNC(?, ?, ?, ?) AS CATE_CODE ")
                        .append("   , ( SELECT ")
                        .append("           IFNULL(MAX(SUBSTRING(SPMD_CATEGORY_CODE,2)), 0)+1 ")
                        .append("       FROM PG_MD_CATEGORY_ID ")
                        .append("       WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? ")
                        .append("     ) AS MAX_COUNT ")
                        .append(" FROM DUMMY ");                        
                    PreparedStatement v_statement_select = conn.prepareStatement(v_sql_get_code_fun.toString());

                    v_statement_select.setObject(1, cateId.getTenantId());
                    v_statement_select.setObject(2, cateId.getCompanyCode());
                    v_statement_select.setObject(3, cateId.getOrgTypeCode());
                    v_statement_select.setObject(4, cateId.getOrgCode());

                    v_statement_select.setObject(5, cateId.getTenantId());
                    v_statement_select.setObject(6, cateId.getCompanyCode());
                    v_statement_select.setObject(7, cateId.getOrgTypeCode());
                    v_statement_select.setObject(8, cateId.getOrgCode());
            
					ResultSet rslt = v_statement_select.executeQuery();
					if(rslt.next()) {
                        if (iMultiArrayCnt > 0) {
                            iMultiArrayCnt = iMultiArrayCnt+1;
                        } else {
                            //cateCode = rslt.getString("CATE_CODE");
                            iMultiArrayCnt = rslt.getInt("MAX_COUNT");
                        }
                        cateCode = "C"+StringUtil.getFillZero(String.valueOf(iMultiArrayCnt), 3);
                    }
                    

                    log.info("###[LOG-10]=> ["+cateCode+"]");

                    v_statement_select.close();
                    conn.close();
				} catch (SQLException sqlE) {
					sqlE.printStackTrace();
					log.error("### ErrCode : "+sqlE.getErrorCode()+"###");
					log.error("### ErrMesg : "+sqlE.getMessage()+"###");
				} finally {

                }

				//log.info("###[LOG-11]=> ["+cateCode+"]");

				cateId.setSpmdCategoryCode(cateCode);
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
	public void deleteBeforeMdCategoryIdProc(List<MdCategory> cateIds) {
        log.info("### ID Delete [Before] ###");

		if(!cateIds.isEmpty() && cateIds.size() > 0){

			for(MdCategory cateId : cateIds) {
                int iItemCnt = 0;
                // DB처리
				try {
					Connection conn = jdbc.getDataSource().getConnection();
                    // SPMD범주코드 Item특성 등록 유무 체크
					String v_sql_get = "SELECT COUNT(*) AS CNT FROM PG_MD_CATEGORY_ITEM WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? AND SPMD_CATEGORY_CODE=? ";

                    PreparedStatement v_stmt = conn.prepareStatement(v_sql_get);

                    v_stmt.setObject(1, cateId.getTenantId());
                    v_stmt.setObject(2, cateId.getCompanyCode());
                    v_stmt.setObject(3, cateId.getOrgTypeCode());
                    v_stmt.setObject(4, cateId.getOrgCode());
                    v_stmt.setObject(5, cateId.getSpmdCategoryCode());
            
                    ResultSet rslt = v_stmt.executeQuery();
                    
					if(rslt.next()) {
                        iItemCnt = rslt.getInt("CNT");
                        if (iItemCnt > 0) throw new ServiceException(ErrorStatuses.BAD_REQUEST, "범주코드["+cateId.getSpmdCategoryCode()+"]를 삭제할 수 없습니다.");
                    }

                    log.info("###[LOG-10]=> ["+iItemCnt+"]");

                    v_stmt.close();
                    conn.close();
				} catch (SQLException sqlE) {
					sqlE.printStackTrace();
					log.error("### ErrCode : "+sqlE.getErrorCode()+"###");
					log.error("### ErrMesg : "+sqlE.getMessage()+"###");
				} finally {

                }

				//log.info("###[LOG-11]=> ["+iItemCnt+"]");
			}
		}

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
			int charSerialNo = 0;

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

						Connection conn = jdbc.getDataSource().getConnection();

						// Item SPMD특성코드 생성 Function
						StringBuffer v_sql_get_code_fun = new StringBuffer();
						v_sql_get_code_fun.append("SELECT ")
							.append("   PG_MD_CHARACTER_CODE_FUNC(?, ?, ?, ?, ?) AS CHAR_CODE ")
                            .append("   , ( SELECT ")
                            .append("           IFNULL(MAX(SPMD_CHARACTER_SERIAL_NO), 0)+1 ")
                            .append("       FROM PG_MD_CATEGORY_ITEM ")
                            .append("       WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? ")
                            .append("     ) AS CHAR_SERIAL_NO ")
							.append(" FROM DUMMY ");

						PreparedStatement v_statement_select = conn.prepareStatement(v_sql_get_code_fun.toString());
                        v_statement_select.setObject(1, item.getTenantId());
                        v_statement_select.setObject(2, item.getCompanyCode());
                        v_statement_select.setObject(3, item.getOrgTypeCode());
                        v_statement_select.setObject(4, item.getOrgCode());
                        v_statement_select.setObject(5, item.getSpmdCategoryCode());
                        
                        v_statement_select.setObject(6, item.getTenantId());
                        v_statement_select.setObject(7, item.getCompanyCode());
                        v_statement_select.setObject(8, item.getOrgTypeCode());
                        v_statement_select.setObject(9, item.getOrgCode());

						ResultSet rslt = v_statement_select.executeQuery();

						if(rslt.next()) {
                            if (iMultiArrayCnt > 0) {
                                charSerialNo = iMultiArrayCnt+1;
                            } else {
                                //charCode = rslt.getString("CHAR_CODE");
                                charSerialNo = rslt.getInt("CHAR_SERIAL_NO");
                            }
                            charCode = "T"+StringUtil.getFillZero(String.valueOf(charSerialNo), 3);
                            iMultiArrayCnt = charSerialNo;
						}

						log.info("###[LOG-10]=> ["+charCode+"] ["+charSerialNo+"] ["+new Long(charSerialNo)+"]");


                        v_statement_select.close();
                        conn.close();
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
	public void deleteBeforeMdCategoryItemItemProc(List<MdCategoryItem> items) {
        log.info("### Item Delete [Before] ###");

		if(!items.isEmpty() && items.size() > 0){

            for (MdCategoryItem item : items) {
                int iMappingCnt = 0;
                // DB처리
				try {
					Connection conn = jdbc.getDataSource().getConnection();
                    // Item특성코드 VendorPool-3별 Mapping 등록 유무 체크
					String v_sql_get = "SELECT COUNT(*) AS CNT FROM PG_MD_VP_ITEM_MAPPING_ATTR WHERE TENANT_ID=? AND COMPANY_CODE=? AND ORG_TYPE_CODE=? AND ORG_CODE=? AND SPMD_CATEGORY_CODE=? AND SPMD_CHARACTER_CODE=? ";

                    PreparedStatement v_stmt = conn.prepareStatement(v_sql_get);

                    v_stmt.setObject(1, item.getTenantId());
                    v_stmt.setObject(2, item.getCompanyCode());
                    v_stmt.setObject(3, item.getOrgTypeCode());
                    v_stmt.setObject(4, item.getOrgCode());
                    v_stmt.setObject(5, item.getSpmdCategoryCode());
                    v_stmt.setObject(6, item.getSpmdCharacterCode());
            
                    ResultSet rslt = v_stmt.executeQuery();
                    
					if(rslt.next()) {
                        iMappingCnt = rslt.getInt("CNT");
                        if (iMappingCnt > 0) throw new ServiceException(ErrorStatuses.BAD_REQUEST, "특성코드["+item.getSpmdCharacterCode()+"]를 삭제할 수 없습니다.");
                    }

                    log.info("###[LOG-10]=> ["+iMappingCnt+"]");

                    v_stmt.close();
                    conn.close();
				} catch (SQLException sqlE) {
					sqlE.printStackTrace();
					log.error("### ErrCode : "+sqlE.getErrorCode()+"###");
					log.error("### ErrMesg : "+sqlE.getMessage()+"###");
				} finally {

                }

				//log.info("###[LOG-11]=> ["+iMappingCnt+"]");
			}
		}

    }

}