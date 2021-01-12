package lg.sppCap.handlers.dp.pd;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

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
import com.sap.cds.services.request.ParameterInfo;

import cds.gen.dp.productactivityv4service.*;
import cds.gen.dp.productactivityservice.*;

@Component
@ServiceName(ProductActivityV4Service_.CDS_NAME)
public class ProductActivityV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    
    @On(event = PdProductActivitySaveProcContext.CDS_NAME)
    public void PdProductActivitySaveProc(PdProductActivitySaveProcContext context) {
        
        Collection<PdProdActivityTemplateType> v_inDatas = context.getInputData().getPdProdActivityTemplateType();
        /*if(!v_inDatas.isEmpty() && v_inDatas.size() > 0){
            for(PdProdActivityTemplateType v_inRow : v_inDatas){
                System.out.println(v_inRow.get("crud_type_code"));
                System.out.println(v_inRow.get("product_activity_code"));
                System.out.println(v_inRow.get("product_activity_name"));
            }
        }*/
        StringBuffer v_sql_createTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP (");        
        v_sql_createTable.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTable.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTable.append("ORG_TYPE_CODE NVARCHAR(2),");
        v_sql_createTable.append("ORG_CODE NVARCHAR(10),");
        v_sql_createTable.append("PRODUCT_ACTIVITY_CODE NVARCHAR(40),");

        v_sql_createTable.append("DEVELOPE_EVENT_CODE NVARCHAR(30),");
        v_sql_createTable.append("SEQUENCE DECIMAL(34),");
        v_sql_createTable.append("PRODUCT_ACTIVITY_NAME NVARCHAR(240),");
        v_sql_createTable.append("PRODUCT_ACTIVITY_ENGLISH_NAME NVARCHAR(240),");
        v_sql_createTable.append("MILESTONE_FLAG BOOLEAN,");

        v_sql_createTable.append("ACTIVE_FLAG BOOLEAN,");
        v_sql_createTable.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createTable.append("SYSTEM_UPDATE_DTM TIMESTAMP,");
        v_sql_createTable.append("CRUD_TYPE_CODE NVARCHAR(1),");
        v_sql_createTable.append("UPDATE_PRODUCT_ACTIVITY_CODE NVARCHAR(40) )");

        String v_sql_insertTable2 = "INSERT INTO DP_PD_PRODUCT_ACTIVITY_TEMPLATE_TEMP VALUES (?, ?, ?, ?, ?,    ?, ?, ?, ?, ?,   ?, ?, current_date, ?, ?)";
        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP VALUES (?, ?, ?, ?, ?,    ?, ?, ?, ?, ?,   ?, ?, current_date, ?, ?)";
        String v_sql_callProc = "CALL DP_PD_PRODUCT_ACTIVITY_SAVE_PROC(I_TABLE => #LOCAL_TEMP, O_MSG => ?)";
        Collection<OutType> v_result = new ArrayList<>();

        ResultSet v_rs = null;

		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
            v_statement_table.execute();

            // Local Temp Table에 insert
            PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

            if(!v_inDatas.isEmpty() && v_inDatas.size() > 0){
                for(PdProdActivityTemplateType v_inRow : v_inDatas){
                    v_statement_insert.setObject(1, v_inRow.get("tenant_id"));
                    v_statement_insert.setObject(2, v_inRow.get("company_code"));
                    v_statement_insert.setObject(3, v_inRow.get("org_type_code"));
                    v_statement_insert.setObject(4, v_inRow.get("org_code"));
                    v_statement_insert.setObject(5, v_inRow.get("product_activity_code"));
					
					
                    v_statement_insert.setObject(6, v_inRow.get("develope_event_code"));
                    v_statement_insert.setObject(7, Integer.parseInt(String.valueOf(v_inRow.get("sequence"))));
                    v_statement_insert.setObject(8, v_inRow.get("product_activity_name"));
                    v_statement_insert.setObject(9, v_inRow.get("product_activity_english_name"));
                    if(v_inRow.get("milestone_flag")!=null && (v_inRow.get("milestone_flag")).equals("true")){
                        v_statement_insert.setObject(10, true);
                    }else{
                        v_statement_insert.setObject(10, false);
                    }
                    if(v_inRow.get("active_flag")!=null &&  (v_inRow.get("active_flag")).equals("true")){
                        v_statement_insert.setObject(11, true);
                    }else{
                        v_statement_insert.setObject(11, false);
                    }
                    v_statement_insert.setObject(12, v_inRow.get("update_user_id"));
                    v_statement_insert.setObject(13, v_inRow.get("crud_type_code"));
                    v_statement_insert.setObject(14, v_inRow.get("update_product_activity_code"));
                    
                    v_statement_insert.addBatch();
                }
                v_statement_insert.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
            v_rs = v_statement_proc.executeQuery();
            
            // Procedure Out put 담기
            while (v_rs.next()){
                OutType v_row = OutType.create();
                //System.out.println("return_code:::"+v_rs.getString("return_code"));
                //System.out.println("return_msg:::"+v_rs.getString("return_msg"));
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));                
                v_result.add(v_row);
            }

            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }

    }

}