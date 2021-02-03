package lg.sppCap.handlers.sp.sm;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.suppliermanagementv4service.*;

@Component
@ServiceName(SupplierManagementV4Service_.CDS_NAME)
public class SupplierManagementV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    // Execute Upsert Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    @On(event = UpsertMakerRestnReqProcContext.CDS_NAME)
    public void onUpsertMakerRestnReqProc(UpsertMakerRestnReqProcContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";

        // create temp table: local_temp_maker_regstn_req
        StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("create local temporary column table #local_temp_maker_regstn_req ( ");
		v_sql_createTable.append("tenant_id nvarchar(5), ");
		v_sql_createTable.append("maker_request_sequence bigint, ");
		v_sql_createTable.append("maker_request_type_code nvarchar(30), ");
		v_sql_createTable.append("maker_progress_status_code nvarchar(30), ");
		v_sql_createTable.append("requestor_empno nvarchar(30), ");
		v_sql_createTable.append("tax_id nvarchar(30), ");
		v_sql_createTable.append("supplier_code nvarchar(10), ");
		v_sql_createTable.append("supplier_local_name nvarchar(240), ");
		v_sql_createTable.append("supplier_english_name nvarchar(240), ");
		v_sql_createTable.append("country_code nvarchar(2), ");
		v_sql_createTable.append("country_name nvarchar(30), ");
		v_sql_createTable.append("vat_number nvarchar(30), ");
		v_sql_createTable.append("zip_code nvarchar(20), ");
		v_sql_createTable.append("local_address_1 nvarchar(240), ");
		v_sql_createTable.append("local_address_2 nvarchar(240), ");
		v_sql_createTable.append("local_address_3 nvarchar(240), ");
		v_sql_createTable.append("local_full_address nvarchar(1000), ");
		v_sql_createTable.append("english_address_1 nvarchar(240), ");
		v_sql_createTable.append("english_address_2 nvarchar(240), ");
		v_sql_createTable.append("english_address_3 nvarchar(240), ");
		v_sql_createTable.append("english_full_address nvarchar(1000), ");
		v_sql_createTable.append("affiliate_code nvarchar(10), ");
		v_sql_createTable.append("affiliate_code_name nvarchar(50), ");
		v_sql_createTable.append("company_class_code nvarchar(30), ");
		v_sql_createTable.append("company_class_name nvarchar(50), ");
		v_sql_createTable.append("repre_name nvarchar(30), ");
		v_sql_createTable.append("tel_number nvarchar(50), ");
		v_sql_createTable.append("email_address nvarchar(240), ");
		v_sql_createTable.append("supplier_status_code nvarchar(30), ");
		v_sql_createTable.append("supplier_status_name nvarchar(50), ");
		v_sql_createTable.append("biz_certi_attch_number nvarchar(100), ");
		v_sql_createTable.append("attch_number_2 nvarchar(100), ");
		v_sql_createTable.append("attch_number_3 nvarchar(100), ");		
		v_sql_createTable.append("local_create_dtm timestamp, ");
		v_sql_createTable.append("local_update_dtm timestamp, ");
		v_sql_createTable.append("create_user_id nvarchar(255), ");
		v_sql_createTable.append("update_user_id nvarchar(255), ");
		v_sql_createTable.append("system_create_dtm timestamp, ");
		v_sql_createTable.append("system_update_dtm timestamp ");
        v_sql_createTable.append(")");

        // // drop temp table: local_temp_maker_regstn_req
        String v_sql_dropTable = "drop table #local_temp_maker_regstn_req";

		// insert temp table: local_temp_maker_regstn_req
        StringBuffer v_sql_insertTable= new StringBuffer();
		v_sql_insertTable.append("insert into #local_temp_maker_regstn_req values ");
        v_sql_insertTable.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call sp_sm_ust_maker_rgstn_req_proc(");
        // append: in table => local temp table
        v_sql_callProc.append("i_tenant_id => ?, ");
        v_sql_callProc.append("i_table_maker => #local_temp_maker_regstn_req, ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
        v_sql_callProc.append(")");
       
        // commit option
        jdbc.execute(v_sql_commitOption);

        // execute create local temp table
		jdbc.execute(v_sql_createTable.toString());

		Collection<UpsertOutType>	v_result			= new ArrayList<>();
		Collection<MakerRestnReq>	v_inMakerRestnReq	= context.getInputData().getSourceMakerRestnReq();
        
        // insert local temp table : local_temp_maker_regstn_req
        List<Object[]> batch_table = new ArrayList<Object[]>();
        if(!v_inMakerRestnReq.isEmpty() && v_inMakerRestnReq.size() > 0){
            for(MakerRestnReq v_inRow : v_inMakerRestnReq){
                Object[] values = new Object[]
				{
					v_inRow.get("tenant_id"),
					v_inRow.get("maker_request_sequence"),
					v_inRow.get("maker_request_type_code"),
					v_inRow.get("maker_progress_status_code"),
					v_inRow.get("requestor_empno"),
					v_inRow.get("tax_id"),
					v_inRow.get("supplier_code"),
					v_inRow.get("supplier_local_name"),
					v_inRow.get("supplier_english_name"),
					v_inRow.get("country_code"),
					v_inRow.get("country_name"),
					v_inRow.get("vat_number"),
					v_inRow.get("zip_code"),
					v_inRow.get("local_address_1"),
					v_inRow.get("local_address_2"),
					v_inRow.get("local_address_3"),
					v_inRow.get("local_full_address"),
					v_inRow.get("english_address_1"),
					v_inRow.get("english_address_2"),
					v_inRow.get("english_address_3"),
					v_inRow.get("english_full_address"),
					v_inRow.get("affiliate_code"),
					v_inRow.get("affiliate_code_name"),
					v_inRow.get("company_class_code"),
					v_inRow.get("company_class_name"),
					v_inRow.get("repre_name"),
					v_inRow.get("tel_number"),
					v_inRow.get("email_address"),
					v_inRow.get("supplier_status_code"),
					v_inRow.get("supplier_status_name"),
					v_inRow.get("biz_certi_attch_number"),
					v_inRow.get("attch_number_2"),
					v_inRow.get("attch_number_3"),
					v_inRow.get("local_create_dtm"),
					v_inRow.get("local_update_dtm"),
					v_inRow.get("create_user_id"),
					v_inRow.get("update_user_id"),
					v_inRow.get("system_create_dtm"),
					v_inRow.get("system_update_dtm")
				};
                batch_table.add(values);
            }
        }

        int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable.toString(), batch_table);

		// procedure call
		List<SqlParameter> paramList = new ArrayList<SqlParameter>();
		paramList.add(new SqlParameter("i_tenant_id", Types.NVARCHAR));

        SqlReturnResultSet oReturn = new SqlReturnResultSet("o_table_message", new RowMapper<UpsertOutType>(){
            @Override
            public UpsertOutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                UpsertOutType v_row = UpsertOutType.create();
                v_row.setReturncode(v_rs.getString("returncode"));
                v_row.setReturnmessage(v_rs.getString("returnmessage"));
                v_result.add(v_row);
                return v_row;
            }
        });
        paramList.add(oReturn);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                callableStatement.setString("i_tenant_id", context.getInputData().getTenantId());
                return callableStatement;
            }
        }, paramList);

        // execute drop local temp table
		jdbc.execute(v_sql_dropTable);

        context.setResult(v_result);
        context.setCompleted();

	}
}