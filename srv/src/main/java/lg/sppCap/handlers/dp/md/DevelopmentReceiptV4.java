package lg.sppCap.handlers.dp.md;

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
import java.util.Set;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CdsDeleteEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.datasource.DataSourceUtils;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.ql.cqn.AnalysisResult;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Delete;
import com.sap.cds.Result;


import com.sap.cds.feature.xsuaa.XsuaaUserInfo;
import cds.gen.dp.developmentreceiptv4service.*;
import cds.gen.dp.developmentreceiptservice.*;

@Component
@ServiceName(DevelopmentReceiptV4Service_.CDS_NAME)
public class DevelopmentReceiptV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    @Qualifier(DevelopmentReceiptService_.CDS_NAME)
    private CdsService developmentReceiptService;

    @On(event = BindDevelopmentReceiptContext.CDS_NAME)
    public void onBindDevelopmentReceipt(BindDevelopmentReceiptContext context) {

        Instant current = Instant.now();

        Collection<SavedMolds> v_inMultiData = context.getMoldDatas();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        String statusCode = "DEV_RCV";
        String v_sql_createSetId = "SELECT DP_MD_MST_SET_ID_SEQ.NEXTVAL FROM DUMMY";
        String v_sql_callProc = "CALL DP_MD_SCHEDULE_SAVE_PROC(TENANT_ID => ?, MOLD_ID => ?)";
        String v_progressSql_callProc = "CALL DP_MD_PROGRESS_STATUS_INSERT_PROC(TENANT_ID => ?, MOLD_ID => ?, PROG_STATUS_CODE => ?, PROG_STATUS_CHANGE_DATE => ?, PROG_STATUS_CHANGER_EMPNO => ?, PROG_STATUS_CHANGER_DEPT_CODE => ?, REMARK => ?)";

        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        Date today = new Date();
        
        // Set Id 뒤 5자리 생성
        int setIdSeq = jdbc.queryForObject(v_sql_createSetId, Integer.class);
        
        for (SavedMolds row :  v_inMultiData) {
            if((Boolean) row.get("chk")){
                MoldMasters master = MoldMasters.create();
                master.setTenantId((String) row.get("tenant_id"));
                master.setMoldId((String) row.get("mold_id"));
                master.setMoldProgressStatusCode(statusCode);
                master.setMoldProductionTypeCode((String) row.get("mold_production_type_code"));
                master.setMoldItemTypeCode((String) row.get("mold_item_type_code"));
                master.setMoldTypeCode((String) row.get("mold_type_code"));
                master.setMoldLocationTypeCode((String) row.get("mold_location_type_code"));
                master.setMoldCostAnalysisTypeCode((String) row.get("mold_cost_analysis_type_code"));
                master.setMoldPurchasingTypeCode((String) row.get("mold_purchasing_type_code"));
                master.setMoldDeveloperEmpno((String) row.get("mold_developer_empno"));
                master.setRemark((String) row.get("remark"));
                master.setFamilyPartNumber1((String) row.get("family_part_number_1"));
                master.setFamilyPartNumber2((String) row.get("family_part_number_2"));
                master.setFamilyPartNumber3((String) row.get("family_part_number_3"));
                master.setFamilyPartNumber4((String) row.get("family_part_number_4"));
                master.setFamilyPartNumber5((String) row.get("family_part_number_5"));
                master.setSetId(Integer.toString(setIdSeq));
                master.setLocalUpdateDtm(current);

                CqnUpdate masterUpdate = Update.entity(MoldMasters_.CDS_NAME).data(master);
                Result resultMaster = developmentReceiptService.run(masterUpdate);

                MoldSpecs spec = MoldSpecs.create();
                spec.setTenantId((String) row.get("tenant_id"));
                spec.setMoldId((String) row.get("mold_id"));
                spec.setDieForm((String) row.get("die_form"));
                spec.setMoldSize((String) row.get("mold_size"));
                spec.setLocalUpdateDtm(current);
                CqnUpdate specUpdate = Update.entity(MoldSpecs_.CDS_NAME).data(spec);
                Result resultSpec = developmentReceiptService.run(specUpdate);
                
                // Procedure Call
                jdbc.update(v_sql_callProc, row.get("tenant_id"), row.get("mold_id"));
                jdbc.update(v_progressSql_callProc, row.get("tenant_id"), row.get("mold_id"), statusCode, sdf.format(today), "anonymous", "anonymous", "");
            }
        }

        context.setResult(msg);
        context.setCompleted();

    }
    
    @On(event = CancelBindDevelopmentReceiptContext.CDS_NAME)
    public void onCancelBindDevelopmentReceipt(CancelBindDevelopmentReceiptContext context) {

        Collection<SavedMolds> v_inMultiData = context.getMoldDatas();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        String statusCode = "DEV_RCV";
        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MST (");
        v_sql_createTableMst.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTableMst.append("MOLD_ID NVARCHAR(100),");
        v_sql_createTableMst.append("MOLD_PROGRESS_STATUS_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_PRODUCTION_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_ITEM_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_LOCATION_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_COST_ANALYSIS_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_PURCHASING_TYPE_CODE NVARCHAR(30),");
        v_sql_createTableMst.append("MOLD_DEVELOPER_EMPNO NVARCHAR(255),");
        v_sql_createTableMst.append("REMARK NVARCHAR(3000),");
        v_sql_createTableMst.append("FAMILY_PART_NUMBER_1 NVARCHAR(240),");
        v_sql_createTableMst.append("FAMILY_PART_NUMBER_2 NVARCHAR(240),");
        v_sql_createTableMst.append("FAMILY_PART_NUMBER_3 NVARCHAR(240),");
        v_sql_createTableMst.append("FAMILY_PART_NUMBER_4 NVARCHAR(240),");
        v_sql_createTableMst.append("FAMILY_PART_NUMBER_5 NVARCHAR(240),");
        v_sql_createTableMst.append("SET_ID NVARCHAR(100),");
        v_sql_createTableMst.append("UPDATE_USER_ID NVARCHAR(30))");

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_MST VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_dropTableMst = "DROP TABLE #LOCAL_TEMP_MST";
        
        String v_sql_createTableSpec = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SPEC (TENANT_ID NVARCHAR(5), MOLD_ID NVARCHAR(100), DIE_FORM NVARCHAR(240), MOLD_SIZE NVARCHAR(100))";
        String v_sql_insertTableSpec = "INSERT INTO #LOCAL_TEMP_SPEC VALUES (?, ?, ?, ?)";
        String v_sql_dropTableSpec = "DROP TABLE #LOCAL_TEMP_SPEC";
        
        String v_sql_callProc = "CALL DP_MD_MST_SET_ID_UPDATE_PROC(I_MST_TABLE => #LOCAL_TEMP_MST, I_SPEC_TABLE => #LOCAL_TEMP_SPEC)";

        // Local Temp Table 생성
        jdbc.execute(v_sql_createTableMst.toString());
        jdbc.execute(v_sql_createTableSpec);

        // Local Temp Table에 insert
        List<Object[]> batchM = new ArrayList<Object[]>();
        List<Object[]> batchS = new ArrayList<Object[]>();
        if(!v_inMultiData.isEmpty() && v_inMultiData.size() > 0){
            for(SavedMolds v_inRow : v_inMultiData){
                if((Boolean) v_inRow.get("chk")){
                    Object[] valuesM = new Object[] {
                        v_inRow.get("tenant_id"),
                        v_inRow.get("mold_id"),
                        statusCode,
                        v_inRow.get("mold_production_type_code"),
                        v_inRow.get("mold_item_type_code"),
                        v_inRow.get("mold_type_code"),
                        v_inRow.get("mold_location_type_code"),
                        v_inRow.get("mold_cost_analysis_type_code"),
                        v_inRow.get("mold_purchasing_type_code"),
                        v_inRow.get("mold_developer_empno"),
                        v_inRow.get("remark"),
                        v_inRow.get("family_part_number_1"),
                        v_inRow.get("family_part_number_2"),
                        v_inRow.get("family_part_number_3"),
                        v_inRow.get("family_part_number_4"),
                        v_inRow.get("family_part_number_5"),
                        v_inRow.get("set_id"),
                        "anonymous"};
                    batchM.add(valuesM);
                    Object[] valuesS = new Object[] {
                        v_inRow.get("tenant_id"),
                        v_inRow.get("mold_id"),
                        v_inRow.get("die_form"),
                        v_inRow.get("mold_size")};
                    batchS.add(valuesS);
                }
            }
        }

        int[] updateCountsM = jdbc.batchUpdate(v_sql_insertTableMst, batchM);
        int[] updateCountsS = jdbc.batchUpdate(v_sql_insertTableSpec, batchS);

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();

        // Procedure Call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                return callableStatement;
            }
        }, paramList);


        // Local Temp Table DROP
        jdbc.execute(v_sql_dropTableMst);
        jdbc.execute(v_sql_dropTableSpec);

        context.setResult(msg);
        context.setCompleted();

    }
}