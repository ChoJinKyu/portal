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
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.pg.mdcategoryv4service.*;

@Component
@ServiceName("pg.MdCategoryV4Service")
public class MdCategoryServiceV4 implements EventHandler {

	private static final Logger log = LogManager.getLogger();

	@Autowired
	private JdbcTemplate jdbc;

    // VendorPool Category Item Mapping 프로시져 1건 처리
    @On(event=MdVpMappingItemProcContext.CDS_NAME)
	public void onMdVpMappingItemProc(MdVpMappingItemProcContext context) {

        log.info("### onMdVpMappingItemProc 1건 처리 [On] ###");
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL PG_SPMD_VENDOR_POOL_MAPPING_ITEM_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_ORG_TYPE_CODE => ?, ")
                    .append(" I_ORG_CODE => ?, ")
                    .append(" I_SPMD_CATEGORY_CODE => ?, ")
                    .append(" I_SPMD_CHARACTER_CODE => ?, ")
                    .append(" I_SPMD_CHARACTER_SERIAL_NO => ?, ")
                    .append(" I_VENDOR_POOL_CODE => ?, ")
                    .append(" I_UPDATE_USER_ID => ? ")
                .append(" )");

		try {
 
            //CallableStatement statement = DataSourceUtils.getConnection(dataSource).prepareCall(v_sql);
            CallableStatement statement = jdbc.getDataSource().getConnection().prepareCall(v_sql.toString());
            
            statement.setString(1, context.getTenantId());
            statement.setString(2, context.getCompanyCode());
            statement.setString(3, context.getOrgTypeCode());
            statement.setString(4, context.getOrgCode());
            statement.setString(5, context.getSpmdCategoryCode());
            statement.setString(6, context.getSpmdCharacterCode());
            statement.setLong(7, context.getSpmdCharacterSerialNo());
            statement.setString(8, context.getVendorPoolCode());
            statement.setString(9, "UpdateUserId");
            
            //statement.execute();
            //statement.executeQuery();
            statement.executeUpdate();

            String result = "SUCCESS";

            context.setResult(result);
            context.setCompleted();

 
		} catch (SQLException e) { 
			e.printStackTrace();
        }
        
    }
    

