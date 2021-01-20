package lg.sppCap.handlers.dp.gs;

import java.time.Instant;
import java.util.List;

import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.dp.gssuppliermgtservice.SupplierGen;
import cds.gen.dp.gssuppliermgtservice.SupplierGen_;




@Component
@ServiceName("dp.GsSupplierMgtService")
public class GsSupplierMgtService implements EventHandler {
    
    private final static Logger log = LoggerFactory.getLogger(GsSupplierMgtService.class);

    // Code Master
    @Autowired
    JdbcTemplate jdbc;
    
    @Before(event = CdsService.EVENT_CREATE, entity=SupplierGen_.CDS_NAME)
    public void beforeCreateGsSupplierMgt(List<SupplierGen> SupplierGen) {
        if(log.isInfoEnabled())
            log.info("#### beforeCreateGsSupplierMgt START....");            

        Instant current = Instant.now();        
        
        String f_sql = "SELECT DP_GS_SOURCING_SUPPLIER_ID_SEQ.NEXTVAL AS SOURCING_SUPPLIER_ID FROM DUMMY";
        
        long sourcing_supplier_id = jdbc.queryForObject(f_sql, Long.class);

        System.out.println(sourcing_supplier_id);

        for(SupplierGen gsSupplierMgt : SupplierGen) {
            gsSupplierMgt.setSourcingSupplierId(sourcing_supplier_id);
            gsSupplierMgt.setLocalCreateDtm(current);
            gsSupplierMgt.setLocalUpdateDtm(current);
        }
        
        if(log.isInfoEnabled())
            log.info("#### beforeCreateGsSupplierMgt END....");
    }
}