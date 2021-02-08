package lg.sppCap.handlers.sp.sc;              //Custom

import com.sap.cds.ql.Delete;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.sp.sourcingv4service.*;  //Custom

//Action Name : UpsertTaskMonitoringMasterProc => deepInsertNegoHeader
// => event Name : UpsertTaskMonitoringMasterProcContext => DeepInsertNegoHeaderContext

//Service Name : TaskMonitoringV4Service => SourcingV4Service
// => java serviceName : TaskMonitoringV4Service_ => SourcingV4Service_
// => java libarary : import cds.gen.pg.taskmonitoringv4service.* => import cds.gen.pg.sourcingv4service.*

//returns array of : UpsertOutType => tyReturnMsg
    // => UpsertOutType => TyReturnMsg

//Input Parameters : InputData => deepinsertnegoheader,

// => Get Java Context Type #1 : getInputData => getDeepinsertnegoheader

@Component
@ServiceName(SourcingV4Service_.CDS_NAME)    //Custom
public class SourcingV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    // Execute Upsert Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    //Custom Begin
    @On(event = DeepUpsertNegoHeaderContext.CDS_NAME)                         
    public void onDeepUpsertNegoHeader(DeepUpsertNegoHeaderContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";

        // create temp table: local_temp_negoheaders
        StringBuffer v_sql_createTable_negoheaders = new StringBuffer();
        // v_sql_buf.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOHEADERS AS ( SELECT * FROM SP_SC_NEGO_HEADERS WHERE 1=0 )");
        v_sql_createTable_negoheaders.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOHEADERS AS (        ")
                .append("  SELECT                                                                 ")
                .append("       tenant_id                                                         ")
                .append("     , nego_header_id                                                    ")
                .append("     , reference_nego_header_id                                          ")
                .append("     , previous_nego_header_id                                           ")
                .append("     , operation_org_code                                                ")
                .append("     , operation_unit_code                                               ")
                .append("     , reference_nego_document_number                                    ")
                .append("     , nego_document_round                                               ")
                .append("     , nego_document_number                                              ")
                .append("     , nego_document_title                                               ")
                .append("     , nego_document_desc                                                ")
                .append("     , nego_progress_status_code                                         ")
                .append("     , award_progress_status_code                                        ")
                .append("     , reply_times                                                       ")
                .append("     , supplier_count                                                    ")
                .append("     , nego_type_code                                                    ")
                .append("     , outcome_code                                                      ")
                .append("     , negotiation_output_class_code                                     ")
                .append("     , buyer_empno                                                       ")
                .append("     , buyer_department_code                                             ")
                .append("     , immediate_apply_flag                                              ")
                .append("     , open_date                                                         ")
                .append("     , closing_date                                                      ")
                .append("     , auto_rfq                                                          ")
                .append("     , items_count                                                       ")
                .append("     , negotiation_style_code                                            ")
                .append("     , close_date_ext_enabled_hours                                      ")
                .append("     , close_date_ext_enabled_count                                      ")
                .append("     , actual_extension_count                                            ")
                .append("     , remaining_hours                                                   ")
                .append("     , note_content                                                      ")
                .append("     , award_type_code                                                   ")
                .append("     , award_method_code                                                 ")
                .append("     , target_amount_config_flag                                         ")
                .append("     , target_currency                                                   ")
                .append("     , target_amount                                                     ")
                .append("     , supplier_participation_flag                                       ")
                .append("     , partial_allow_flag                                                ")
                .append("     , bidding_result_open_status_code                                   ")
                .append("  FROM SP_SC_NEGO_HEADERS WHERE 1=0 )                                    ");

		// create temp table: local_temp_negoitemprices
        StringBuffer v_sql_createTable_negoitemprices = new StringBuffer();
        // v_sql_buf.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOITEMPRICES AS ( SELECT * FROM SP_SC_NEGO_ITEM_PRICES WHERE 1=0 )");
        v_sql_createTable_negoitemprices.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOITEMPRICES AS (  ")
                .append("    SELECT                                                           ")
                .append("      tenant_id                                                      ")
                .append("    , nego_header_id                                                 ")
                .append("    , nego_item_number                                               ")
                .append("    , company_code                                                   ")
                .append("    , operation_org_type_code                                        ")
                .append("    , operation_org_code                                             ")
                .append("    , operation_unit_code                                            ")
                .append("    , award_progress_status_code                                     ")
                .append("    , line_type_code                                                 ")
                .append("    , material_code                                                  ")
                .append("    , material_desc                                                  ")
                .append("    , specification                                                  ")
                .append("    , bpa_price                                                      ")
                .append("    , detail_net_price                                               ")
                .append("    , recommend_info                                                 ")
                .append("    , group_id                                                       ")
                .append("    , location                                                       ")
                .append("    , purpose                                                        ")
                .append("    , reason                                                         ")
                .append("    , request_date                                                   ")
                .append("    , attch_code                                                     ")
                .append("    , supplier_provide_info                                          ")
                .append("    , incoterms_code                                                 ")
                .append("    , payment_terms_code                                             ")
                .append("    , market_code                                                    ")
                .append("    , excl_flag                                                      ")
                .append("    , specific_supplier_count                                        ")
                .append("    , vendor_pool_code                                               ")
                .append("    , request_quantity                                               ")
                .append("    , uom_code                                                       ")
                .append("    , maturity_date                                                  ")
                .append("    , currency_code                                                  ")
                .append("    , response_currency_code                                         ")
                .append("    , exrate_type_code                                               ")
                .append("    , exrate_date                                                    ")
                .append("    , bidding_start_net_price                                        ")
                .append("    , bidding_start_net_price_flag                                   ")
                .append("    , bidding_target_net_price                                       ")
                .append("    , current_price                                                  ")
                .append("    , note_content                                                   ")
                .append("    , pr_number                                                      ")
                .append("    , pr_approve_number                                              ")
                .append("    , req_submission_status                                          ")
                .append("    , req_reapproval                                                 ")
                .append("    , requisition_flag                                               ")
                .append("    , price_submission_no                                            ")
                .append("    , price_submisstion_status                                       ")
                .append("    , interface_source                                               ")
                .append("    , budget_department_code                                         ")
                .append("    , requestor_empno                                                ")
                .append("    , request_department_code                                        ")
                .append("    FROM SP_SC_NEGO_ITEM_PRICES WHERE 1=0 )                          ");

        // create temp table: local_temp_negosuppliers
        StringBuffer v_sql_createTable_negosuppliers = new StringBuffer();
        // v_sql_buf.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOSUPPLIERS AS ( SELECT * FROM SP_SC_NEGO_SUPPLIERS WHERE 1=0 )");
        v_sql_createTable_negosuppliers.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOSUPPLIERS AS ( ")
                .append("    SELECT                                                         ")
                .append("    , tenant_id                                                    ")
                .append("    , nego_header_id                                               ")
                .append("    , nego_item_number                                             ")
                .append("    , item_supplier_SEQUENCE                                       ")
                .append("    , operation_org_code                                           ")
                .append("    , operation_unit_code                                          ")
                .append("    , nego_supplier_register_type_code                             ")
                .append("    , evaluation_type_code                                         ")
                .append("    , nego_supeval_type_code                                       ")
                .append("    , supplier_code                                                ")
                .append("    , supplier_name                                                ")
                .append("    , supplier_type_code                                           ")
                .append("    , excl_flag                                                    ")
                .append("    , excl_reason_DESC                                             ")
                .append("    , include_flag                                                 ")
                .append("    , nego_target_include_reason_DESC                              ")
                .append("    , only_maker_flat                                              ")
                .append("    , contact                                                      ")
                .append("    , note_content                                                 ")
                .append("    FROM SP_SC_NEGO_SUPPLIERS WHERE 1=0 )                          ");

        // // drop temp table:
        String v_sql_dropTable_negoheaders =          "drop table #local_temp_negoheaders";
        String v_sql_dropTable_negoitemprices =       "drop table #local_temp_negoitemprices";
        String v_sql_dropTable_negosuppliers =        "drop table #local_temp_negosuppliers";

		// insert temp table: master
        StringBuffer v_sql_insertTable_negoheaders= new StringBuffer();
		v_sql_insertTable_negoheaders.append("insert into #local_temp_negoheaders values ");
        // v_sql_insertTable_negoheaders.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        v_sql_insertTable_negoheaders.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// insert table: scenario
        StringBuffer v_sql_insertTable_negoitemprices= new StringBuffer();
		v_sql_insertTable_negoitemprices.append("insert into #local_temp_negoitemprices values ");
		// v_sql_insertTable_negoitemprices.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
		v_sql_insertTable_negoitemprices.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// insert temp table: company
        StringBuffer v_sql_insertTable_negosuppliers= new StringBuffer();
		v_sql_insertTable_negosuppliers.append("insert into #local_temp_negosuppliers values ");
        // v_sql_insertTable_negosuppliers.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        v_sql_insertTable_negosuppliers.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call sp_sc_nego_headers_deepupsert(");
        // append: in table => local temp table
        // v_sql_callProc.append("i_tenant_id => ?, ");
		v_sql_callProc.append("i_table_negoheaders    => #local_temp_negoheaders    , ");
		v_sql_callProc.append("i_table_negoitemprices => #local_temp_negoitemprices , ");
        v_sql_callProc.append("i_table_negosuppliers  => #local_temp_negosuppliers  , ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
        v_sql_callProc.append(")");
       
        // commit option
        jdbc.execute(v_sql_commitOption);

        // execute create local temp table
		jdbc.execute(v_sql_createTable_negoheaders.toString());
		jdbc.execute(v_sql_createTable_negoitemprices.toString());
		jdbc.execute(v_sql_createTable_negosuppliers.toString());

        /* /srv/cdsv4/sp/sc/sourcing/sourcing-v4-service.cds
        type tyDeepUpsertNegoheader {
            negoheaders: tyNegoHeader;
            negoitemprices : array of tyNegoItemPrice;
            negosuppliers  : array of tyNegoSupplier;
        };
        action deepUpsertNegoHeader(  deepupsertnegoheader : tyDeepUpsertNegoheader  ) returns array of OutputData;
        */
		Collection<ReturnMsg>	v_result		= new ArrayList<>();

        // TyDeepUpsertNegoheader v_deepupsertnegoheader = context.getDeepupsertnegoheader();
        Collection<TyNegoHeader> v_negoheaders = context.getDeepupsertnegoheader().getNegoheaders();
        Collection<TyNegoItemPrice> v_negoitemprices = context.getDeepupsertnegoheader().getNegoitemprices();
        Collection<TyNegoSupplier> v_negosuppliers = context.getDeepupsertnegoheader().getNegosuppliers();

		// Collection<TaskMonitoringMaster>			v_inMaster			= context.getInputData().getSourceMaster();
		// Collection<TaskMonitoringScenario>          v_inScenario		= context.getInputData().getSourceScenario();
		// Collection<TaskMonitoringCompany>			v_inCompany			= context.getInputData().getSourceCompany();
        // Collection<TaskMonitoringBizunit>			v_inBizunit			= context.getInputData().getSourceBizunit();
		// Collection<TaskMonitoringPurchasingType>    v_inPurchasingType	= context.getInputData().getSourcePurchasingType();
		// Collection<TaskMonitoringTypeCode>          v_inTypeCode		= context.getInputData().getSourceTypeCode();
		// Collection<TaskMonitoringManager>			v_inManager			= context.getInputData().getSourceManager();
		// Collection<TaskMonitoringOperation>         v_inOperation		= context.getInputData().getSourceOperation();
        
        // insert local temp table : negoheaders
        List<Object[]> batch_negoheaders = new ArrayList<Object[]>();
        if(!v_negoheaders.isEmpty() && v_negoheaders.size() > 0){
            for(TyNegoHeader v_inRow : v_negoheaders){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("reference_nego_header_id"),
                    v_inRow.get("previous_nego_header_id"),
                    v_inRow.get("operation_org_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("reference_nego_document_number"),
                    v_inRow.get("nego_document_round"),
                    v_inRow.get("nego_document_number"),
                    v_inRow.get("nego_document_title"),
                    v_inRow.get("nego_document_desc"),
                    v_inRow.get("nego_progress_status_code"),
                    v_inRow.get("award_progress_status_code"),
                    v_inRow.get("reply_times"),
                    v_inRow.get("supplier_count"),
                    v_inRow.get("nego_type_code"),
                    v_inRow.get("outcome_code"),
                    v_inRow.get("negotiation_output_class_code"),
                    v_inRow.get("buyer_empno"),
                    v_inRow.get("buyer_department_code"),
                    v_inRow.get("immediate_apply_flag"),
                    v_inRow.get("open_date"),
                    v_inRow.get("closing_date"),
                    v_inRow.get("auto_rfq"),
                    v_inRow.get("items_count"),
                    v_inRow.get("negotiation_style_code"),
                    v_inRow.get("close_date_ext_enabled_hours"),
                    v_inRow.get("close_date_ext_enabled_count"),
                    v_inRow.get("actual_extension_count"),
                    v_inRow.get("remaining_hours"),
                    v_inRow.get("note_content"),
                    v_inRow.get("award_type_code"),
                    v_inRow.get("award_method_code"),
                    v_inRow.get("target_amount_config_flag"),
                    v_inRow.get("target_currency"),
                    v_inRow.get("target_amount"),
                    v_inRow.get("supplier_participation_flag"),
                    v_inRow.get("partial_allow_flag"),
                    v_inRow.get("bidding_result_open_status_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
				};
                batch_negoheaders.add(values);
            }
        }
        int[] updateCounts_negoheaders = jdbc.batchUpdate(v_sql_insertTable_negoheaders.toString(), batch_negoheaders);

		// insert local temp table : negoitemprices
        List<Object[]> batch_negoitemprices = new ArrayList<Object[]>();
        if(!v_negoitemprices.isEmpty() && v_negoitemprices.size() > 0){
            for(TyNegoItemPrice v_inRow : v_negoitemprices){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("nego_item_number"),
                    v_inRow.get("company_code"),
                    v_inRow.get("operation_org_type_code"),
                    v_inRow.get("operation_org_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("award_progress_status_code"),
                    v_inRow.get("line_type_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("material_desc"),
                    v_inRow.get("specification"),
                    v_inRow.get("bpa_price"),
                    v_inRow.get("detail_net_price"),
                    v_inRow.get("recommend_info"),
                    v_inRow.get("group_id"),
                    v_inRow.get("location"),
                    v_inRow.get("purpose"),
                    v_inRow.get("reason"),
                    v_inRow.get("request_date"),
                    v_inRow.get("attch_code"),
                    v_inRow.get("supplier_provide_info"),
                    v_inRow.get("incoterms_code"),
                    v_inRow.get("payment_terms_code"),
                    v_inRow.get("market_code"),
                    v_inRow.get("excl_flag"),
                    v_inRow.get("specific_supplier_count"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("request_quantity"),
                    v_inRow.get("uom_code"),
                    v_inRow.get("maturity_date"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("response_currency_code"),
                    v_inRow.get("exrate_type_code"),
                    v_inRow.get("exrate_date"),
                    v_inRow.get("bidding_start_net_price"),
                    v_inRow.get("bidding_start_net_price_flag"),
                    v_inRow.get("bidding_target_net_price"),
                    v_inRow.get("current_price"),
                    v_inRow.get("note_content"),
                    v_inRow.get("pr_number"),
                    v_inRow.get("pr_approve_number"),
                    v_inRow.get("req_submission_status"),
                    v_inRow.get("req_reapproval"),
                    v_inRow.get("requisition_flag"),
                    v_inRow.get("price_submission_no"),
                    v_inRow.get("price_submisstion_status"),
                    v_inRow.get("interface_source"),
                    v_inRow.get("budget_department_code"),
                    v_inRow.get("requestor_empno"),
                    v_inRow.get("request_department_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
				};
                batch_negoitemprices.add(values);
            }
        }
        // Procedure Input Parameter Table Type #negoitemprices
        int[] updateCounts_negoitemprices = jdbc.batchUpdate(v_sql_insertTable_negoitemprices.toString(), batch_negoitemprices);

		// insert local temp table : negosuppliers
        List<Object[]> batch_negosuppliers = new ArrayList<Object[]>();
        if(!v_negosuppliers.isEmpty() && v_negosuppliers.size() > 0){
            for(TyNegoSupplier v_inRow : v_negosuppliers){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("nego_item_number"),
                    v_inRow.get("item_supplier_sequence"),
                    v_inRow.get("operation_org_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("nego_supplier_register_type_code"),
                    v_inRow.get("evaluation_type_code"),
                    v_inRow.get("nego_supeval_type_code"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("supplier_name"),
                    v_inRow.get("supplier_type_code"),
                    v_inRow.get("excl_flag"),
                    v_inRow.get("excl_reason_desc"),
                    v_inRow.get("include_flag"),
                    v_inRow.get("nego_target_include_reason_desc"),
                    v_inRow.get("only_maker_flat"),
                    v_inRow.get("contact"),
                    v_inRow.get("note_content"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
				};
                batch_negosuppliers.add(values);
            }
        }

        int[] updateCounts_negosuppliers = jdbc.batchUpdate(v_sql_insertTable_negosuppliers.toString(), batch_negosuppliers);

		// procedure call
		List<SqlParameter> paramList = new ArrayList<SqlParameter>();
		// paramList.add(new SqlParameter("i_tenant_id", Types.NVARCHAR));

        SqlReturnResultSet oReturn = new SqlReturnResultSet("o_table_message", new RowMapper<ReturnMsg>(){
            @Override
            public ReturnMsg mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ReturnMsg v_row = ReturnMsg.create();
                v_row.setCode(v_rs.getInt("code"));
                v_row.setMessage(v_rs.getString("message"));
                v_result.add(v_row);
                return v_row;
            }
        });
        paramList.add(oReturn);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                // callableStatement.setString("i_tenant_id", context.getDeepupsertnegoheader().getTenantId());
                return callableStatement;
            }
        }, paramList);

        // execute drop local temp table
		jdbc.execute(v_sql_dropTable_negoheaders);
		jdbc.execute(v_sql_dropTable_negoitemprices);
		jdbc.execute(v_sql_dropTable_negosuppliers);

        context.setResult(v_result);
        context.setCompleted();

    }

    // Execute Insert Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    //Custom Begin
    @On(event = DeepInsertNegoHeaderContext.CDS_NAME)                         
    public void onDeepInsertNegoHeader(DeepInsertNegoHeaderContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";

        // create temp table: local_temp_negoheaders
        StringBuffer v_sql_createTable_negoheaders = new StringBuffer();
		v_sql_createTable_negoheaders.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOHEADERS AS ( SELECT * FROM SP_SC_NEGO_HEADERS WHERE 1=0 )");

		// create temp table: local_temp_negoitemprices
        StringBuffer v_sql_createTable_negoitemprices = new StringBuffer();
		v_sql_createTable_negoitemprices.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOITEMPRICES AS ( SELECT * FROM SP_SC_NEGO_ITEM_PRICES WHERE 1=0 )");

		// create temp table: local_temp_negosuppliers
        StringBuffer v_sql_createTable_negosuppliers = new StringBuffer();
		v_sql_createTable_negosuppliers.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOSUPPLIERS AS ( SELECT * FROM SP_SC_NEGO_SUPPLIERS WHERE 1=0 )");

        // // drop temp table:
        String v_sql_dropTable_negoheaders =          "drop table #local_temp_negoheaders";
        String v_sql_dropTable_negoitemprices =       "drop table #local_temp_negoitemprices";
        String v_sql_dropTable_negosuppliers =        "drop table #local_temp_negosuppliers";

		// insert temp table: master
        StringBuffer v_sql_insertTable_negoheaders= new StringBuffer();
		v_sql_insertTable_negoheaders.append("insert into #local_temp_negoheaders values ");
        v_sql_insertTable_negoheaders.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// insert table: scenario
        StringBuffer v_sql_insertTable_negoitemprices= new StringBuffer();
		v_sql_insertTable_negoitemprices.append("insert into #local_temp_negoitemprices values ");
		v_sql_insertTable_negoitemprices.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// insert temp table: company
        StringBuffer v_sql_insertTable_negosuppliers= new StringBuffer();
		v_sql_insertTable_negosuppliers.append("insert into #local_temp_negosuppliers values ");
        v_sql_insertTable_negosuppliers.append("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call sp_sc_nego_headers_deepinsert(");
        // append: in table => local temp table
        // v_sql_callProc.append("i_tenant_id => ?, ");
		v_sql_callProc.append("i_table_negoheaders    => #local_temp_negoheaders    , ");
		v_sql_callProc.append("i_table_negoitemprices => #local_temp_negoitemprices , ");
        v_sql_callProc.append("i_table_negosuppliers  => #local_temp_negosuppliers  , ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
        v_sql_callProc.append(")");
       
        // commit option
        jdbc.execute(v_sql_commitOption);

        // execute create local temp table
		jdbc.execute(v_sql_createTable_negoheaders.toString());
		jdbc.execute(v_sql_createTable_negoitemprices.toString());
		jdbc.execute(v_sql_createTable_negosuppliers.toString());

        /* /srv/cdsv4/sp/sc/sourcing/sourcing-v4-service.cds
        type tyDeepInsertNegoheader {
            negoheaders: tyNegoHeader;
            negoitemprices : array of tyNegoItemPrice;
            negosuppliers  : array of tyNegoSupplier;
        };
        action deepInsertNegoHeader(  deepinsertnegoheader : tyDeepInsertNegoheader  ) returns array of OutputData;
        */
		Collection<ReturnMsg>	v_result		= new ArrayList<>();

        TyDeepInsertNegoheader v_deepinsertnegoheader = context.getDeepinsertnegoheader();
        Collection<TyNegoHeader> v_negoheaders = context.getDeepinsertnegoheader().getNegoheaders();
        Collection<TyNegoItemPrice> v_negoitemprices = context.getDeepinsertnegoheader().getNegoitemprices();
        Collection<TyNegoSupplier> v_negosuppliers = context.getDeepinsertnegoheader().getNegosuppliers();

		// Collection<TaskMonitoringMaster>			v_inMaster			= context.getInputData().getSourceMaster();
		// Collection<TaskMonitoringScenario>          v_inScenario		= context.getInputData().getSourceScenario();
		// Collection<TaskMonitoringCompany>			v_inCompany			= context.getInputData().getSourceCompany();
        // Collection<TaskMonitoringBizunit>			v_inBizunit			= context.getInputData().getSourceBizunit();
		// Collection<TaskMonitoringPurchasingType>    v_inPurchasingType	= context.getInputData().getSourcePurchasingType();
		// Collection<TaskMonitoringTypeCode>          v_inTypeCode		= context.getInputData().getSourceTypeCode();
		// Collection<TaskMonitoringManager>			v_inManager			= context.getInputData().getSourceManager();
		// Collection<TaskMonitoringOperation>         v_inOperation		= context.getInputData().getSourceOperation();
        
        // insert local temp table : negoheaders
        List<Object[]> batch_negoheaders = new ArrayList<Object[]>();
        if(!v_negoheaders.isEmpty() && v_negoheaders.size() > 0){
            for(TyNegoHeader v_inRow : v_negoheaders){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("reference_nego_header_id"),
                    v_inRow.get("previous_nego_header_id"),
                    v_inRow.get("operation_org_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("reference_nego_document_number"),
                    v_inRow.get("nego_document_round"),
                    v_inRow.get("nego_document_number"),
                    v_inRow.get("nego_document_title"),
                    v_inRow.get("nego_document_desc"),
                    v_inRow.get("nego_progress_status_code"),
                    v_inRow.get("award_progress_status_code"),
                    v_inRow.get("reply_times"),
                    v_inRow.get("supplier_count"),
                    v_inRow.get("nego_type_code"),
                    v_inRow.get("outcome_code"),
                    v_inRow.get("negotiation_output_class_code"),
                    v_inRow.get("buyer_empno"),
                    v_inRow.get("buyer_department_code"),
                    v_inRow.get("immediate_apply_flag"),
                    v_inRow.get("open_date"),
                    v_inRow.get("closing_date"),
                    v_inRow.get("auto_rfq"),
                    v_inRow.get("items_count"),
                    v_inRow.get("negotiation_style_code"),
                    v_inRow.get("close_date_ext_enabled_hours"),
                    v_inRow.get("close_date_ext_enabled_count"),
                    v_inRow.get("actual_extension_count"),
                    v_inRow.get("remaining_hours"),
                    v_inRow.get("note_content"),
                    v_inRow.get("award_type_code"),
                    v_inRow.get("award_method_code"),
                    v_inRow.get("target_amount_config_flag"),
                    v_inRow.get("target_currency"),
                    v_inRow.get("target_amount"),
                    v_inRow.get("supplier_participation_flag"),
                    v_inRow.get("partial_allow_flag"),
                    v_inRow.get("bidding_result_open_status_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
				};
                batch_negoheaders.add(values);
            }
        }
        int[] updateCounts_negoheaders = jdbc.batchUpdate(v_sql_insertTable_negoheaders.toString(), batch_negoheaders);

		// insert local temp table : negoitemprices
        List<Object[]> batch_negoitemprices = new ArrayList<Object[]>();
        if(!v_negoitemprices.isEmpty() && v_negoitemprices.size() > 0){
            for(TyNegoItemPrice v_inRow : v_negoitemprices){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("nego_item_number"),
                    v_inRow.get("company_code"),
                    v_inRow.get("operation_org_type_code"),
                    v_inRow.get("operation_org_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("award_progress_status_code"),
                    v_inRow.get("line_type_code"),
                    v_inRow.get("material_code"),
                    v_inRow.get("material_desc"),
                    v_inRow.get("specification"),
                    v_inRow.get("bpa_price"),
                    v_inRow.get("detail_net_price"),
                    v_inRow.get("recommend_info"),
                    v_inRow.get("group_id"),
                    v_inRow.get("location"),
                    v_inRow.get("purpose"),
                    v_inRow.get("reason"),
                    v_inRow.get("request_date"),
                    v_inRow.get("attch_code"),
                    v_inRow.get("supplier_provide_info"),
                    v_inRow.get("incoterms_code"),
                    v_inRow.get("payment_terms_code"),
                    v_inRow.get("market_code"),
                    v_inRow.get("excl_flag"),
                    v_inRow.get("specific_supplier_count"),
                    v_inRow.get("vendor_pool_code"),
                    v_inRow.get("request_quantity"),
                    v_inRow.get("uom_code"),
                    v_inRow.get("maturity_date"),
                    v_inRow.get("currency_code"),
                    v_inRow.get("response_currency_code"),
                    v_inRow.get("exrate_type_code"),
                    v_inRow.get("exrate_date"),
                    v_inRow.get("bidding_start_net_price"),
                    v_inRow.get("bidding_start_net_price_flag"),
                    v_inRow.get("bidding_target_net_price"),
                    v_inRow.get("current_price"),
                    v_inRow.get("note_content"),
                    v_inRow.get("pr_number"),
                    v_inRow.get("pr_approve_number"),
                    v_inRow.get("req_submission_status"),
                    v_inRow.get("req_reapproval"),
                    v_inRow.get("requisition_flag"),
                    v_inRow.get("price_submission_no"),
                    v_inRow.get("price_submisstion_status"),
                    v_inRow.get("interface_source"),
                    v_inRow.get("budget_department_code"),
                    v_inRow.get("requestor_empno"),
                    v_inRow.get("request_department_code"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
				};
                batch_negoitemprices.add(values);
            }
        }
        // Procedure Input Parameter Table Type #negoitemprices
        int[] updateCounts_negoitemprices = jdbc.batchUpdate(v_sql_insertTable_negoitemprices.toString(), batch_negoitemprices);

		// insert local temp table : negosuppliers
        List<Object[]> batch_negosuppliers = new ArrayList<Object[]>();
        if(!v_negosuppliers.isEmpty() && v_negosuppliers.size() > 0){
            for(TyNegoSupplier v_inRow : v_negosuppliers){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("nego_item_number"),
                    v_inRow.get("item_supplier_sequence"),
                    v_inRow.get("operation_org_code"),
                    v_inRow.get("operation_unit_code"),
                    v_inRow.get("nego_supplier_register_type_code"),
                    v_inRow.get("evaluation_type_code"),
                    v_inRow.get("nego_supeval_type_code"),
                    v_inRow.get("supplier_code"),
                    v_inRow.get("supplier_name"),
                    v_inRow.get("supplier_type_code"),
                    v_inRow.get("excl_flag"),
                    v_inRow.get("excl_reason_desc"),
                    v_inRow.get("include_flag"),
                    v_inRow.get("nego_target_include_reason_desc"),
                    v_inRow.get("only_maker_flat"),
                    v_inRow.get("contact"),
                    v_inRow.get("note_content"),
                    v_inRow.get("local_create_dtm"),
                    v_inRow.get("local_update_dtm"),
                    v_inRow.get("create_user_id"),
                    v_inRow.get("update_user_id"),
                    v_inRow.get("system_create_dtm"),
                    v_inRow.get("system_update_dtm")
				};
                batch_negosuppliers.add(values);
            }
        }

        int[] updateCounts_negosuppliers = jdbc.batchUpdate(v_sql_insertTable_negosuppliers.toString(), batch_negosuppliers);

		// procedure call
		List<SqlParameter> paramList = new ArrayList<SqlParameter>();
		// paramList.add(new SqlParameter("i_tenant_id", Types.NVARCHAR));

        SqlReturnResultSet oReturn = new SqlReturnResultSet("o_table_message", new RowMapper<ReturnMsg>(){
            @Override
            public ReturnMsg mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ReturnMsg v_row = ReturnMsg.create();
                v_row.setCode(v_rs.getInt("code"));
                v_row.setMessage(v_rs.getString("message"));
                v_result.add(v_row);
                return v_row;
            }
        });
        paramList.add(oReturn);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                // callableStatement.setString("i_tenant_id", context.getDeepinsertnegoheader().getTenantId());
                return callableStatement;
            }
        }, paramList);

        // execute drop local temp table
		jdbc.execute(v_sql_dropTable_negoheaders);
		jdbc.execute(v_sql_dropTable_negoitemprices);
		jdbc.execute(v_sql_dropTable_negosuppliers);

        context.setResult(v_result);
        context.setCompleted();

    }
    
/* bash shell test #1 - Delete Nego Headers - Ok!
curl 'http://localhost:8080/odata/v4/sp.sourcingV4Service/deepDeleteNegoHeader' \
  -H 'Content-Type: application/json' \
  --data-raw '{"deepdeletenegoheader":{"negoheaders":[{"tenant_id":"L2100","nego_header_id":4}],"negoitemprices":[],"negosuppliers":[]}}' \
 */

    // Execute Delete Task Monitoring Master Data Procedure
    @Transactional(rollbackFor = SQLException.class)
    //Custom Begin
    @On(event = DeepDeleteNegoHeaderContext.CDS_NAME)                         
    public void onDeepDeleteNegoHeader(DeepDeleteNegoHeaderContext context) {

        // local temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "set transaction autocommit ddl off;";

        // create temp table: local_temp_negoheaders
        StringBuffer v_sql_createTable_negoheaders = new StringBuffer();
		v_sql_createTable_negoheaders.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOHEADERS AS ( SELECT TENANT_ID, NEGO_HEADER_ID FROM SP_SC_NEGO_HEADERS WHERE 1=0 )");

		// create temp table: local_temp_negoitemprices
        StringBuffer v_sql_createTable_negoitemprices = new StringBuffer();
        v_sql_createTable_negoitemprices.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOITEMPRICES AS ( SELECT tenant_id, nego_header_id, nego_item_number FROM SP_SC_NEGO_ITEM_PRICES WHERE 1=0 )");
        
		// create temp table: local_temp_negosuppliers
        StringBuffer v_sql_createTable_negosuppliers = new StringBuffer();
		v_sql_createTable_negosuppliers.append("CREATE LOCAL TEMPORARY COLUMN TABLE #LOCAL_TEMP_NEGOSUPPLIERS AS ( SELECT tenant_id, nego_header_id, nego_item_number, item_supplier_sequence FROM SP_SC_NEGO_SUPPLIERS WHERE 1=0 )");

        // // drop temp table:
        String v_sql_dropTable_negoheaders =          "drop table #local_temp_negoheaders";
        String v_sql_dropTable_negoitemprices =       "drop table #local_temp_negoitemprices";
        String v_sql_dropTable_negosuppliers =        "drop table #local_temp_negosuppliers";

		// insert temp table: master
        StringBuffer v_sql_insertTable_negoheaders= new StringBuffer();
		v_sql_insertTable_negoheaders.append("insert into #local_temp_negoheaders values ");
        v_sql_insertTable_negoheaders.append("(?,?)");

		// insert table: scenario
        StringBuffer v_sql_insertTable_negoitemprices= new StringBuffer();
		v_sql_insertTable_negoitemprices.append("insert into #local_temp_negoitemprices values ");
		v_sql_insertTable_negoitemprices.append("(?,?,?)");

		// insert temp table: company
        StringBuffer v_sql_insertTable_negosuppliers= new StringBuffer();
		v_sql_insertTable_negosuppliers.append("insert into #local_temp_negosuppliers values ");
        v_sql_insertTable_negosuppliers.append("(?,?,?,?)");

		// call procedure
        StringBuffer v_sql_callProc = new StringBuffer();
		v_sql_callProc.append("call sp_sc_nego_headers_deepdelete(");
        // append: in table => local temp table
        // v_sql_callProc.append("i_tenant_id => ?, ");
		v_sql_callProc.append("i_table_negoheaders    => #local_temp_negoheaders    , ");
		v_sql_callProc.append("i_table_negoitemprices => #local_temp_negoitemprices , ");
        v_sql_callProc.append("i_table_negosuppliers  => #local_temp_negosuppliers  , ");
		// append: out table => local temp table
		v_sql_callProc.append("o_table_message => ? ");
		// append: end
        v_sql_callProc.append(")");
       
        // commit option
        jdbc.execute(v_sql_commitOption);

        // execute create local temp table
		jdbc.execute(v_sql_createTable_negoheaders.toString());
		jdbc.execute(v_sql_createTable_negoitemprices.toString());
		jdbc.execute(v_sql_createTable_negosuppliers.toString());

        /* /srv/cdsv4/sp/sc/sourcing/sourcing-v4-service.cds
        type tyDeepDeleteNegoheader {
            negoheaders: tyNegoHeaderKey;
            negoitemprices : array of tyNegoItemPriceKey;
            negosuppliers  : array of tyNegoSupplierKey;
        };
        action deepDeleteNegoHeader(  deepdeletenegoheader : tyDeepDeleteNegoheader  ) returns array of OutputData;
        */
		Collection<ReturnMsg>	v_result		= new ArrayList<>();

        TyDeepDeleteNegoheader v_deepdeletenegoheader = context.getDeepdeletenegoheader();
        Collection<TyNegoHeaderKey> v_negoheaders = context.getDeepdeletenegoheader().getNegoheaders();
        Collection<TyNegoItemPriceKey> v_negoitemprices = context.getDeepdeletenegoheader().getNegoitemprices();
        Collection<TyNegoSupplierKey> v_negosuppliers = context.getDeepdeletenegoheader().getNegosuppliers();

		// Collection<TaskMonitoringMaster>			v_inMaster			= context.getInputData().getSourceMaster();
		// Collection<TaskMonitoringScenario>          v_inScenario		= context.getInputData().getSourceScenario();
		// Collection<TaskMonitoringCompany>			v_inCompany			= context.getInputData().getSourceCompany();
        // Collection<TaskMonitoringBizunit>			v_inBizunit			= context.getInputData().getSourceBizunit();
		// Collection<TaskMonitoringPurchasingType>    v_inPurchasingType	= context.getInputData().getSourcePurchasingType();
		// Collection<TaskMonitoringTypeCode>          v_inTypeCode		= context.getInputData().getSourceTypeCode();
		// Collection<TaskMonitoringManager>			v_inManager			= context.getInputData().getSourceManager();
		// Collection<TaskMonitoringOperation>         v_inOperation		= context.getInputData().getSourceOperation();
        
        // insert local temp table : negoheaders
        List<Object[]> batch_negoheaders = new ArrayList<Object[]>();
        if(!v_negoheaders.isEmpty() && v_negoheaders.size() > 0){
            for(TyNegoHeaderKey v_inRow : v_negoheaders){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id")
				};
                batch_negoheaders.add(values);
            }
        }
        int[] updateCounts_negoheaders = jdbc.batchUpdate(v_sql_insertTable_negoheaders.toString(), batch_negoheaders);

		// insert local temp table : negoitemprices
        List<Object[]> batch_negoitemprices = new ArrayList<Object[]>();
        if(!v_negoitemprices.isEmpty() && v_negoitemprices.size() > 0){
            for(TyNegoItemPriceKey v_inRow : v_negoitemprices){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("nego_item_number")
				};
                batch_negoitemprices.add(values);
            }
        }
        // Procedure Input Parameter Table Type #negoitemprices
        int[] updateCounts_negoitemprices = jdbc.batchUpdate(v_sql_insertTable_negoitemprices.toString(), batch_negoitemprices);

		// insert local temp table : negosuppliers
        List<Object[]> batch_negosuppliers = new ArrayList<Object[]>();
        if(!v_negosuppliers.isEmpty() && v_negosuppliers.size() > 0){
            for(TyNegoSupplierKey v_inRow : v_negosuppliers){
                Object[] values = new Object[]
				{
                    v_inRow.get("tenant_id"),
                    v_inRow.get("nego_header_id"),
                    v_inRow.get("nego_item_number"),
                    v_inRow.get("item_supplier_sequence")
				};
                batch_negosuppliers.add(values);
            }
        }

        int[] updateCounts_negosuppliers = jdbc.batchUpdate(v_sql_insertTable_negosuppliers.toString(), batch_negosuppliers);

		// procedure call
		List<SqlParameter> paramList = new ArrayList<SqlParameter>();
		// paramList.add(new SqlParameter("i_tenant_id", Types.NVARCHAR));

        SqlReturnResultSet oReturn = new SqlReturnResultSet("o_table_message", new RowMapper<ReturnMsg>(){
            @Override
            public ReturnMsg mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                ReturnMsg v_row = ReturnMsg.create();
                v_row.setCode(v_rs.getInt("code"));
                v_row.setMessage(v_rs.getString("message"));
                v_result.add(v_row);
                return v_row;
            }
        });
        paramList.add(oReturn);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
                // callableStatement.setString("i_tenant_id", context.getDeepdeletenegoheader().getTenantId());
                return callableStatement;
            }
        }, paramList);

        // execute drop local temp table
		jdbc.execute(v_sql_dropTable_negoheaders);
		jdbc.execute(v_sql_dropTable_negoitemprices);
		jdbc.execute(v_sql_dropTable_negosuppliers);

        context.setResult(v_result);
        context.setCompleted();

    }
    

}