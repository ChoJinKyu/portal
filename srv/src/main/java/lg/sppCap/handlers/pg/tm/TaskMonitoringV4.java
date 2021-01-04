package lg.sppCap.handlers.pg.tm;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import javax.sql.DataSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Iterator;
import java.util.stream.Stream;

import java.time.Instant;
import java.beans.Introspector;
import java.beans.BeanInfo;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.Insert;

import cds.gen.pg.taskMonitoringV4Service.*;

@Component
@ServiceName(taskMonitoringV4Service_.CDS_NAME)
public class taskMonitoringV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    // Execute Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    @On(event = UpsertTaskMonitoringMasterProcContext.CDS_NAME)
    public void onUpsertTaskMonitoringMasterProc(UpsertTaskMonitoringMasterProcContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        string v_sql_commitOption = "set transaction autocommit ddl off;";

        // create temp table: local_temp_master
        string v_sql_createTable_master = new StringBuffer();
		v_sql_createTable_master.append("create local temporary column table #local_temp_master ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("monitoring_type_code : nvarchar(30), ")
							   .append("activate_flag : boolean, ")
							   .append("monitoring_purpose : blob, ")
							   .append("scenario_desc : blob, ")
							   .append("source_system_desc : blob, ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_company
        string v_sql_createTable_company = new StringBuffer();
		v_sql_createTable_company.append("create local temporary column table #local_temp_company ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("company_code : nvarchar(10), ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_bizunit
        string v_sql_createTable_bizunit = new StringBuffer();
		v_sql_createTable_bizunit.append("create local temporary column table #local_temp_bizunit ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("bizunit_code : nvarchar(10), ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_manager
        string v_sql_createTable_manager = new StringBuffer();
		v_sql_createTable_manager.append("create local temporary column table #local_temp_manager ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("monitoring_manager_empno : nvarchar(30), ")
							   .append("monitoring_super_authority_flag : boolean, ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_operation
        string v_sql_createTable_operation = new StringBuffer();
		v_sql_createTable_operation.append("create local temporary column table #local_temp_operation ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("monitoring_operation_mode_code : nvarchar(30), ")
							   .append("language_code : nvarchar(10), ")
							   .append("monitoring_operation_mode_name : nvarchar(240), ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_purchasingtype
        string v_sql_createTable_purchasingtype = new StringBuffer();
		v_sql_createTable_purchasingtype.append("create local temporary column table #local_temp_purchasingtype ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("monitoring_purchasing_type_code : nvarchar(30), ")
							   .append("language_code : nvarchar(10), ")
							   .append("monitoring_purchasing_type_name : nvarchar(240), ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_scenario
        string v_sql_createTable_scenario = new StringBuffer();
		v_sql_createTable_scenario.append("create local temporary column table #local_temp_scenario ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("language_code : nvarchar(10), ")
							   .append("scenario_name : nvarchar(240), ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
		;
		// create temp table: local_temp_typecode
        string v_sql_createTable_typecode = new StringBuffer();
		v_sql_createTable_typecode.append("create local temporary column table #local_temp_typecode ( ")
							   .append("tenant_id : nvarchar(5), ")
							   .append("scenario_number : bigint, ")
							   .append("monitoring_type_code : nvarchar(30), ")
							   .append("language_code : nvarchar(10), ")
							   .append("monitoring_type_name : nvarchar(240), ")
							   .append("local_create_dtm : timestamp, ")
							   .append("local_update_dtm : timestamp, ")
							   .append("create_user_id : nvarchar(255), ")
							   .append("update_user_id : nvarchar(255), ")
							   .append("system_create_dtm : timestamp, ")
							   .append("system_update_dtm : timestamp ")
							   .append(")")
        ;
/*********************************************************************************************************************/
        String v_sql_dropTableMaster =          "DROP TABLE #local_temp_master";
        String v_sql_dropTableCompany =         "DROP TABLE #local_temp_company";
        String v_sql_dropTableBizunit =         "DROP TABLE #local_temp_bizunit";
        String v_sql_dropTableManager =         "DROP TABLE #local_temp_manager";
        String v_sql_dropTableOperation =       "DROP TABLE #local_temp_operation";
        String v_sql_dropTablePurchasingType =  "DROP TABLE #local_temp_purchasingtype";
        String v_sql_dropTableMScenario =       "DROP TABLE #local_temp_scenario";
        String v_sql_dropTableMTypeCode =       "DROP TABLE #local_temp_typecode";
/*********************************************************************************************************************/
		// insert table: master
        string v_sql_inserTable_master= new StringBuffer();
		v_sql_inserTable_master.append("insert into #local_temp_master values ")
							.append("(?,?,?,?,?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: company
        string v_sql_inserTable_company= new StringBuffer();
		v_sql_inserTable_company.append("insert into #local_temp_company values ")
							.append("(?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: bizunit
        string v_sql_inserTable_bizunit= new StringBuffer();
		v_sql_inserTable_bizunit.append("insert into #local_temp_bizunit values ")
							.append("(?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: manager
        string v_sql_inserTable_manager= new StringBuffer();
		v_sql_inserTable_manager.append("insert into #local_temp_manager values ")
							.append("(?,?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: operation
        string v_sql_inserTable_operation= new StringBuffer();
		v_sql_inserTable_operation.append("insert into #local_temp_operation values ")
							.append("(?,?,?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: purchasingtype
        string v_sql_inserTable_purchasingtype= new StringBuffer();
		v_sql_inserTable_purchasingtype.append("insert into #local_temp_purchasingtype values ")
							.append("(?,?,?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: scenario
        string v_sql_inserTable_scenario= new StringBuffer();
		v_sql_inserTable_scenario.append("insert into #local_temp_scenario values ")
							.append("(?,?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
		// insert table: typecode
        string v_sql_inserTable_typecode= new StringBuffer();
		v_sql_inserTable_typecode.append("insert into #local_temp_typecode values ")
							.append("(?,?,?,?,?,?,?,?,?,?,?)")
							.append(")")
		;
/*********************************************************************************************************************/
		// call procedure
        string v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call pg_tm_ust_master_proc(")
		// append: in table => local temp table
						.append("i_table_master => #local_temp_master, ")
						.append("i_table_company => #local_temp_company, ")
						.append("i_table_bizunit => #local_temp_bizunit, ")
						.append("i_table_manager => #local_temp_manager, ")
						.append("i_table_operation => #local_temp_operation, ")
						.append("i_table_purchasing_type => #local_temp_purchasingtype, ")
						.append("i_table_scenario => #local_temp_scenario, ")
						.append("i_table_type => #local_temp_typecode, ")
		// append: out table => local temp table
						.append("o_table_master => ?, ")
						.append("o_table_company => ?, ")
						.append("o_table_bizunit => ?, ")
						.append("o_table_manager => ?, ")
						.append("o_table_operation => ?, ")
						.append("o_table_purchasing_type => ?, ")
						.append("o_table_scenario => ?, ")
						.append("o_table_type => ?, ")
		// append: end
						.append(")")
		;
/*********************************************************************************************************************/
		Collection<TaskMonitoringMaster>			v_inMaster			= context.getInputData().getSourceMaster();
		Collection<TaskMonitoringCompany>			v_inCompany			= context.getInputData().getSourceCompany();
		Collection<TaskMonitoringBizunit>			v_inBizunit			= context.getInputData().getSourceBizunit();
		Collection<TaskMonitoringManager>			v_inManager			= context.getInputData().getSourceManager();
		Collection<TaskMonitoringOperation>         v_inOperation		= context.getInputData().getSourceOperation();
		Collection<TaskMonitoringPurchasingType>    v_inPurchasingType	= context.getInputData().getSourcePurchasingType();
		Collection<TaskMonitoringScenario>          v_inScenario		= context.getInputData().getSourceScenario();
		Collection<TaskMonitoringTypeCode>          v_inTypeCode		= context.getInputData().getSourceTypeCode();
/*********************************************************************************************************************/
		UpsertTargetType v_result = UpsertTargetType.create();
		Collection<TaskMonitoringMaster>			v_resultMaster			= new ArrayList<>();
		Collection<TaskMonitoringCompany>			v_resultCompany			= new ArrayList<>();
		Collection<TaskMonitoringBizunit>			v_resultBizunit			= new ArrayList<>();
		Collection<TaskMonitoringManager>			v_resultManager			= new ArrayList<>();
		Collection<TaskMonitoringOperation>         v_resultOperation		= new ArrayList<>();
		Collection<TaskMonitoringPurchasingType>    v_resultPurchasingType	= new ArrayList<>();
		Collection<TaskMonitoringScenario>          v_resultScenario		= new ArrayList<>();
		Collection<TaskMonitoringTypeCode>          v_resultTypeCode		= new ArrayList<>();
/*********************************************************************************************************************/
        
        // Commit Option
        jdbc.execute(v_sql_commitOption);

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable_master);
        jdbc.execute(v_sql_createTable_company);
        jdbc.execute(v_sql_createTable_bizunit);
        jdbc.execute(v_sql_createTable_manager);
        jdbc.execute(v_sql_createTable_operation);
        jdbc.execute(v_sql_createTable_purchasingtype);
        jdbc.execute(v_sql_createTable_scenario);
        jdbc.execute(v_sql_createTable_typecode);

        // insert local temp table: master
        List<Object[]> batchMaster = new ArrayList<Object[]>();
        if(!v_inMaster.isEmpty() && v_inMaster.size() > 0){
            for(TaskMonitoringMaster v_inRow : v_inMaster){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("monitoring_type_code"),
                    v_inRow.get("activate_flag"),
                    v_inRow.get("monitoring_purpose"),
                    v_inRow.get("scenario_desc"),
                    v_inRow.get("source_system_desc"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchMaster.add(values);
            }
        }

        int[] updateCountsMaster = jdbc.batchUpdate(v_stat_insert_master, batchMaster);

        // insert local temp table: company
        List<Object[]> batchCompany = new ArrayList<Object[]>();
        if(!v_inCompany.isEmpty() && v_inCompany.size() > 0){
            for(TaskMonitoringCompany v_inRow : v_inCompany){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("company_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchCompany.add(values);
            }
        }

        int[] updateCountsCompany = jdbc.batchUpdate(v_stat_insert_company, batchCompany);

        // insert local temp table: bizunit
        List<Object[]> batchBizunit = new ArrayList<Object[]>();
        if(!v_inBizunit.isEmpty() && v_inBizunit.size() > 0){
            for(TaskMonitoringBizunit v_inRow : v_inBizunit){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("bizunit_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchBizunit.add(values);
            }
        }

        int[] updateCountsBizunit = jdbc.batchUpdate(v_stat_insert_bizunit, batchBizunit);

        // insert local temp table: manager
        List<Object[]> batchManager = new ArrayList<Object[]>();
        if(!v_inManager.isEmpty() && v_inManager.size() > 0){
            for(TaskMonitoringManager v_inRow : v_inManager){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("monitoring_manager_empno"),
                    v_inRow.get("monitoring_super_authority_flag"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchManager.add(values);
            }
        }

        int[] updateCountsManager = jdbc.batchUpdate(v_stat_insert_manager, batchManager);

        // insert local temp table: operation
        List<Object[]> batchOperation = new ArrayList<Object[]>();
        if(!v_inOperation.isEmpty() && v_inOperation.size() > 0){
            for(TaskMonitoringOperation v_inRow : v_inOperation){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("monitoring_operation_mode_code"),
                    v_inRow.get("language_code"),
                    v_inRow.get("monitoring_operation_mode_name"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchOperation.add(values);
            }
        }

        int[] updateCountsOperation = jdbc.batchUpdate(v_stat_insert_operation, batchOperation);

        // insert local temp table: purchasingtype
        List<Object[]> batchPurchasingType = new ArrayList<Object[]>();
        if(!v_inPurchasingType.isEmpty() && v_inPurchasingType.size() > 0){
            for(TaskMonitoringPurchasingType v_inRow : v_inPurchasingType){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("monitoring_purchasing_type_code"),
                    v_inRow.get("language_code"),
                    v_inRow.get("monitoring_purchasing_type_name"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchPurchasingType.add(values);
            }
        }

        int[] updateCountsPurchasingType = jdbc.batchUpdate(v_stat_insert_purchasingtype, batchPurchasingType);

        // insert local temp table: scenario
        List<Object[]> batchScenario = new ArrayList<Object[]>();
        if(!v_inScenario.isEmpty() && v_inScenario.size() > 0){
            for(TaskMonitoringScenario v_inRow : v_inScenario){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("language_code"),
                    v_inRow.get("scenario_name"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchScenario.add(values);
            }
        }

        int[] updateCountsScenario = jdbc.batchUpdate(v_stat_insert_scenario, batchScenario);

        // insert local temp table: typecode
        List<Object[]> batchTypecode = new ArrayList<Object[]>();
        if(!v_inTypeCode.isEmpty() && v_inTypeCode.size() > 0){
            for(TaskMonitoringTypeCode v_inRow : v_inTypeCode){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number"),
                    v_inRow.get("monitoring_type_code"),
                    v_inRow.get("language_code"),
                    v_inRow.get("monitoring_type_name"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
                };
                batchTypecode.add(values);
            }
        }

        int[] updateCountsTypecode = jdbc.batchUpdate(v_stat_insert_typecode, batchTypecode);
/*********************************************************************************************************************/

        // call procedure
        // v_resultMaster
        SqlReturnResultSet oTableMaster = new SqlReturnResultSet("o_table_master", new RowMapper<TaskMonitoringMaster>(){
            @Override
            public TaskMonitoringMaster mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringMaster v_row = TaskMonitoringMaster.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setMonitoringTypeCode(v_rs.getString("monitoring_type_code"));
                v_row.setActivateFlag(v_rs.getBoolean("activate_flag"));
                v_row.setMonitoringPurpose(v_rs.getBlob("monitoring_purpose"));
                v_row.setScenarioDesc(v_rs.getBlob("scenario_desc"));
                v_row.setSourceSystemDesc(v_rs.getBlob("source_system_desc"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultMaster.add(v_row);
                return v_row;
            }
        });

        // v_resultCompany
        SqlReturnResultSet oTableCompany = new SqlReturnResultSet("o_table_company", new RowMapper<TaskMonitoringCompany>(){
            @Override
            public TaskMonitoringCompany mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringCompany v_row = TaskMonitoringCompany.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setCompanyCode(v_rs.getString("company_code"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultCompany.add(v_row);
                return v_row;
            }
        });

        // v_resultBizunit
        SqlReturnResultSet oTableBizunit = new SqlReturnResultSet("o_table_bizunit", new RowMapper<TaskMonitoringBizunit>(){
            @Override
            public TaskMonitoringBizunit mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringBizunit v_row = TaskMonitoringBizunit.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setBizunitCode(v_rs.getString("bizunit_code"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultBizunit.add(v_row);
                return v_row;
            }
        });

        // v_resultManager
        SqlReturnResultSet oTableManager = new SqlReturnResultSet("o_table_manager", new RowMapper<TaskMonitoringManager>(){
            @Override
            public TaskMonitoringManager mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringManager v_row = TaskMonitoringManager.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setMonitoringManagerEmpno(v_rs.getString("monitoring_manager_empno"));
                v_row.setMonitoringSuperAuthorityFlag(v_rs.getBoolean("monitoring_super_authority_flag"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultManager.add(v_row);
                return v_row;
            }
        });

        // v_resultOperation
        SqlReturnResultSet oTableOperation = new SqlReturnResultSet("o_table_operation", new RowMapper<TaskMonitoringOperation>(){
            @Override
            public TaskMonitoringOperation mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringOperation v_row = TaskMonitoringOperation.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setMonitoringOperationModeCode(v_rs.getString("monitoring_operation_mode_code"));
                v_row.setLanguageCode(v_rs.getString("language_code"));
                v_row.setMonitoringOperationModeName(v_rs.getString("monitoring_operation_mode_name"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultOperation.add(v_row);
                return v_row;
            }
        });

        // v_resultPurchasingType
        SqlReturnResultSet oTablePurchasingType = new SqlReturnResultSet("o_table_purchasing_type", new RowMapper<TaskMonitoringPurchasingType>(){
            @Override
            public TaskMonitoringPurchasingType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringPurchasingType v_row = TaskMonitoringPurchasingType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setMonitoringPurchasingTypeCode(v_rs.getString("monitoring_purchasing_type_code"));
                v_row.setLanguageCode(v_rs.getString("language_code"));
                v_row.setMonitoringPurchasingTypeName(v_rs.getString("monitoring_purchasing_type_name"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultPurchasingType.add(v_row);
                return v_row;
            }
        });

        // v_resultScenario
        SqlReturnResultSet oTableScenario = new SqlReturnResultSet("o_table_scenario", new RowMapper<TaskMonitoringScenario>(){
            @Override
            public TaskMonitoringScenario mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringScenario v_row = TaskMonitoringPurchasingType.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setLanguageCode(v_rs.getString("language_code"));
                v_row.setScenarioName(v_rs.getString("scenario_name"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultScenario.add(v_row);
                return v_row;
            }
        });

        // v_resultTypeCode
        SqlReturnResultSet oTableTypeCode = new SqlReturnResultSet("o_table_type", new RowMapper<TaskMonitoringTypeCode>(){
            @Override
            public TaskMonitoringTypeCode mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                TaskMonitoringTypeCode v_row = TaskMonitoringTypeCode.create();
                v_row.setTenantId(v_rs.getString("tenant_id"));
                v_row.setScenarioNumber(v_rs.getLong("scenario_number"));
                v_row.setMonitoringTypeCode(v_rs.getLong("monitoring_type_code"));
                v_row.setLanguageCode(v_rs.getString("language_code"));
                v_row.setMonitoringTypeName(v_rs.getString("monitoring_type_name"));
                v_row.setLocalCreateDtm(v_rs.getTimestamp("local_create_dtm"));
                v_row.setLocalUpdateDtm(v_rs.getTimestamp("local_update_dtm"));
                v_row.setCreateUserId(v_rs.getString("create_user_id"));
                v_row.setUpdateUserId(v_rs.getString("update_user_id"));
                v_row.setSystemCreateDtm(v_rs.getTimestamp("system_create_dtm"));
                v_row.setSystemUpdateDtm(v_rs.getTimestamp("system_update_dtm"));
                v_resultTypeCode.add(v_row);
                return v_row;
            }
        });
        
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTableMaster);
        paramList.add(oTableCompany);
        paramList.add(oTableBizunit);
        paramList.add(oTableManager);
        paramList.add(oTableOperation);
        paramList.add(oTablePurchasingType);
        paramList.add(oTableScenario);
        paramList.add(oTableTypeCode);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                return callableStatement;
            }
        }, paramList);
/*********************************************************************************************************************/
        // drop local temp table
        jdbc.execute(v_sql_dropTableMaster);
        jdbc.execute(v_sql_dropTableCompany);
        jdbc.execute(v_sql_dropTableBizunit);
        jdbc.execute(v_sql_dropTableManager);
        jdbc.execute(v_sql_dropTableOperation);
        jdbc.execute(v_sql_dropTablePurchasingType);
        jdbc.execute(v_sql_dropTableMScenario);
        jdbc.execute(v_sql_dropTableMTypeCode);

        //save result
        v_result.setTargetMaster(v_resultMaster);
        v_result.setTargetCompany(v_resultCompany);
        v_result.setTargetBizunit(v_resultBizunit);
        v_result.setTargetManager(v_resultManager);
        v_result.setTargetOperation(v_resultOperation);
        v_result.setTargetPurchasingType(v_resultPurchasingType);
        v_result.setTargetScenario(v_resultScenario);
        v_result.setTargetTypeCode(v_resultTypeCode);
        context.setResult(v_result);
        context.setCompleted();

/*
        ResultSet v_rs = null;
		try {

            Connection conn = jdbc.getDataSource().getConnection();

            // create local temp table: master
            PreparedStatement v_stat_table_master = conn.prepareStatement(v_sql_createTable_master);
            v_stat_table_master.execute();

            // insert local temp table: master
            PreparedStatement v_stat_insert_master = conn.prepareStatement(v_sql_inserTable_master);

            if(!v_inMaster.isEmpty() && v_inMaster.size() > 0){
                for(UpsertSourceType v_inRow : v_inMaster){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_master.setObject(1,	v_inRow.get("tenant_id"));
                    v_stat_insert_master.setObject(2,	v_inRow.get("scenario_number"));
                    v_stat_insert_master.setObject(3,	v_inRow.get("monitoring_type_code"));
					v_stat_insert_master.setObject(4,	v_inRow.get("activate_flag"));
					v_stat_insert_master.setObject(5,	v_inRow.get("monitoring_purpose"));
					v_stat_insert_master.setObject(6,	v_inRow.get("scenario_desc"));
					v_stat_insert_master.setObject(7,	v_inRow.get("source_system_desc"));
					v_stat_insert_master.setObject(8,	v_inRow.get("local_create_dtm"));
					v_stat_insert_master.setObject(9,	v_inRow.get("local_update_dtm"));
					v_stat_insert_master.setObject(10,	v_inRow.get("create_user_id"));
					v_stat_insert_master.setObject(11,	v_inRow.get("update_user_id"));
					v_stat_insert_master.setObject(12,	v_inRow.get("system_create_dtm"));
					v_stat_insert_master.setObject(13,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_master.addBatch();
                }

                v_stat_insert_master.executeBatch();
            }
			
            // create local temp table: company
            PreparedStatement v_stat_table_company = conn.prepareStatement(v_sql_createTable_company);
            v_stat_table_company.execute();

            // insert local temp table: company
            PreparedStatement v_stat_insert_company = conn.prepareStatement(v_sql_inserTable_company);

            if(!v_inCompany.isEmpty() && v_inCompany.size() > 0){
                for(UpsertSourceType v_inRow : v_inCompany){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_company.setObject(1,	v_inRow.get("tenant_id"));
                    v_stat_insert_company.setObject(2,	v_inRow.get("scenario_number"));
                    v_stat_insert_company.setObject(3,	v_inRow.get("company_code"));
					v_stat_insert_company.setObject(4,	v_inRow.get("local_create_dtm"));
					v_stat_insert_company.setObject(5,	v_inRow.get("local_update_dtm"));
					v_stat_insert_company.setObject(6,	v_inRow.get("create_user_id"));
					v_stat_insert_company.setObject(7,	v_inRow.get("update_user_id"));
					v_stat_insert_company.setObject(8,	v_inRow.get("system_create_dtm"));
					v_stat_insert_company.setObject(9,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_company.addBatch();
                }

                v_stat_insert_company.executeBatch();
            }

            // create local temp table: bizunit
            PreparedStatement v_stat_table_bizunit = conn.prepareStatement(v_sql_createTable_bizunit);
            v_stat_table_bizunit.execute();

            // insert local temp table: bizunit
            PreparedStatement v_stat_insert_bizunit = conn.prepareStatement(v_sql_inserTable_bizunit);

            if(!v_inBizunit.isEmpty() && v_inBizunit.size() > 0){
                for(UpsertSourceType v_inRow : v_inBizunit){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_bizunit.setObject(1,	v_inRow.get("tenant_id"));
                    v_stat_insert_bizunit.setObject(2,	v_inRow.get("scenario_number"));
                    v_stat_insert_bizunit.setObject(3,	v_inRow.get("bizunit_code"));
					v_stat_insert_bizunit.setObject(4,	v_inRow.get("local_create_dtm"));
					v_stat_insert_bizunit.setObject(5,	v_inRow.get("local_update_dtm"));
					v_stat_insert_bizunit.setObject(6,	v_inRow.get("create_user_id"));
					v_stat_insert_bizunit.setObject(7,	v_inRow.get("update_user_id"));
					v_stat_insert_bizunit.setObject(8,	v_inRow.get("system_create_dtm"));
					v_stat_insert_bizunit.setObject(9,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_bizunit.addBatch();
                }

                v_stat_insert_bizunit.executeBatch();
            }
			
            // create local temp table: manager
            PreparedStatement v_stat_table_manager = conn.prepareStatement(v_sql_createTable_manager);
            v_stat_table_manager.execute();

            // insert local temp table: manager
            PreparedStatement v_stat_insert_manager = conn.prepareStatement(v_sql_inserTable_manager);

            if(!v_inManager.isEmpty() && v_inManager.size() > 0){
                for(UpsertSourceType v_inRow : v_inManager){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_manager.setObject(1,	v_inRow.get("tenant_id"));
                    v_stat_insert_manager.setObject(2,	v_inRow.get("scenario_number"));
                    v_stat_insert_manager.setObject(3,	v_inRow.get("monitoring_manager_empno"));
					v_stat_insert_manager.setObject(4,	v_inRow.get("monitoring_super_authority_flag"));
					v_stat_insert_manager.setObject(5,	v_inRow.get("local_create_dtm"));
					v_stat_insert_manager.setObject(6,	v_inRow.get("local_update_dtm"));
					v_stat_insert_manager.setObject(7,	v_inRow.get("create_user_id"));
					v_stat_insert_manager.setObject(8,	v_inRow.get("update_user_id"));
					v_stat_insert_manager.setObject(9,	v_inRow.get("system_create_dtm"));
					v_stat_insert_manager.setObject(10,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_manager.addBatch();
                }

                v_stat_insert_manager.executeBatch();
            }
			
            // create local temp table: operation
            PreparedStatement v_stat_table_operation = conn.prepareStatement(v_sql_createTable_operation);
            v_stat_table_operation.execute();

            // insert local temp table: operation
            PreparedStatement v_stat_insert_operation = conn.prepareStatement(v_sql_inserTable_operation);

            if(!v_inOperation.isEmpty() && v_inOperation.size() > 0){
                for(UpsertSourceType v_inRow : v_inOperation){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_operation.setObject(1,	v_inRow.get("tenant_id"));
                    v_stat_insert_operation.setObject(2,	v_inRow.get("scenario_number"));
                    v_stat_insert_operation.setObject(3,	v_inRow.get("monitoring_operation_mode_code"));
					v_stat_insert_operation.setObject(4,	v_inRow.get("language_code"));
					v_stat_insert_operation.setObject(5,	v_inRow.get("monitoring_operation_mode_name"));
					v_stat_insert_operation.setObject(6,	v_inRow.get("local_create_dtm"));
					v_stat_insert_operation.setObject(7,	v_inRow.get("local_update_dtm"));
					v_stat_insert_operation.setObject(8,	v_inRow.get("create_user_id"));
					v_stat_insert_operation.setObject(9,	v_inRow.get("update_user_id"));
					v_stat_insert_operation.setObject(10,	v_inRow.get("system_create_dtm"));
					v_stat_insert_operation.setObject(11,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_operation.addBatch();
                }

                v_stat_insert_operation.executeBatch();
            }
			
            // create local temp table: purchasingtype
            PreparedStatement v_stat_table_purchasingtype = conn.prepareStatement(v_sql_createTable_purchasingtype);
            v_stat_table_purchasingtype.execute();

            // insert local temp table: purchasingtype
            PreparedStatement v_stat_insert_purchasingtype = conn.prepareStatement(v_sql_inserTable_purchasingtype);

            if(!v_inPurchasingType.isEmpty() && v_inPurchasingType.size() > 0){
                for(UpsertSourceType v_inRow : v_inPurchasingType){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_purchasingtype.setObject(1,	v_inRow.get("tenant_id"));
                    v_stat_insert_purchasingtype.setObject(2,	v_inRow.get("scenario_number"));
                    v_stat_insert_purchasingtype.setObject(3,	v_inRow.get("monitoring_purchasing_type_code"));
					v_stat_insert_purchasingtype.setObject(4,	v_inRow.get("language_code"));
					v_stat_insert_purchasingtype.setObject(5,	v_inRow.get("monitoring_purchasing_type_name"));
					v_stat_insert_purchasingtype.setObject(6,	v_inRow.get("local_create_dtm"));
					v_stat_insert_purchasingtype.setObject(7,	v_inRow.get("local_update_dtm"));
					v_stat_insert_purchasingtype.setObject(8,	v_inRow.get("create_user_id"));
					v_stat_insert_purchasingtype.setObject(9,	v_inRow.get("update_user_id"));
					v_stat_insert_purchasingtype.setObject(10,	v_inRow.get("system_create_dtm"));
					v_stat_insert_purchasingtype.setObject(11,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_purchasingtype.addBatch();
                }

                v_stat_insert_purchasingtype.executeBatch();
            }
			
            // create local temp table: scenario
            PreparedStatement v_stat_table_scenario = conn.prepareStatement(v_sql_createTable_scenario);
            v_stat_table_scenario.execute();

            // insert local temp table: scenario
            PreparedStatement v_stat_insert_scenario = conn.prepareStatement(v_sql_inserTable_scenario);

            if(!v_inScenario.isEmpty() && v_inScenario.size() > 0){
                for(UpsertSourceType v_inRow : v_inScenario){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_scenario.setObject(1,		v_inRow.get("tenant_id"));
                    v_stat_insert_scenario.setObject(2,		v_inRow.get("scenario_number"));
					v_stat_insert_scenario.setObject(3,		v_inRow.get("language_code"));
					v_stat_insert_scenario.setObject(4,		v_inRow.get("scenario_name"));
					v_stat_insert_scenario.setObject(5,		v_inRow.get("local_create_dtm"));
					v_stat_insert_scenario.setObject(6,		v_inRow.get("local_update_dtm"));
					v_stat_insert_scenario.setObject(7,		v_inRow.get("create_user_id"));
					v_stat_insert_scenario.setObject(8,		v_inRow.get("update_user_id"));
					v_stat_insert_scenario.setObject(9,		v_inRow.get("system_create_dtm"));
					v_stat_insert_scenario.setObject(10,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_scenario.addBatch();
                }

                v_stat_insert_scenario.executeBatch();
            }
			
            // create local temp table: typecode
            PreparedStatement v_stat_table_typecode = conn.prepareStatement(v_sql_createTable_typecode);
            v_stat_table_scenario.execute();

            // insert local temp table: typecode
            PreparedStatement v_stat_insert_typecode = conn.prepareStatement(v_sql_inserTable_typecode);

            if(!v_inTypeCode.isEmpty() && v_inTypeCode.size() > 0){
                for(UpsertSourceType v_inRow : v_inTypeCode){
                    // Null 인경우 SQL에 Null이 들어가도록 Object로 get/set 한다.
                    v_stat_insert_typecode.setObject(1,		v_inRow.get("tenant_id"));
                    v_stat_insert_typecode.setObject(2,		v_inRow.get("scenario_number"));
					v_stat_insert_typecode.setObject(3,		v_inRow.get("language_code"));
					v_stat_insert_typecode.setObject(4,		v_inRow.get("scenario_name"));
					v_stat_insert_typecode.setObject(5,		v_inRow.get("local_create_dtm"));
					v_stat_insert_typecode.setObject(6,		v_inRow.get("local_update_dtm"));
					v_stat_insert_typecode.setObject(7,		v_inRow.get("create_user_id"));
					v_stat_insert_typecode.setObject(8,		v_inRow.get("update_user_id"));
					v_stat_insert_typecode.setObject(9,		v_inRow.get("system_create_dtm"));
					v_stat_insert_typecode.setObject(10,	v_inRow.get("system_update_dtm"));
                    v_stat_insert_typecode.addBatch();
                }

                v_stat_insert_typecode.executeBatch();
            }

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            boolean v_isMore = v_statement_proc.execute();
            int v_resultSetNo = 0;

            // Procedure Out put 담기
            while(v_isMore){
                ResultSet v_rs = v_statement_proc.getResultSet();

                while (v_rs.next()){
					switch (v_resultSetNo) {
						case 0:
							Master v_row_master = Master.create();
							v_row_master.
							v_inMaster.add(v_row_master);
						
						case 1:
						
						case 2:
						
						case 3:
						
						case 4:
						
						case 5:
						
						case 6:
						
						case 7:
						
						case 8:
						
						default : break;
					
					}
                }

                v_isMore = v_statement_proc.getMoreResults();
                v_resultSetNo++;
            }

            v_result.setSavedHeaders(v_resultH);
            v_result.setSavedDetails(v_resultD);
            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }

    }

*/

}