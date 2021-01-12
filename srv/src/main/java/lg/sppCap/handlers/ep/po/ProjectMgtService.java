package lg.sppCap.handlers.ep.po;

//import java.sql.Connection;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.time.Instant;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.ep.projectmgtservice.Project;
import cds.gen.ep.projectmgtservice.ProjectMgtService_;
import cds.gen.ep.projectmgtservice.Project_;

@Component
@ServiceName(ProjectMgtService_.CDS_NAME)
public class ProjectMgtService implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;
    
    // Project_number 자동 채번
    @Before(event=CdsService.EVENT_CREATE, entity=Project_.CDS_NAME)
    public void createBeforeProjectNumber(Project project) {

        log.info("### Project Number Insert... [Before] ###");

        //Instant current = Instant.now();

        String tenant_id = project.getTenantId();
        //String company_code = project.getCompanyCode();

        log.info("### tenant_id ====>" + tenant_id);

        //String max_project_number = "";
        String v_sql = "SELECT IFNULL(MAX(CAST(REPLACE(EP_PROJECT_NUMBER, 'P' , '') as INTEGER)), 0) + 1 AS MAX_PROJECT_NUMBER FROM EP_PO_PROJECT";

        //ResultSet v_rs = null;          

        try {

            String project_number = "";

            // 이 부분 사용하면 안됨
            //Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            //PreparedStatement v_statement = conn.prepareStatement(v_sql);
            //v_rs = v_statement.executeQuery();

            //if(v_rs.next()) project_number = String.valueOf(v_rs.getInt("MAX_PROJECT_NUMBER"));

            // 검색조건 없음, String type으로 바로 return
            project_number = jdbc.queryForObject(v_sql, null, String.class);

            while(project_number.length() < 6) {
                project_number = "0" + project_number;
            }
            log.info("### project_number ===>>>" + project_number);

            project.setEpProjectNumber("P"+project_number);

		} catch (Exception e) { 
			e.printStackTrace();
        }


    }

}