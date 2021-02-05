package lg.sppCap.handlers.dp.tc;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlOutParameter;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import cds.gen.dp.mcstbommgtv4service.*;

/**
 *  프로시저 호출시 OutPut의 경우 문자열로 적용시 데이터을 받지 못하고 있음 
 *  OutPut에 경우 O_TABLE형식으로 보내줘야함   
 */
@Component
@ServiceName(McstBomMgtV4Service_.CDS_NAME)
public class McstBomMgtServiceV4 implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;   

    /**
     * BOM Mapping 생성
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event=TcCreateMcstBomProcContext.CDS_NAME)
    public void onTcCreateMcstBomProc(TcCreateMcstBomProcContext context) {

        log.info("### DP_TC_CREATE_MCST_BOM_MAP_PROC 프로시저 호출시작  start###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        //Drop TEMP Tables
        String v_sql_droptable_old = "DROP TABLE #LOCAL_TEMP_OLD";
        String v_sql_droptable_new = "DROP TABLE #LOCAL_TEMP_NEW";
        //Create TEMP Tables
        StringBuffer v_sql_createTableOld = new StringBuffer();
        StringBuffer v_sql_createTableNew = new StringBuffer();

        v_sql_createTableOld.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_OLD (");
        v_sql_createTableOld.append("MATERIAL_CODE NVARCHAR(40))");

        v_sql_createTableNew.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_NEW (");
        v_sql_createTableNew.append("MATERIAL_CODE NVARCHAR(40),");
        v_sql_createTableNew.append("CHANGE_REASON NVARCHAR(1000))");
        //Insert TEMP Tables
        String v_sql_insertTableOld = "INSERT INTO #LOCAL_TEMP_OLD VALUES (?)";
        String v_sql_insertTableNew = "INSERT INTO #LOCAL_TEMP_NEW VALUES (?, ?)";

        StringBuffer v_sql_callProcCreateBomMap = new StringBuffer();
        v_sql_callProcCreateBomMap.append("CALL DP_TC_CREATE_MCST_BOM_MAP_PROC(");        
        v_sql_callProcCreateBomMap.append("I_TENANT_ID => ?,"); 
        v_sql_callProcCreateBomMap.append("I_PROJECT_CODE => ?,");        
        v_sql_callProcCreateBomMap.append("I_MODEL_CODE => ?, ");
        v_sql_callProcCreateBomMap.append("I_VERSION_NUMBER => ?,");
        v_sql_callProcCreateBomMap.append("I_USER_ID => ?,");
        v_sql_callProcCreateBomMap.append("I_OLD_TBL => #LOCAL_TEMP_OLD,");   
        v_sql_callProcCreateBomMap.append("I_NEW_TBL => #LOCAL_TEMP_NEW,");
        v_sql_callProcCreateBomMap.append("I_DEPARTMENT_TYPE_CODE => ?,");
        v_sql_callProcCreateBomMap.append("I_CREATOR_EMPNO => ?,");
        v_sql_callProcCreateBomMap.append("I_ENG_CHANGE_NUMBER => ?,");
        v_sql_callProcCreateBomMap.append("I_CHANGE_REASON => ?,");
        v_sql_callProcCreateBomMap.append("O_MSG => ?)");

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        //-------- Old Temp Table -----------
        OutputData v_result = OutputData.create();
        Collection<OldTblData> v_inOld = context.getInputData().getOldTbl();
        jdbc.execute(v_sql_createTableOld.toString());

        //Temp Table에 insert
        List<Object[]> batch_old = new ArrayList<Object[]>();

        log.info("-----> v_inOld : " + v_inOld.size());

        for(OldTblData v_inOldData : v_inOld) {
            Object[] values = new Object[] {
                v_inOldData.get("material_code")
            };
            batch_old.add(values);
        }

        int[] updateOldCounts = jdbc.batchUpdate(v_sql_insertTableOld, batch_old);
        log.info("batch_old : " + updateOldCounts);

        //-------- New Temp Table -----------
        Collection<NewTblData> v_inNew = context.getInputData().getNewTbl();
        jdbc.execute(v_sql_createTableNew.toString());

        //Temp Table에 insert
        List<Object[]> batch_new = new ArrayList<Object[]>();

        log.info("-----> v_inNew : " + v_inNew.size());

        for(NewTblData v_inNewData : v_inNew) {
            Object[] values = new Object[] {
                v_inNewData.get("material_code"),
                v_inNewData.get("change_reason")
            };
            batch_new.add(values);
        }

        int[] updateNewCounts = jdbc.batchUpdate(v_sql_insertTableNew, batch_new);
        log.info("batch_new : " + updateNewCounts);

        //프로시저 output 담기
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputData>(){
            @Override
            public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        //프로시저 call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProcCreateBomMap.toString());
                callableStatement.setString("I_TENANT_ID", context.getInputData().getTenantId());
                callableStatement.setString("I_PROJECT_CODE", context.getInputData().getProjectCode());
                callableStatement.setString("I_MODEL_CODE", context.getInputData().getModelCode());
                callableStatement.setString("I_VERSION_NUMBER", context.getInputData().getVersionNumber());
                callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                callableStatement.setString("I_DEPARTMENT_TYPE_CODE", context.getInputData().getDepartmentTypeCode());
                callableStatement.setString("I_CREATOR_EMPNO", context.getInputData().getCreatorEmpno());
                callableStatement.setString("I_ENG_CHANGE_NUMBER", context.getInputData().getEngChangeNumber());
                callableStatement.setString("I_CHANGE_REASON", context.getInputData().getChangeReason());
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_droptable_old);
        jdbc.execute(v_sql_droptable_new);

        context.setResult(v_result);
        context.setCompleted();

        log.info("### DP_TC_CREATE_MCST_BOM_MAP_PROC 프로시저 호출 종료 end ###");
    }


    /**
     * BOM Mapping 수정
     * @param context
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event=TcUpdateMcstBomProcContext.CDS_NAME)
    public void onTcUpdateMcstBomProc(TcUpdateMcstBomProcContext context) {

        log.info("### DP_TC_UPDATE_MCST_BOM_MAP_PROC 프로시저 호출시작  start###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        //Drop TEMP Tables
        String v_sql_droptable_new = "DROP TABLE #LOCAL_TEMP_NEW";
        //Create TEMP Tables
        StringBuffer v_sql_createTableNew = new StringBuffer();

        v_sql_createTableNew.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_NEW (");
        v_sql_createTableNew.append("MATERIAL_CODE NVARCHAR(40),");
        v_sql_createTableNew.append("CHANGE_REASON NVARCHAR(1000))");
        //Insert TEMP Tables
        String v_sql_insertTableNew = "INSERT INTO #LOCAL_TEMP_NEW VALUES (?, ?)";

        StringBuffer v_sql_callProcCreateBomMap = new StringBuffer();
        v_sql_callProcCreateBomMap.append("CALL DP_TC_UPDATE_MCST_BOM_MAP_PROC(");        
        v_sql_callProcCreateBomMap.append("I_TENANT_ID => ?,"); 
        v_sql_callProcCreateBomMap.append("I_MAPPING_ID => ?,");        
        v_sql_callProcCreateBomMap.append("I_USER_ID => ?,");
        v_sql_callProcCreateBomMap.append("I_NEW_TBL => #LOCAL_TEMP_NEW,");
        v_sql_callProcCreateBomMap.append("I_DEPARTMENT_TYPE_CODE => ?,");
        v_sql_callProcCreateBomMap.append("I_CREATOR_EMPNO => ?,");
        v_sql_callProcCreateBomMap.append("I_ENG_CHANGE_NUMBER => ?,");
        v_sql_callProcCreateBomMap.append("I_CHANGE_REASON => ?,");
        v_sql_callProcCreateBomMap.append("O_MSG => ?)");

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        //-------- New Temp Table -----------
        OutputData v_result = OutputData.create();
        Collection<NewTblData> v_inNew = context.getInputData().getNewTbl();
        jdbc.execute(v_sql_createTableNew.toString());

        //Temp Table에 insert
        List<Object[]> batch_new = new ArrayList<Object[]>();

        log.info("-----> v_inNew : " + v_inNew.size());

        for(NewTblData v_inNewData : v_inNew) {
            Object[] values = new Object[] {
                v_inNewData.get("material_code"),
                v_inNewData.get("change_reason")
            };
            batch_new.add(values);
        }

        int[] updateNewCounts = jdbc.batchUpdate(v_sql_insertTableNew, batch_new);
        log.info("batch_new : " + updateNewCounts);

        //프로시저 output 담기
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputData>(){
            @Override
            public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        //프로시저 call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProcCreateBomMap.toString());
                callableStatement.setString("I_TENANT_ID", context.getInputData().getTenantId());
                callableStatement.setInt("I_MAPPING_ID", context.getInputData().getMappingId());
                //callableStatement.setString("I_MAPPING_ID", context.getInputData().getMappingId());
                callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                callableStatement.setString("I_DEPARTMENT_TYPE_CODE", context.getInputData().getDepartmentTypeCode());
                callableStatement.setString("I_CREATOR_EMPNO", context.getInputData().getCreatorEmpno());
                callableStatement.setString("I_ENG_CHANGE_NUMBER", context.getInputData().getEngChangeNumber());
                callableStatement.setString("I_CHANGE_REASON", context.getInputData().getChangeReason());
                return callableStatement;
            }
        }, paramList);

        // Local Temp Table DROP
        jdbc.execute(v_sql_droptable_new);

        context.setResult(v_result);
        context.setCompleted();

        log.info("### DP_TC_UPDATE_MCST_BOM_MAP_PROC 프로시저 호출 종료 end ###");

    }

    /**
     * BOM Mapping 삭제
     * 
     * @param context
     * @throws Exception
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event = TcDeleteMcstBomProcContext.CDS_NAME)
    public void onTcDeleteMcstBomProc(TcDeleteMcstBomProcContext context) throws Exception {

        log.info("### DP_TC_DELETE_MCST_BOM_MAP_PROC 프로시저 호출시작  start###");

        OutputData v_result = OutputData.create();

        //프로시저 직접 호출.
        StringBuffer v_sql_callProcDelete = new StringBuffer();
        v_sql_callProcDelete.append("CALL DP_TC_DELETE_MCST_BOM_MAP_PROC(");        
        v_sql_callProcDelete.append("I_TENANT_ID => ?,"); 
        v_sql_callProcDelete.append("I_PROJECT_CODE => ?,");        
        v_sql_callProcDelete.append("I_MODEL_CODE => ?, ");
        v_sql_callProcDelete.append("I_VERSION_NUMBER => ?,");
        v_sql_callProcDelete.append("I_MAPPING_ID => ?,"); 
        v_sql_callProcDelete.append("I_USER_ID => ?,");
        v_sql_callProcDelete.append("O_RETURN_CODE => ?,");
        v_sql_callProcDelete.append("O_RETURN_MSG => ?)");

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();

        paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_PROJECT_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_MODEL_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_VERSION_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_MAPPING_ID", Types.DECIMAL));
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
        paramList.add(new SqlOutParameter("O_RETURN_CODE", Types.NVARCHAR));
        paramList.add(new SqlOutParameter("O_RETURN_MSG", Types.NVARCHAR));

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProcDelete.toString());
                stmt.setObject(1, context.getInputData().getTenantId());
                stmt.setObject(2, context.getInputData().getProjectCode());
                stmt.setObject(3, context.getInputData().getModelCode());
                stmt.setObject(4, context.getInputData().getVersionNumber());
                stmt.setObject(5, context.getInputData().getMappingId());
                stmt.setObject(6, context.getInputData().getUserId());
                stmt.registerOutParameter(7, Types.NVARCHAR);
                stmt.registerOutParameter(8, Types.NVARCHAR);

                return stmt;
            }
        }, paramList);

        log.info("--------> v_inBaseExtract O_RETURN_CODE :: "+ resultMap.get("O_RETURN_CODE"));
        log.info("--------> v_inBaseExtract O_RETURN_MSG :: "+ resultMap.get("O_RETURN_MSG"));
        if(!"OK".equals(resultMap.get("O_RETURN_CODE"))) {
            throw new Exception((String) resultMap.get("O_RETURN_MSG"));
        } 
        v_result.setReturnCode((String)resultMap.get("O_RETURN_CODE"));
        v_result.setReturnMsg((String)resultMap.get("O_RETURN_MSG"));
        context.setResult(v_result);
        context.setCompleted();

        log.info("### DP_TC_DELETE_MCST_BOM_MAP_PROC 프로시저 호출 종료 end ###");

    }

    /**
     * PartList 저장
     * 
     * @param context
     * @throws Exception
     */
    @Transactional(rollbackFor = SQLException.class)
    @On(event = TcSaveMcstPartListProcContext.CDS_NAME)
    public void onTcSaveMcstPartListProc(TcSaveMcstPartListProcContext context) throws Exception {

        log.info("### DP_TC_SAVE_MCST_PART_LIST_PROC 프로시저 호출시작  start###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        //Drop TEMP Tables
        String v_sql_droptable_part = "DROP TABLE #LOCAL_TEMP_PART";
        //Create TEMP Tables
        StringBuffer v_sql_createTablePart = new StringBuffer();

        v_sql_createTablePart.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_PART (");
        v_sql_createTablePart.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTablePart.append("PROJECT_CODE NVARCHAR(30),");
        v_sql_createTablePart.append("MODEL_CODE NVARCHAR(40),");
        v_sql_createTablePart.append("VERSION_NUMBER NVARCHAR(30),");
        v_sql_createTablePart.append("MATERIAL_CODE NVARCHAR(40),");
        v_sql_createTablePart.append("COMMODITY_CODE NVARCHAR(100),");
        v_sql_createTablePart.append("UOM_CODE NVARCHAR(3),");
        v_sql_createTablePart.append("MATERIAL_REQM_QUANTITY DECIMAL,");
        v_sql_createTablePart.append("BUYER_EMPNO NVARCHAR(30),");
        v_sql_createTablePart.append("MAPPING_ID INTEGER,");
        v_sql_createTablePart.append("CRUD_TYPE_CODE NVARCHAR(1))");
        //Insert TEMP Tables
        String v_sql_insertTablePart = "INSERT INTO #LOCAL_TEMP_PART VALUES (?,?,?,?,?,?,?,?,?,?,?)";

        StringBuffer v_sql_callProcSavePart = new StringBuffer();
        v_sql_callProcSavePart.append("CALL DP_TC_SAVE_MCST_PART_LIST_PROC(");        
        v_sql_callProcSavePart.append("I_TABLE => #LOCAL_TEMP_PART,");   
        v_sql_callProcSavePart.append("I_USER_ID => ?,");
        v_sql_callProcSavePart.append("O_MSG => ?)");

        // Commit Option
        jdbc.execute(v_sql_commitOption);

        //-------- Old Temp Table -----------
        OutputData v_result = OutputData.create();
        Collection<SavePartListData> v_inPartList = context.getInputData().getPartList();
        jdbc.execute(v_sql_createTablePart.toString());

        //Temp Table에 insert
        List<Object[]> batch_part = new ArrayList<Object[]>();

        log.info("-----> v_inPartList : " + v_inPartList.size());

        for(SavePartListData v_inData : v_inPartList) {
            Object[] values = new Object[] {
                v_inData.get("tenant_id"),
                v_inData.get("project_code"),
                v_inData.get("model_code"),
                v_inData.get("version_number"),
                v_inData.get("material_code"),
                v_inData.get("commodity_code"),
                v_inData.get("uom_code"),
                v_inData.get("material_reqm_quantity"),
                v_inData.get("buyer_empno"),
                v_inData.get("mapping_id"),
                v_inData.get("crud_type_code")
            };
            batch_part.add(values);
        }

        int[] updateOldCounts = jdbc.batchUpdate(v_sql_insertTablePart, batch_part);
        log.info("batch_part : " + updateOldCounts);

        //프로시저 output 담기
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<OutputData>(){
            @Override
            public OutputData mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_result.setReturnCode(v_rs.getString("return_code"));
                v_result.setReturnMsg(v_rs.getString("return_msg"));
                return v_result;
            }
        });

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));

        //프로시저 call
        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProcSavePart.toString());
                callableStatement.setString("I_USER_ID", context.getInputData().getUserId());
                return callableStatement;
            }
        }, paramList);
        
        // Local Temp Table DROP
        jdbc.execute(v_sql_droptable_part);

        context.setResult(v_result);
        context.setCompleted();

        log.info("### DP_TC_SAVE_MCST_PART_LIST_PROC 프로시저 호출 종료 end ###");

    }
}