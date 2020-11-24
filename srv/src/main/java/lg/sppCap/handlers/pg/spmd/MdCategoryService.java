package lg.sppCap.handlers.pg.spmd;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.time.Instant;

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

        for(MdCategory cateId : cateIds) {
            cateId.setLocalCreateDtm(current);
            cateId.setLocalUpdateDtm(current);
        }
    }

    // 카테고리 Id 저장
    @On(event={CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
    public void createOnMdCategoryIdProc(List<MdCategory> cateId) {
        log.info("### Id Insert [On] ###");
    }

    // 카테고리 Id 저장 후
    @After(event={CdsService.EVENT_READ, CdsService.EVENT_CREATE}, entity=MdCategory_.CDS_NAME)
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
        
        Instant current = Instant.now();

        for(MdCategoryItem item : items) {
            item.setLocalCreateDtm(current);
            item.setLocalUpdateDtm(current);
            //item.setCreateUserId("kki");
            //item.setUpdateUserId("kki");
        }


    }
     

    // 카테고리 Item 저장
    @On(event={CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
    public void createOnMdCategoryItemItemProc(List<MdCategoryItem> items) {
        log.info("### Item Insert [On] ###");
    }
 
    // 카테고리 Item 저장 후
    @After(event={CdsService.EVENT_READ, CdsService.EVENT_CREATE}, entity=MdCategoryItem_.CDS_NAME)
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


}