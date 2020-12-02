package lg.sppCap.handlers.ep;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.Instant;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.ep.projectmgrservice.Project;
import cds.gen.ep.projectmgrservice.ProjectMgrService_;
import cds.gen.ep.projectmgrservice.Project_;

@Component
@ServiceName(ProjectMgrService_.CDS_NAME)
public class ProjectMgrService implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;
    
    // 카테고리 Id 저장 전
    @Before(event=CdsService.EVENT_CREATE, entity=Project_.CDS_NAME)
    public void createBeforeProjectNumber(Project project) {

        log.info("### Project Number Insert... [Before] ###");

        Instant current = Instant.now();

        String tenant_id = project.getTenantId();
        String company_code = project.getCompanyCode();

        log.info("### tenant_id ====" + tenant_id);

        String max_project_number = "";
        String v_sql = "SELECT IFNULL(MAX(CAST(REPLACE(EP_PROJECT_NUMBER, 'P' , '') as INTEGER)), 0) + 1 AS MAX_PROJECT_NUMBER FROM EP_PROJECT";

        ResultSet v_rs = null;          

        try {

            String project_number = "";

            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            PreparedStatement v_statement = conn.prepareStatement(v_sql);
            v_rs = v_statement.executeQuery();

            if(v_rs.next()) project_number = String.valueOf(v_rs.getInt("MAX_PROJECT_NUMBER"));

            while(project_number.length() < 6) {
                project_number = "0" + project_number;
            }
            log.info("### project_number ===1111111" + project_number);

            project.setEpProjectNumber("P"+project_number);

		} catch (Exception e) { 
			e.printStackTrace();
        }


    }

}