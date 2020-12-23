package lg.sppCap.handlers.ep.po;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import cds.gen.ep.loimgtv4service.LoiMgtV4Service_;
import cds.gen.ep.loimgtv4service.SaveLoiVosProcContext;

@Component
@ServiceName(LoiMgtV4Service_.CDS_NAME)
public class LoiMgtV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;
    

    // Procedure 호출해서 header 저장
    /*********************************
    {"tenant_id":"1000", "company_code":"C100", "loi_write_number":"121000000001", "loi_item_number":"1", "supplier_opinion":"기타의견"}    
    *********************************/
    @On(event = SaveLoiVosProcContext.CDS_NAME)
    public void onSaveLoiVosProc(SaveLoiVosProcContext context) {
        
        log.info("### EP_SAVE_LOI_VOS_PROC 프로시저 호출시작 ###");
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL EP_SAVE_LOI_VOS_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_LOI_WRITE_NUMBER => ?, ")
                    .append(" I_LOI_ITEM_NUMBER => ?, ")
                    .append(" I_SUPPLIER_OPINION => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        //ResultSet v_rs = null;
		try {
            
            Connection conn = jdbc.getDataSource().getConnection();
            CallableStatement statement = jdbc.getDataSource().getConnection().prepareCall(v_sql.toString());
            
            statement.setString(1, context.getTenantId());
            statement.setString(2, context.getCompanyCode());
            statement.setString(3, context.getLoiWriteNumber());
            statement.setString(4, context.getLoiItemNumber());
            statement.setString(5, context.getSupplierOpinion());
            
            int iCnt = statement.executeUpdate();

            String result = "SUCCESS";
            StringBuffer rsltMsg = new StringBuffer();

            // while (v_rs.next()){
            //     result = v_rs.getString(1);
            // }

			rsltMsg.append("{")
					.append("\"rsltCd\":\"000\"")
					.append(", \"rsltMsg\":\""+result+"\"")
					.append(", \"rsltCnt\":"+iCnt+"")
					.append("}");            

            context.setResult(rsltMsg.toString());
            context.setCompleted();            

		} catch (SQLException e) { 
			e.printStackTrace();
        }

        log.info("### EP_SAVE_LOI_VOS_PROC 프로시저 종료 ###");

    }

}