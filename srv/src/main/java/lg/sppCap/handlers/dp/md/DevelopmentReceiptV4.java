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

        Collection<SavedMolds> v_inMultiData = context.getMoldDatas();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        String v_sql_createSetId = "SELECT DP_MD_MST_SET_ID_SEQ.NEXTVAL FROM DUMMY";
        String v_sql_callProc = "CALL DP_MD_SCHEDULE_SAVE_PROC(MOLD_ID => ?)";
        
        try {
            Connection conn = jdbc.getDataSource().getConnection();

            // Set Id 뒤 5자리 생성
            int setIdSeq = jdbc.queryForObject(v_sql_createSetId, Integer.class);
            
            for (SavedMolds row :  v_inMultiData) {
                if((Boolean) row.get("chk")){
                    MoldMasters master = MoldMasters.create();
                    master.setMoldId((String) row.get("mold_id"));
                    master.setMoldProgressStatusCode("DEV_RCV");
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

                    CqnUpdate masterUpdate = Update.entity(MoldMasters_.CDS_NAME).data(master);
                    Result resultMaster = developmentReceiptService.run(masterUpdate);

                    MoldSpecs spec = MoldSpecs.create();
                    spec.setMoldId((String) row.get("mold_id"));
                    spec.setDieForm((String) row.get("die_form"));
                    spec.setMoldSize((String) row.get("mold_size"));
                    CqnUpdate specUpdate = Update.entity(MoldSpecs_.CDS_NAME).data(spec);
                    Result resultSpec = developmentReceiptService.run(specUpdate);
                    
                    // Procedure Call
                    CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
                    v_statement_proc.setObject(1, row.get("mold_id"));
                    boolean v_isMore = v_statement_proc.execute();
                }
            }

            context.setResult(msg);
            context.setCompleted();

        } catch (SQLException e) { 
			e.printStackTrace();
        }
    }
    
    @On(event = CancelBindDevelopmentReceiptContext.CDS_NAME)
    public void onCancelBindDevelopmentReceipt(CancelBindDevelopmentReceiptContext context) {

        Collection<SavedMolds> v_inMultiData = context.getMoldDatas();

        ResultMsg msg = ResultMsg.create();
        msg.setMessageCode("001");
        msg.setResultCode(0);

        StringBuffer v_sql_createTableMst = new StringBuffer();
        v_sql_createTableMst.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_MST (");
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
        v_sql_createTableMst.append("SET_ID NVARCHAR(100))");

        String v_sql_insertTableMst = "INSERT INTO #LOCAL_TEMP_MST VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String v_sql_truncateTableMst = "TRUNCATE TABLE #LOCAL_TEMP_MST";
        
        String v_sql_createTableSpec = "CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SPEC (MOLD_ID NVARCHAR(100), DIE_FORM NVARCHAR(240), MOLD_SIZE NVARCHAR(100))";
        String v_sql_insertTableSpec = "INSERT INTO #LOCAL_TEMP_SPEC VALUES (?, ?, ?)";
        String v_sql_truncateTableSpec = "TRUNCATE TABLE #LOCAL_TEMP_SPEC";
        
        String v_sql_callProc = "CALL DP_MD_MST_SET_ID_UPDATE_PROC(I_MST_TABLE => #LOCAL_TEMP_MST, I_SPEC_TABLE => #LOCAL_TEMP_SPEC)";

        try {
            Connection conn = jdbc.getDataSource().getConnection();

            // Local Temp Table 생성
            PreparedStatement v_statement_mst_table = conn.prepareStatement(v_sql_createTableMst.toString());
            v_statement_mst_table.execute();

            PreparedStatement v_statement_spec_table = conn.prepareStatement(v_sql_createTableSpec);
            v_statement_spec_table.execute();

            // Local Temp Table에 insert
            PreparedStatement v_statement_mst_insert = conn.prepareStatement(v_sql_insertTableMst);
            PreparedStatement v_statement_spec_insert = conn.prepareStatement(v_sql_insertTableSpec);
            
            for (SavedMolds row :  v_inMultiData) {
                if((Boolean) row.get("chk")){
                    // insert
                    v_statement_mst_insert.setObject(1, row.get("mold_id"));
                    v_statement_mst_insert.setObject(2, "DEV_RCV");
                    v_statement_mst_insert.setObject(3, row.get("mold_production_type_code"));
                    v_statement_mst_insert.setObject(4, row.get("mold_item_type_code"));
                    v_statement_mst_insert.setObject(5, row.get("mold_type_code"));
                    v_statement_mst_insert.setObject(6, row.get("mold_location_type_code"));
                    v_statement_mst_insert.setObject(7, row.get("mold_cost_analysis_type_code"));
                    v_statement_mst_insert.setObject(8, row.get("mold_purchasing_type_code"));
                    v_statement_mst_insert.setObject(9, row.get("mold_developer_empno"));
                    v_statement_mst_insert.setObject(10, row.get("remark"));
                    v_statement_mst_insert.setObject(11, row.get("family_part_number_1"));
                    v_statement_mst_insert.setObject(12, row.get("family_part_number_2"));
                    v_statement_mst_insert.setObject(13, row.get("family_part_number_3"));
                    v_statement_mst_insert.setObject(14, row.get("family_part_number_4"));
                    v_statement_mst_insert.setObject(15, row.get("family_part_number_5"));
                    v_statement_mst_insert.setObject(16, row.get("set_id"));
                    v_statement_mst_insert.addBatch();
                    
                    v_statement_spec_insert.setObject(1, row.get("mold_id"));
                    v_statement_spec_insert.setObject(2, row.get("die_form"));
                    v_statement_spec_insert.setObject(3, row.get("mold_size"));
                    v_statement_spec_insert.addBatch();
                }
            }

            v_statement_mst_insert.executeBatch();
            v_statement_spec_insert.executeBatch();

            // Procedure Call
            CallableStatement v_statement_proc = conn.prepareCall(v_sql_callProc);
            boolean v_isMore = v_statement_proc.execute();
            //int iCnt = v_statement_proc.executeUpdate();
            //ResultSet v_rs = v_statement_proc.executeQuery();

            // Procedure Out put 담기
            //while (v_rs.next()){
                //SavedMolds v_row = SavedMolds.create();
                //v_row.setSetId(v_rs.getString("set_id"));
                //v_result.add(v_row);
            //}

            // Local Temp Table trunc
            PreparedStatement v_statement_trunc_mst_table = conn.prepareStatement(v_sql_truncateTableMst);
            v_statement_trunc_mst_table.execute();

            PreparedStatement v_statement_trunc_spec_table = conn.prepareStatement(v_sql_truncateTableSpec);
            v_statement_trunc_spec_table.execute();

            context.setResult(msg);
            context.setCompleted();

        } catch (SQLException e) { 
			e.printStackTrace();
        }
    }
}