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
import java.lang.String;

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

import cds.gen.pg.taskmonitoringv4service.*; 

@Component
@ServiceName(TaskMonitoringV4Service_.CDS_NAME)
public class TaskMonitoringV4 implements EventHandler {

	private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    // Execute Upsert Task Monitoring Master Data Procedure
    //@Transactional(rollbackFor = SQLException.class)
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
/*********************************************************************************************************************/
        String v_sql_dropTableMaster =          "drop table #local_temp_master";
        String v_sql_dropTableCompany =         "drop table #local_temp_company";
        String v_sql_dropTableBizunit =         "drop table #local_temp_bizunit";
        String v_sql_dropTableManager =         "drop table #local_temp_manager";
        String v_sql_dropTableOperation =       "drop table #local_temp_operation";
        String v_sql_dropTablePurchasingType =  "drop table #local_temp_purchasingtype";
        String v_sql_dropTableMScenario =       "drop table #local_temp_scenario";
        String v_sql_dropTableMTypeCode =       "drop table #local_temp_typecode";
/*********************************************************************************************************************/
		// insert table: master
        StringBuffer v_sql_insertTable_master= new StringBuffer();
		v_sql_insertTable_master.append("insert into #local_temp_master values ");
		v_sql_insertTable_master.append("(?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// insert table: company
        StringBuffer v_sql_insertTable_company= new StringBuffer();
		v_sql_insertTable_company.append("insert into #local_temp_company values ");
		v_sql_insertTable_company.append("(?,?,?,?,?,?,?,?,?)");
		// insert table: bizunit
        StringBuffer v_sql_insertTable_bizunit= new StringBuffer();
		v_sql_insertTable_bizunit.append("insert into #local_temp_bizunit values ");
		v_sql_insertTable_bizunit.append("(?,?,?,?,?,?,?,?,?)");

		// insert table: manager
        StringBuffer v_sql_insertTable_manager= new StringBuffer();
		v_sql_insertTable_manager.append("insert into #local_temp_manager values ");
		v_sql_insertTable_manager.append("(?,?,?,?,?,?,?,?,?,?)");

		// insert table: operation
        StringBuffer v_sql_insertTable_operation= new StringBuffer();
		v_sql_insertTable_operation.append("insert into #local_temp_operation values ");
		v_sql_insertTable_operation.append("(?,?,?,?,?,?,?,?,?,?,?)");
		
		// insert table: purchasingtype
        StringBuffer v_sql_insertTable_purchasingtype= new StringBuffer();
		v_sql_insertTable_purchasingtype.append("insert into #local_temp_purchasingtype values ");
		v_sql_insertTable_purchasingtype.append("(?,?,?,?,?,?,?,?,?,?,?)");

		// insert table: scenario
        StringBuffer v_sql_insertTable_scenario= new StringBuffer();
		v_sql_insertTable_scenario.append("insert into #local_temp_scenario values ");
		v_sql_insertTable_scenario.append("(?,?,?,?,?,?,?,?,?,?)");

		// insert table: typecode
        StringBuffer v_sql_insertTable_typecode= new StringBuffer();
		v_sql_insertTable_typecode.append("insert into #local_temp_typecode values ");
		v_sql_insertTable_typecode.append("(?,?,?,?,?,?,?,?,?,?,?)");
/*********************************************************************************************************************/
		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call pg_tm_ust_master_proc(");
		// append: in table => local temp table
		v_sql_callProc.append("i_table_master => #local_temp_master, ");
		v_sql_callProc.append("i_table_company => #local_temp_company, ");
		v_sql_callProc.append("i_table_bizunit => #local_temp_bizunit, ");
		v_sql_callProc.append("i_table_manager => #local_temp_manager, ");
		v_sql_callProc.append("i_table_operation => #local_temp_operation, ");
		v_sql_callProc.append("i_table_purchasing_type => #local_temp_purchasingtype, ");
		v_sql_callProc.append("i_table_scenario => #local_temp_scenario, ");
		v_sql_callProc.append("i_table_type => #local_temp_typecode, ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
		v_sql_callProc.append(")");
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
        Collection<UpsertOutType>                   v_result		    = new ArrayList<>();
/*********************************************************************************************************************/
        ResultSet v_rs = null;
		try {

            Connection conn = jdbc.getDataSource().getConnection();

            // create local temp table: master
            PreparedStatement v_stat_table_master = conn.prepareStatement(v_sql_createTable_master.toString());
            v_stat_table_master.execute();

            // insert local temp table: master
            PreparedStatement v_stat_insert_master = conn.prepareStatement(v_sql_insertTable_master.toString());

            if(!v_inMaster.isEmpty() && v_inMaster.size() > 0){
                for(TaskMonitoringMaster v_inRow : v_inMaster){
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
            PreparedStatement v_stat_table_company = conn.prepareStatement(v_sql_createTable_company.toString());
            v_stat_table_company.execute();

            // insert local temp table: company
            PreparedStatement v_stat_insert_company = conn.prepareStatement(v_sql_insertTable_company.toString());

            if(!v_inCompany.isEmpty() && v_inCompany.size() > 0){
                for(TaskMonitoringCompany v_inRow : v_inCompany){
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
            PreparedStatement v_stat_table_bizunit = conn.prepareStatement(v_sql_createTable_bizunit.toString());
            v_stat_table_bizunit.execute();

            // insert local temp table: bizunit
            PreparedStatement v_stat_insert_bizunit = conn.prepareStatement(v_sql_insertTable_bizunit.toString());

            if(!v_inBizunit.isEmpty() && v_inBizunit.size() > 0){
                for(TaskMonitoringBizunit v_inRow : v_inBizunit){
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
            PreparedStatement v_stat_table_manager = conn.prepareStatement(v_sql_createTable_manager.toString());
            v_stat_table_manager.execute();

            // insert local temp table: manager
            PreparedStatement v_stat_insert_manager = conn.prepareStatement(v_sql_insertTable_manager.toString());

            if(!v_inManager.isEmpty() && v_inManager.size() > 0){
                for(TaskMonitoringManager v_inRow : v_inManager){
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
            PreparedStatement v_stat_table_operation = conn.prepareStatement(v_sql_createTable_operation.toString());
            v_stat_table_operation.execute();

            // insert local temp table: operation
            PreparedStatement v_stat_insert_operation = conn.prepareStatement(v_sql_insertTable_operation.toString());

            if(!v_inOperation.isEmpty() && v_inOperation.size() > 0){
                for(TaskMonitoringOperation v_inRow : v_inOperation){
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
            PreparedStatement v_stat_table_purchasingtype = conn.prepareStatement(v_sql_createTable_purchasingtype.toString());
            v_stat_table_purchasingtype.execute();

            // insert local temp table: purchasingtype
            PreparedStatement v_stat_insert_purchasingtype = conn.prepareStatement(v_sql_insertTable_purchasingtype.toString());

            if(!v_inPurchasingType.isEmpty() && v_inPurchasingType.size() > 0){
                for(TaskMonitoringPurchasingType v_inRow : v_inPurchasingType){
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
            PreparedStatement v_stat_table_scenario = conn.prepareStatement(v_sql_createTable_scenario.toString());
            v_stat_table_scenario.execute();

            // insert local temp table: scenario
            PreparedStatement v_stat_insert_scenario = conn.prepareStatement(v_sql_insertTable_scenario.toString());

            if(!v_inScenario.isEmpty() && v_inScenario.size() > 0){
                for(TaskMonitoringScenario v_inRow : v_inScenario){
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
            PreparedStatement v_stat_table_typecode = conn.prepareStatement(v_sql_createTable_typecode.toString());
            v_stat_table_scenario.execute();

            // insert local temp table: typecode
            PreparedStatement v_stat_insert_typecode = conn.prepareStatement(v_sql_insertTable_typecode.toString());

            if(!v_inTypeCode.isEmpty() && v_inTypeCode.size() > 0){
                for(TaskMonitoringTypeCode v_inRow : v_inTypeCode){
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
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
            v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            while (v_rs.next()){
                UpsertOutType v_row = UpsertOutType.create();
                v_row.setReturncode(v_rs.getString("returncode")); 
                v_row.setReturnmessage(v_rs.getString("returnmessage")); 
                v_result.add(v_row);
            }
            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }
		
    }
    // Execute Delete Task Monitoring Master Data Procedure
    @On(event = DeleteTaskMonitoringMasterProcContext.CDS_NAME)
    public void onDeleteTaskMonitoringMasterProc(DeleteTaskMonitoringMasterProcContext context) {
		
        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";
/*********************************************************************************************************************/
		// create temp table: local_temp
        StringBuffer v_sql_createTable = new StringBuffer();
		v_sql_createTable.append("create local temporary column table #local_temp ( ");
		v_sql_createTable.append("tenant_id nvarchar(5), ");
		v_sql_createTable.append("scenario_number bigint ");
		v_sql_createTable.append(")");
/*********************************************************************************************************************/
		String v_sql_dropTable = "drop table #local_temp";
/*********************************************************************************************************************/
		// insert table
        StringBuffer v_sql_inserTable= new StringBuffer();
		v_sql_inserTable.append("insert into #local_temp values ");
		v_sql_inserTable.append("(?,?)");
/*********************************************************************************************************************/
		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call pg_tm_del_master_proc(");
		// append: in table => local temp table
		v_sql_callProc.append("i_tenant_id =>  (select tenant_id from #local_temp), ");
		v_sql_callProc.append("i_scenario_number => (select scenario_number from #local_temp), ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
		v_sql_callProc.append(")");
/*********************************************************************************************************************/
		Collection<DeleteOutType> v_result = new ArrayList<>();
/*********************************************************************************************************************/
		ResultSet v_rs = null;
		try {

            Connection conn = jdbc.getDataSource().getConnection();

            // create local temp table: master
            PreparedStatement v_stat_table = conn.prepareStatement(v_sql_createTable.toString());
            v_stat_table.execute();

            // insert local temp table: master
            PreparedStatement v_sql_insert = conn.prepareStatement(v_sql_inserTable.toString());
			
			DeleteInputType v_inputdetails = context.getInputData();

            if(!v_inputdetails.isEmpty() && v_inputdetails.size() > 0){
                v_sql_insert.setObject(1,	v_inputdetails.getTenantId());
                v_sql_insert.setObject(2,	v_inputdetails.getScenarioNumber());
                v_sql_insert.addBatch();
                v_sql_insert.executeBatch();
            }
			
            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc.toString());
            v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            while (v_rs.next()){
                DeleteOutType v_row = DeleteOutType.create();
                v_row.setReturncode(v_rs.getString("returncode")); 
                v_row.setReturnmessage(v_rs.getString("returnmessage")); 
                v_result.add(v_row);
            }
            context.setResult(v_result);
            context.setCompleted();

		} catch (SQLException e) { 
			e.printStackTrace();
        }
	}
}