    // VendorPool Category Item Mapping 프로시져 array건 처리
    @On(event=MdVpMappingItemMultiProcContext.CDS_NAME)
	public void onMdVpMappingItemMultiProc(MdVpMappingItemMultiProcContext context) {

        log.info("### onMdVpMappingItemMultiProc array건 처리 [On] ###");

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();        
        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_PG_SPMD_VP_MAPPING_ITEM ( ")
                                    .append("TENANT_ID NVARCHAR(5), ") 
                                    .append("COMPANY_CODE NVARCHAR(10), ")
                                    .append("ORG_TYPE_CODE NVARCHAR(30), ")
                                    .append("ORG_CODE NVARCHAR(10), ") 
                                    .append("SPMD_CATEGORY_CODE NVARCHAR(4), ")
                                    .append("SPMD_CHARACTER_CODE NVARCHAR(4), ")
                                    .append("SPMD_CHARACTER_SERIAL_NO BIGINT, ")
                                    .append("VENDOR_POOL_CODE NVARCHAR(20), ")
                                    .append("UPDATE_USER_ID NVARCHAR(500) ")
                                .append(")");

        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_SPMD_VP_MAPPING_ITEM VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_callProc = "CALL PG_SPMD_VENDOR_POOL_MAPPING_ITEM_MULTI_PROC( I_TABLE => #LOCAL_TEMP_PG_SPMD_VP_MAPPING_ITEM, O_RTN_MESG => ? )";

        String v_result = "";
        Collection<MdVpMappingItemProcType> v_inRows = context.getItems();
        ResultSet v_rs = null;

		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            //CallableStatement v_statement_table = conn.prepareCall(v_sql_createTable);
            PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
            v_statement_table.execute();

            // Local Temp Table에 insert
            //CallableStatement v_statement_insert = conn.prepareCall(v_sql_insertTable);
            PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

            if(!v_inRows.isEmpty() && v_inRows.size() > 0){
                for(MdVpMappingItemProcType v_inRow : v_inRows){
                    v_statement_insert.setString(1, v_inRow.getTenantId());
                    v_statement_insert.setString(2, v_inRow.getCompanyCode());
                    v_statement_insert.setString(3, v_inRow.getOrgTypeCode());
                    v_statement_insert.setString(4, v_inRow.getOrgCode());
                    v_statement_insert.setString(5, v_inRow.getSpmdCategoryCode());
                    v_statement_insert.setString(6, v_inRow.getSpmdCharacterCode());
                    v_statement_insert.setLong(7, v_inRow.getSpmdCharacterSerialNo());
                    v_statement_insert.setString(8, v_inRow.getVendorPoolCode());
                    v_statement_insert.setString(9, "UpdateUserId");
                    //v_statement_insert.executeUpdate();
                    v_statement_insert.addBatch();
                }
                // Temp Table에 Multi건 등록
                v_statement_insert.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            if (v_rs.next()) v_result = v_rs.getString("o_rtn_mesg");

            context.setResult(v_result);
            context.setCompleted();

            // Temp Table Drop처리
            Statement stmt = conn.createStatement();
            String v_sql_dropTable = "DROP TABLE #LOCAL_TEMP_PG_SPMD_VP_MAPPING_ITEM";
            stmt.executeUpdate(v_sql_dropTable);

		} catch (SQLException e) { 
			e.printStackTrace();
		}

    }
    
    // VendorPool Category Item Mapping 상태처리 프로시져 1건 처리
    @On(event=MdVpMappingStatusProcContext.CDS_NAME)
	public void onMdVpMappingStatusProc(MdVpMappingStatusProcContext context) {

		log.info("### onMdVpMappingStatusProc 1건 처리 [On] ###");
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL PG_SPMD_VENDOR_POOL_MAPPING_STATUS_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_ORG_TYPE_CODE => ?, ")
                    .append(" I_ORG_CODE => ?, ")
                    .append(" I_VENDOR_POOL_CODE => ?, ")
                    .append(" I_CONFIRMED_STATUS_CODE => ?, ")
                    .append(" I_UPDATE_USER_ID => ? ")
                .append(" )");

		try {
 
            //CallableStatement statement = DataSourceUtils.getConnection(dataSource).prepareCall(v_sql);
            CallableStatement statement = jdbc.getDataSource().getConnection().prepareCall(v_sql.toString());
            
            statement.setString(1, context.getTenantId());
            statement.setString(2, context.getCompanyCode());
            statement.setString(3, context.getOrgTypeCode());
            statement.setString(4, context.getOrgCode());
            statement.setString(5, context.getVendorPoolCode());
            statement.setString(6, "300");      //  100:신규(최초), 200:저장, 300:확정(품위결제)
            statement.setString(9, "UpdateUserId");
            
            //statement.execute();
            //statement.executeQuery();
            statement.executeUpdate();

            String result = "SUCCESS";

            context.setResult(result);
            context.setCompleted();

 
		} catch (SQLException e) { 
			e.printStackTrace();
        }
    }
       
    // VendorPool Category Item Mapping 상태처리 프로시져 array건 처리
    @On(event=MdVpMappingStatusMultiProcContext.CDS_NAME)
	public void onMdVpMappingStatusMultiProc(MdVpMappingStatusMultiProcContext context) {

		log.info("### onMdVpMappingItemProc array건 처리 ###");

        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        StringBuffer v_sql_createTable = new StringBuffer();        
        v_sql_createTable.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_PG_SPMD_VP_MAPPING_STATUS ( ")
                                    .append("TENANT_ID NVARCHAR(5), ") 
                                    .append("COMPANY_CODE NVARCHAR(10), ")
                                    .append("ORG_TYPE_CODE NVARCHAR(30), ")
                                    .append("ORG_CODE NVARCHAR(10), ") 
                                    .append("VENDOR_POOL_CODE NVARCHAR(20), ")
                                    .append("CONFIRMED_STATUS_CODE NVARCHAR(3), ")
                                    .append("UPDATE_USER_ID NVARCHAR(500) ")
                                .append(")");

        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_PG_SPMD_VP_MAPPING_STATUS VALUES (?, ?, ?, ?, ?, ?, ?)";
        String v_sql_callProc = "CALL PG_SPMD_VENDOR_POOL_MAPPING_STATUS_MULTI_PROC( I_TABLE => #LOCAL_TEMP_PG_SPMD_VP_MAPPING_STATUS, O_RTN_MESG => ? )";

        String v_result = "";
        Collection<MdVpMappingStatusProcType> v_inRows = context.getItems();
        ResultSet v_rs = null;

		try {
            
            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            //CallableStatement v_statement_table = conn.prepareCall(v_sql_createTable);
            PreparedStatement v_statement_table = conn.prepareStatement(v_sql_createTable.toString());
            v_statement_table.execute();

            // Local Temp Table에 insert
            //CallableStatement v_statement_insert = conn.prepareCall(v_sql_insertTable);
            PreparedStatement v_statement_insert = conn.prepareStatement(v_sql_insertTable);

            if(!v_inRows.isEmpty() && v_inRows.size() > 0){
                for(MdVpMappingStatusProcType v_inRow : v_inRows){
                    v_statement_insert.setString(1, v_inRow.getTenantId());
                    v_statement_insert.setString(2, v_inRow.getCompanyCode());
                    v_statement_insert.setString(3, v_inRow.getOrgTypeCode());
                    v_statement_insert.setString(4, v_inRow.getOrgCode());
                    v_statement_insert.setString(5, v_inRow.getVendorPoolCode());
                    v_statement_insert.setString(6, "200");      //  100:신규(최초), 200:저장, 300:확정(품위결제)
                    v_statement_insert.setString(7, "UpdateUserId");
                    //v_statement_insert.executeUpdate();
                    v_statement_insert.addBatch();
                }
                // Temp Table에 Multi건 등록
                v_statement_insert.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            if (v_rs.next()) v_result = v_rs.getString("o_rtn_mesg");

            context.setResult(v_result);
            context.setCompleted();

            // Temp Table Drop처리
            Statement stmt = conn.createStatement();
            String v_sql_dropTable = "DROP TABLE #LOCAL_TEMP_PG_SPMD_VP_MAPPING_STATUS";
            stmt.executeUpdate(v_sql_dropTable);

		} catch (SQLException e) { 
			e.printStackTrace();
        }
        
    }
    
	/**
	 *
	 * 전달받은 문자열에 지정된 길이에 맞게 0을 채운다
	 *
	 * @param des
	 * @param size
	 * @return
	 */
	private String getFillZero(String des, int size) {
		StringBuffer str = new StringBuffer();

		if (des == null) {
			for (int i = 0; i < size; i++)
				str.append("0");
			return str.toString();
		}

		if (des.trim().length() > size)
			return des.substring(0, size);
		else
			des = des.trim();

		int diffsize = size - des.length();

		for (int i = 0; i < diffsize; i++) {
			str = str.append("0");
		}

		str.append(des);

		return str.toString();
	}

}