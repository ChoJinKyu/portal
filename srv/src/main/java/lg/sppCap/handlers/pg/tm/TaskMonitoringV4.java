package lg.sppCap.handlers.pg.tm;

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

import cds.gen.pg.taskmonitoringv4service.DeleteInputType;
import cds.gen.pg.taskmonitoringv4service.DeleteOutType;
import cds.gen.pg.taskmonitoringv4service.DeleteTaskMonitoringMasterProcContext;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringBizunit;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringCompany;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringCycle;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringIndicator;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringManager;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringMaster;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringOperation;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringPurchasingType;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringScenario;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringTypeCode;
import cds.gen.pg.taskmonitoringv4service.TaskMonitoringV4Service_;
import cds.gen.pg.taskmonitoringv4service.UpsertOutType;
import cds.gen.pg.taskmonitoringv4service.UpsertTaskMonitoringMasterProcContext;

@Component
@ServiceName(TaskMonitoringV4Service_.CDS_NAME)
public class TaskMonitoringV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    // Execute Upsert Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    @On(event = UpsertTaskMonitoringMasterProcContext.CDS_NAME)
    public void onUpsertTaskMonitoringMasterProc(UpsertTaskMonitoringMasterProcContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";

        // create temp table: local_temp_master
        StringBuffer v_sql_createTable_master = new StringBuffer();
		v_sql_createTable_master.append("create local temporary column table #local_temp_master ( ");
		v_sql_createTable_master.append("tenant_id nvarchar(5), ");
		v_sql_createTable_master.append("scenario_number bigint, ");
		v_sql_createTable_master.append("monitoring_type_code nvarchar(30), ");
		v_sql_createTable_master.append("activate_flag boolean, ");
		v_sql_createTable_master.append("monitoring_purpose blob, ");
		v_sql_createTable_master.append("scenario_desc blob, ");
		v_sql_createTable_master.append("source_system_desc blob, ");
		v_sql_createTable_master.append("local_create_dtm timestamp, ");
		v_sql_createTable_master.append("local_update_dtm timestamp, ");
		v_sql_createTable_master.append("create_user_id nvarchar(255), ");
		v_sql_createTable_master.append("update_user_id nvarchar(255), ");
		v_sql_createTable_master.append("system_create_dtm timestamp, ");
		v_sql_createTable_master.append("system_update_dtm timestamp ");
        v_sql_createTable_master.append(")");

		// create temp table: local_temp_scenario
        StringBuffer v_sql_createTable_scenario = new StringBuffer();
		v_sql_createTable_scenario.append("create local temporary column table #local_temp_scenario ( ");
		v_sql_createTable_scenario.append("tenant_id nvarchar(5), ");
		v_sql_createTable_scenario.append("scenario_number bigint, ");
		v_sql_createTable_scenario.append("language_code nvarchar(10), ");
		v_sql_createTable_scenario.append("scenario_name nvarchar(240), ");
		v_sql_createTable_scenario.append("local_create_dtm timestamp, ");
		v_sql_createTable_scenario.append("local_update_dtm timestamp, ");
		v_sql_createTable_scenario.append("create_user_id nvarchar(255), ");
		v_sql_createTable_scenario.append("update_user_id nvarchar(255), ");
		v_sql_createTable_scenario.append("system_create_dtm timestamp, ");
		v_sql_createTable_scenario.append("system_update_dtm timestamp ");
		v_sql_createTable_scenario.append(")");

		// create temp table: local_temp_company
        StringBuffer v_sql_createTable_company = new StringBuffer();
		v_sql_createTable_company.append("create local temporary column table #local_temp_company ( ");
		v_sql_createTable_company.append("tenant_id nvarchar(5), ");
		v_sql_createTable_company.append("scenario_number bigint, ");
		v_sql_createTable_company.append("company_code nvarchar(10), ");
		v_sql_createTable_company.append("local_create_dtm timestamp, ");
		v_sql_createTable_company.append("local_update_dtm timestamp, ");
		v_sql_createTable_company.append("create_user_id nvarchar(255), ");
		v_sql_createTable_company.append("update_user_id nvarchar(255), ");
		v_sql_createTable_company.append("system_create_dtm timestamp, ");
		v_sql_createTable_company.append("system_update_dtm timestamp ");
		v_sql_createTable_company.append(")");

		// create temp table: local_temp_bizunit
        StringBuffer v_sql_createTable_bizunit = new StringBuffer();
		v_sql_createTable_bizunit.append("create local temporary column table #local_temp_bizunit ( ");
		v_sql_createTable_bizunit.append("tenant_id nvarchar(5), ");
		v_sql_createTable_bizunit.append("scenario_number bigint, ");
		v_sql_createTable_bizunit.append("bizunit_code nvarchar(10), ");
		v_sql_createTable_bizunit.append("local_create_dtm timestamp, ");
		v_sql_createTable_bizunit.append("local_update_dtm timestamp, ");
		v_sql_createTable_bizunit.append("create_user_id nvarchar(255), ");
		v_sql_createTable_bizunit.append("update_user_id nvarchar(255), ");
		v_sql_createTable_bizunit.append("system_create_dtm timestamp, ");
		v_sql_createTable_bizunit.append("system_update_dtm timestamp ");
        v_sql_createTable_bizunit.append(")");

		// create temp table: local_temp_purchasingtype
        StringBuffer v_sql_createTable_purchasingtype = new StringBuffer();
		v_sql_createTable_purchasingtype.append("create local temporary column table #local_temp_purchasingtype ( ");
		v_sql_createTable_purchasingtype.append("tenant_id nvarchar(5), ");
		v_sql_createTable_purchasingtype.append("scenario_number bigint, ");
		v_sql_createTable_purchasingtype.append("monitoring_purchasing_type_code nvarchar(30), ");
		v_sql_createTable_purchasingtype.append("language_code nvarchar(10), ");
		v_sql_createTable_purchasingtype.append("monitoring_purchasing_type_name nvarchar(240), ");
		v_sql_createTable_purchasingtype.append("local_create_dtm timestamp, ");
		v_sql_createTable_purchasingtype.append("local_update_dtm timestamp, ");
		v_sql_createTable_purchasingtype.append("create_user_id nvarchar(255), ");
		v_sql_createTable_purchasingtype.append("update_user_id nvarchar(255), ");
		v_sql_createTable_purchasingtype.append("system_create_dtm timestamp, ");
		v_sql_createTable_purchasingtype.append("system_update_dtm timestamp ");
		v_sql_createTable_purchasingtype.append(")");

		// create temp table: local_temp_typecode
        StringBuffer v_sql_createTable_typecode = new StringBuffer();
		v_sql_createTable_typecode.append("create local temporary column table #local_temp_typecode ( ");
		v_sql_createTable_typecode.append("tenant_id nvarchar(5), ");
		v_sql_createTable_typecode.append("scenario_number bigint, ");
		v_sql_createTable_typecode.append("monitoring_type_code nvarchar(30), ");
		v_sql_createTable_typecode.append("language_code nvarchar(10), ");
		v_sql_createTable_typecode.append("monitoring_type_name nvarchar(240), ");
		v_sql_createTable_typecode.append("local_create_dtm timestamp, ");
		v_sql_createTable_typecode.append("local_update_dtm timestamp, ");
		v_sql_createTable_typecode.append("create_user_id nvarchar(255), ");
		v_sql_createTable_typecode.append("update_user_id nvarchar(255), ");
		v_sql_createTable_typecode.append("system_create_dtm timestamp, ");
		v_sql_createTable_typecode.append("system_update_dtm timestamp ");
		v_sql_createTable_typecode.append(")");

		// create temp table: local_temp_manager
        StringBuffer v_sql_createTable_manager = new StringBuffer();
		v_sql_createTable_manager.append("create local temporary column table #local_temp_manager ( ");
		v_sql_createTable_manager.append("tenant_id nvarchar(5), ");
		v_sql_createTable_manager.append("scenario_number bigint, ");
		v_sql_createTable_manager.append("monitoring_manager_empno nvarchar(30), ");
		v_sql_createTable_manager.append("monitoring_super_authority_flag boolean, ");
		v_sql_createTable_manager.append("local_create_dtm timestamp, ");
		v_sql_createTable_manager.append("local_update_dtm timestamp, ");
		v_sql_createTable_manager.append("create_user_id nvarchar(255), ");
		v_sql_createTable_manager.append("update_user_id nvarchar(255), ");
		v_sql_createTable_manager.append("system_create_dtm timestamp, ");
		v_sql_createTable_manager.append("system_update_dtm timestamp ");
		v_sql_createTable_manager.append(")");

		// create temp table: local_temp_operation
        StringBuffer v_sql_createTable_operation = new StringBuffer();
		v_sql_createTable_operation.append("create local temporary column table #local_temp_operation ( ");
		v_sql_createTable_operation.append("tenant_id nvarchar(5), ");
		v_sql_createTable_operation.append("scenario_number bigint, ");
		v_sql_createTable_operation.append("monitoring_operation_mode_code nvarchar(30), ");
		v_sql_createTable_operation.append("language_code nvarchar(10), ");
		v_sql_createTable_operation.append("monitoring_operation_mode_name nvarchar(240), ");
		v_sql_createTable_operation.append("local_create_dtm timestamp, ");
		v_sql_createTable_operation.append("local_update_dtm timestamp, ");
		v_sql_createTable_operation.append("create_user_id nvarchar(255), ");
		v_sql_createTable_operation.append("update_user_id nvarchar(255), ");
		v_sql_createTable_operation.append("system_create_dtm timestamp, ");
		v_sql_createTable_operation.append("system_update_dtm timestamp ");
        v_sql_createTable_operation.append(")");
		
		// create temp table: local_temp_cycle
        StringBuffer v_sql_createTable_cycle = new StringBuffer();
		v_sql_createTable_cycle.append("create local temporary column table #local_temp_cycle ( ");
		v_sql_createTable_cycle.append("tenant_id nvarchar(5), ");
		v_sql_createTable_cycle.append("scenario_number bigint, ");
		v_sql_createTable_cycle.append("monitoring_cycle_code nvarchar(10), ");
		v_sql_createTable_cycle.append("language_code nvarchar(10), ");
		v_sql_createTable_cycle.append("monitoring_cycle_name nvarchar(240), ");
		v_sql_createTable_cycle.append("local_create_dtm timestamp, ");
		v_sql_createTable_cycle.append("local_update_dtm timestamp, ");
		v_sql_createTable_cycle.append("create_user_id nvarchar(255), ");
		v_sql_createTable_cycle.append("update_user_id nvarchar(255), ");
		v_sql_createTable_cycle.append("system_create_dtm timestamp, ");
		v_sql_createTable_cycle.append("system_update_dtm timestamp ");
        v_sql_createTable_cycle.append(")");
		
		// create temp table: local_temp_indicator
        StringBuffer v_sql_createTable_indicator = new StringBuffer();
		v_sql_createTable_indicator.append("create local temporary column table #local_temp_indicator ( ");
		v_sql_createTable_indicator.append("tenant_id nvarchar(5), ");
		v_sql_createTable_indicator.append("scenario_number bigint, ");
		v_sql_createTable_indicator.append("monitoring_indicator_id bigint, ");
		v_sql_createTable_indicator.append("monitoring_indicator_sequence bigint, ");
		v_sql_createTable_indicator.append("monitoring_ind_number_cd nvarchar(30), ");		
		v_sql_createTable_indicator.append("monitoring_ind_condition_cd nvarchar(10), ");
		v_sql_createTable_indicator.append("monitoring_indicator_start_value nvarchar(100), ");
		v_sql_createTable_indicator.append("monitoring_indicator_last_value nvarchar(100), ");
		v_sql_createTable_indicator.append("monitoring_indicator_grade nvarchar(10), ");
		v_sql_createTable_indicator.append("monitoring_ind_compare_base_cd nvarchar(30), ");		
		v_sql_createTable_indicator.append("local_create_dtm timestamp, ");
		v_sql_createTable_indicator.append("local_update_dtm timestamp, ");
		v_sql_createTable_indicator.append("create_user_id nvarchar(255), ");
		v_sql_createTable_indicator.append("update_user_id nvarchar(255), ");
		v_sql_createTable_indicator.append("system_create_dtm timestamp, ");
		v_sql_createTable_indicator.append("system_update_dtm timestamp ");
        v_sql_createTable_indicator.append(")");

        // // drop temp table:
        String v_sql_dropTableMaster =          "drop table #local_temp_master";
        String v_sql_dropTableMScenario =       "drop table #local_temp_scenario";
        String v_sql_dropTableCompany =         "drop table #local_temp_company";
        String v_sql_dropTableBizunit =         "drop table #local_temp_bizunit";
        String v_sql_dropTablePurchasingType =  "drop table #local_temp_purchasingtype";
        String v_sql_dropTableMTypeCode =       "drop table #local_temp_typecode";
        String v_sql_dropTableManager =         "drop table #local_temp_manager";
        String v_sql_dropTableOperation =       "drop table #local_temp_operation";		
		String v_sql_dropTableCycle =       	"drop table #local_temp_cycle";
		String v_sql_dropTableIndicator =       "drop table #local_temp_indicator";

		// insert temp table: master
        StringBuffer v_sql_insertTable_master = new StringBuffer();
		v_sql_insertTable_master.append("insert into #local_temp_master values ");
        v_sql_insertTable_master.append("(?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// insert table: scenario
        StringBuffer v_sql_insertTable_scenario = new StringBuffer();
		v_sql_insertTable_scenario.append("insert into #local_temp_scenario values ");
		v_sql_insertTable_scenario.append("(?,?,?,?,?,?,?,?,?,?)");

		// insert temp table: company
        StringBuffer v_sql_insertTable_company = new StringBuffer();
		v_sql_insertTable_company.append("insert into #local_temp_company values ");
        v_sql_insertTable_company.append("(?,?,?,?,?,?,?,?,?)");

		// insert temp table: bizunit
        StringBuffer v_sql_insertTable_bizunit = new StringBuffer();
		v_sql_insertTable_bizunit.append("insert into #local_temp_bizunit values ");
        v_sql_insertTable_bizunit.append("(?,?,?,?,?,?,?,?,?)");

		// insert temp table: purchasingtype
        StringBuffer v_sql_insertTable_purchasingtype = new StringBuffer();
		v_sql_insertTable_purchasingtype.append("insert into #local_temp_purchasingtype values ");
		v_sql_insertTable_purchasingtype.append("(?,?,?,?,?,?,?,?,?,?,?)");

		// insert temp table: typecode
        StringBuffer v_sql_insertTable_typecode = new StringBuffer();
		v_sql_insertTable_typecode.append("insert into #local_temp_typecode values ");
		v_sql_insertTable_typecode.append("(?,?,?,?,?,?,?,?,?,?,?)");

		// insert temp table: manager
        StringBuffer v_sql_insertTable_manager = new StringBuffer();
		v_sql_insertTable_manager.append("insert into #local_temp_manager values ");
		v_sql_insertTable_manager.append("(?,?,?,?,?,?,?,?,?,?)");

		// insert temp table: operation
        StringBuffer v_sql_insertTable_operation = new StringBuffer();
		v_sql_insertTable_operation.append("insert into #local_temp_operation values ");
        v_sql_insertTable_operation.append("(?,?,?,?,?,?,?,?,?,?,?)");
		
		// insert temp table: cycle
        StringBuffer v_sql_insertTable_cycle = new StringBuffer();
		v_sql_insertTable_cycle.append("insert into #local_temp_cycle values ");
        v_sql_insertTable_cycle.append("(?,?,?,?,?,?,?,?,?,?,?)");
		
		// insert temp table: indicator
        StringBuffer v_sql_insertTable_indicator = new StringBuffer();
		v_sql_insertTable_indicator.append("insert into #local_temp_indicator values ");
        v_sql_insertTable_indicator.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call pg_tm_ust_master_proc(");
        // append: in table => local temp table
        v_sql_callProc.append("i_tenant_id => ?, ");
        v_sql_callProc.append("i_table_master => #local_temp_master, ");
		v_sql_callProc.append("i_table_scenario => #local_temp_scenario, ");
		v_sql_callProc.append("i_table_company => #local_temp_company, ");
        v_sql_callProc.append("i_table_bizunit => #local_temp_bizunit, ");
		v_sql_callProc.append("i_table_purchasing_type => #local_temp_purchasingtype, ");
		v_sql_callProc.append("i_table_type => #local_temp_typecode, ");
		v_sql_callProc.append("i_table_manager => #local_temp_manager, ");
		v_sql_callProc.append("i_table_operation => #local_temp_operation, ");		
		v_sql_callProc.append("i_table_cycle => #local_temp_cycle, ");
		v_sql_callProc.append("i_table_indicator => #local_temp_indicator, ");
		
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
        v_sql_callProc.append(")");
       
        // commit option
        jdbc.execute(v_sql_commitOption);

        // execute create local temp table
		jdbc.execute(v_sql_createTable_master.toString());
		jdbc.execute(v_sql_createTable_scenario.toString());
		jdbc.execute(v_sql_createTable_company.toString());
		jdbc.execute(v_sql_createTable_bizunit.toString());
		jdbc.execute(v_sql_createTable_purchasingtype.toString());
		jdbc.execute(v_sql_createTable_typecode.toString());
		jdbc.execute(v_sql_createTable_manager.toString());
		jdbc.execute(v_sql_createTable_operation.toString());		
		jdbc.execute(v_sql_createTable_cycle.toString());
		jdbc.execute(v_sql_createTable_indicator.toString());

		Collection<UpsertOutType>	v_result		= new ArrayList<>();

		Collection<TaskMonitoringMaster>			v_inMaster			= context.getInputData().getSourceMaster();
		Collection<TaskMonitoringScenario>          v_inScenario		= context.getInputData().getSourceScenario();
		Collection<TaskMonitoringCompany>			v_inCompany			= context.getInputData().getSourceCompany();
        Collection<TaskMonitoringBizunit>			v_inBizunit			= context.getInputData().getSourceBizunit();
		Collection<TaskMonitoringPurchasingType>    v_inPurchasingType	= context.getInputData().getSourcePurchasingType();
		Collection<TaskMonitoringTypeCode>          v_inTypeCode		= context.getInputData().getSourceTypeCode();
		Collection<TaskMonitoringManager>			v_inManager			= context.getInputData().getSourceManager();
		Collection<TaskMonitoringOperation>         v_inOperation		= context.getInputData().getSourceOperation();		
		Collection<TaskMonitoringCycle>         	v_inCycle			= context.getInputData().getSourceCycle();
		Collection<TaskMonitoringIndicator>         v_inIndicator		= context.getInputData().getSourceIndicator();
        
        // insert local temp table : master
        List<Object[]> batch_master = new ArrayList<Object[]>();
        if(!v_inMaster.isEmpty() && v_inMaster.size() > 0){
            for(TaskMonitoringMaster v_inRow : v_inMaster){
                Object[] values = new Object[]
				{
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
                batch_master.add(values);
            }
        }

        int[] updateCounts_master = jdbc.batchUpdate(v_sql_insertTable_master.toString(), batch_master);

		// insert local temp table : scenario
        List<Object[]> batch_scenario = new ArrayList<Object[]>();
        if(!v_inScenario.isEmpty() && v_inScenario.size() > 0){
            for(TaskMonitoringScenario v_inRow : v_inScenario){
                Object[] values = new Object[]
				{
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
                batch_scenario.add(values);
            }
        }

        int[] updateCounts_scenario = jdbc.batchUpdate(v_sql_insertTable_scenario.toString(), batch_scenario);

		// insert local temp table : company
        List<Object[]> batch_company = new ArrayList<Object[]>();
        if(!v_inCompany.isEmpty() && v_inCompany.size() > 0){
            for(TaskMonitoringCompany v_inRow : v_inCompany){
                Object[] values = new Object[]
				{
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
                batch_company.add(values);
            }
        }

        int[] updateCounts_company = jdbc.batchUpdate(v_sql_insertTable_company.toString(), batch_company);

		// insert local temp table : bizunit
        List<Object[]> batch_bizunit = new ArrayList<Object[]>();
        if(!v_inBizunit.isEmpty() && v_inBizunit.size() > 0){
            for(TaskMonitoringBizunit v_inRow : v_inBizunit){
                Object[] values = new Object[]
				{
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
                batch_bizunit.add(values);
            }
        }

        int[] updateCounts_bizunit = jdbc.batchUpdate(v_sql_insertTable_bizunit.toString(), batch_bizunit);

		// insert local temp table : purchasingtype
        List<Object[]> batch_purchasingtype = new ArrayList<Object[]>();
        if(!v_inPurchasingType.isEmpty() && v_inPurchasingType.size() > 0){
            for(TaskMonitoringPurchasingType v_inRow : v_inPurchasingType){
                Object[] values = new Object[]
				{
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
                batch_purchasingtype.add(values);
            }
        }

        int[] updateCounts_purchasingtype = jdbc.batchUpdate(v_sql_insertTable_purchasingtype.toString(), batch_purchasingtype);

		// insert local temp table : typecode
        List<Object[]> batch_typecode = new ArrayList<Object[]>();
        if(!v_inTypeCode.isEmpty() && v_inTypeCode.size() > 0){
            for(TaskMonitoringTypeCode v_inRow : v_inTypeCode){
                Object[] values = new Object[]
				{
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
                batch_typecode.add(values);
            }
        }

        int[] updateCounts_typecode = jdbc.batchUpdate(v_sql_insertTable_typecode.toString(), batch_typecode);

		// insert local temp table : manager
        List<Object[]> batch_manager = new ArrayList<Object[]>();
        if(!v_inManager.isEmpty() && v_inManager.size() > 0){
            for(TaskMonitoringManager v_inRow : v_inManager){
                Object[] values = new Object[]
				{
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
                batch_manager.add(values);
            }
        }

        int[] updateCounts_manager = jdbc.batchUpdate(v_sql_insertTable_manager.toString(), batch_manager);

		// insert local temp table : operation
        List<Object[]> batch_operation = new ArrayList<Object[]>();
        if(!v_inOperation.isEmpty() && v_inOperation.size() > 0){
            for(TaskMonitoringOperation v_inRow : v_inOperation){
                Object[] values = new Object[]
				{
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
                batch_operation.add(values);
            }
        }

        int[] updateCounts_batch_operation = jdbc.batchUpdate(v_sql_insertTable_operation.toString(), batch_operation);

		// insert local temp table : cycle
        List<Object[]> batch_cycle = new ArrayList<Object[]>();
        if(!v_inCycle.isEmpty() && v_inCycle.size() > 0){
            for(TaskMonitoringCycle v_inRow : v_inCycle){
                Object[] values = new Object[]
				{
					v_inRow.get("tenant_id"),
					v_inRow.get("scenario_number"),
					v_inRow.get("monitoring_cycle_code"),
					v_inRow.get("language_code"),
					v_inRow.get("monitoring_cycle_name"),
					v_inRow.get("local_create_dtm"),
					v_inRow.get("local_update_dtm"),
					v_inRow.get("create_user_id"),
					v_inRow.get("update_user_id"),
					v_inRow.get("system_create_dtm"),
					v_inRow.get("system_update_dtm")
				};
                batch_cycle.add(values);
            }
        }

        int[] updateCounts_batch_cycle = jdbc.batchUpdate(v_sql_insertTable_cycle.toString(), batch_cycle);

		// insert local temp table : indicator
        List<Object[]> batch_indicator = new ArrayList<Object[]>();
        if(!v_inIndicator.isEmpty() && v_inIndicator.size() > 0){
            for(TaskMonitoringIndicator v_inRow : v_inIndicator){
                Object[] values = new Object[]
				{
					v_inRow.get("tenant_id"),
					v_inRow.get("scenario_number"),
					v_inRow.get("monitoring_indicator_id"),
					v_inRow.get("monitoring_indicator_sequence"),
					v_inRow.get("monitoring_ind_number_cd"),					
					v_inRow.get("monitoring_ind_condition_cd"),
					v_inRow.get("monitoring_indicator_start_value"),
					v_inRow.get("monitoring_indicator_last_value"),
					v_inRow.get("monitoring_indicator_grade"),
					v_inRow.get("monitoring_ind_compare_base_cd"),					
					v_inRow.get("local_create_dtm"),
					v_inRow.get("local_update_dtm"),
					v_inRow.get("create_user_id"),
					v_inRow.get("update_user_id"),
					v_inRow.get("system_create_dtm"),
					v_inRow.get("system_update_dtm")
				};
                batch_indicator.add(values);
            }
        }

        int[] updateCounts_batch_indicator = jdbc.batchUpdate(v_sql_insertTable_indicator.toString(), batch_indicator);

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
		jdbc.execute(v_sql_dropTableMaster);
		jdbc.execute(v_sql_dropTableMScenario);
		jdbc.execute(v_sql_dropTableCompany);
		jdbc.execute(v_sql_dropTableBizunit);
		jdbc.execute(v_sql_dropTablePurchasingType);
		jdbc.execute(v_sql_dropTableMTypeCode);
		jdbc.execute(v_sql_dropTableManager);
		jdbc.execute(v_sql_dropTableOperation);
		jdbc.execute(v_sql_dropTableCycle);
		jdbc.execute(v_sql_dropTableIndicator);

        context.setResult(v_result);
        context.setCompleted();

	}

    // Execute Delete Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    @On(event = DeleteTaskMonitoringMasterProcContext.CDS_NAME)
    public void onDeleteTaskMonitoringMasterProc(DeleteTaskMonitoringMasterProcContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";

		// create temp table: local_temp
        StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("create local temporary column table #local_temp (");
		v_sql_createTable.append("tenant_id nvarchar(5), ");
		v_sql_createTable.append("scenario_number bigint");
        v_sql_createTable.append(")");
        
        // drop temp table: local_temp
        String v_sql_dropTable = "drop table #local_temp";
        
		// insert temp table: local_temp
        StringBuffer v_sql_inserTable= new StringBuffer();
		v_sql_inserTable.append("insert into #local_temp values ");
        v_sql_inserTable.append("(?,?)");
        
		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call pg_tm_del_master_proc(");
		// append: in table => local temp table
		v_sql_callProc.append("i_table_parameters => #local_temp, ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
        v_sql_callProc.append(")");
        
        Collection<DeleteInputType> v_inParmeters = context.getInputData();
        Collection<DeleteOutType> v_result = new ArrayList<>();
        
        // Commit Option
        jdbc.execute(v_sql_commitOption);

		// execute create local temp table
		jdbc.execute(v_sql_createTable.toString());

		// insert local temp table
        List<Object[]> batch_delete = new ArrayList<Object[]>();
        if(!v_inParmeters.isEmpty() && v_inParmeters.size() > 0){
            for(DeleteInputType v_inRow : v_inParmeters){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("scenario_number")};
                batch_delete.add(values);
                }
        }

        int[] updateCounts_delete = jdbc.batchUpdate(v_sql_inserTable.toString(), batch_delete);

		// procedure call
        SqlReturnResultSet oReturn = new SqlReturnResultSet("o_table_message", new RowMapper<DeleteOutType>(){
            @Override
            public DeleteOutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                DeleteOutType v_row = DeleteOutType.create();
                v_row.setReturncode(v_rs.getString("returncode"));
                v_row.setReturnmessage(v_rs.getString("returnmessage"));
                v_result.add(v_row);
                return v_row;
            }
        });
		
        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oReturn);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                return callableStatement;
            }
        }, paramList);

        // execute drop local temp table
        jdbc.execute(v_sql_dropTable);

        context.setResult(v_result);
        context.setCompleted();
	}
}