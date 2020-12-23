package lg.sppCap.handlers.pg.vp;

import java.util.List;
import org.springframework.stereotype.Component;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.Instant;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

//import cds.gen.pg.vpsearchservice.VpMst_;
//import cds.gen.pg.vpsearchservice.VpMst;
import cds.gen.pg.vpsearchservice.*;

@Component
@ServiceName("pg.VpSearchService")
public class VendorPool implements EventHandler {

    // Code Master
    @Autowired
    JdbcTemplate jdbc;
    
    @Before(event = CdsService.EVENT_CREATE, entity=VpMst_.CDS_NAME)
    public void beforeCreateVpVendorPoolMst(List< VpMst> vpMgt) {
        
        Instant current = Instant.now();

        
        String vendor_pool_code = "";
        String v_sql = "SELECT 'VP' || TO_NCHAR(NOW(), 'YYYYMMDD') || LPAD(PG_VP_VENDOR_POOL_CODE_SEQ.NEXTVAL, 4, '0') FROM DUMMY";
        
        ResultSet v_rs = null;    

        try {

            String project_number = "";

            //Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            //PreparedStatement v_statement = conn.prepareStatement(v_sql);
            //v_rs = v_statement.executeQuery();

            //if(v_rs.next()) vendor_pool_code = String.valueOf(v_rs.getString("VENDOR_POOL_CODE"));
            vendor_pool_code = jdbc.queryForObject(v_sql, String.class);

            for(VpMst vendorPool : vpMgt) {

                vendorPool.setVendorPoolCode(vendor_pool_code);
                vendorPool.setLocalCreateDtm(current);
                vendorPool.setLocalUpdateDtm(current);
            }

		} catch (Exception e) { 
			e.printStackTrace();
        }

    }

}