package lg.sppCap.handlers.ep.po;

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

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.ep.projectmgtv4service.DeleteProjectProcContext;
import cds.gen.ep.projectmgtv4service.OutType;
import cds.gen.ep.projectmgtv4service.ProjectMgtV4Service_;
import cds.gen.ep.projectmgtv4service.SaveProjectProcContext;

@Component
@ServiceName(ProjectMgtV4Service_.CDS_NAME)
public class ProjectMgtV4Service implements EventHandler {

    private static final Logger log = LogManager.getLogger();

    @Autowired
    private JdbcTemplate jdbc;

    //Project 등록
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveProjectProcContext.CDS_NAME)
    public void onSaveProjectProc(SaveProjectProcContext context) {

        log.info("### EP_SAVE_PROJECT_PROC 프로시저 호출시작 ###");

        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";        

        StringBuffer v_sql_callProc = new StringBuffer();

        v_sql_callProc.append("CALL EP_SAVE_PROJECT_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_EP_PROJECT_NUMBER => ?, ")
                    .append(" I_PROJECT_NAME => ?, ")
                    .append(" I_EP_PURCHASING_TYPE_CODE => ?, ")
                    .append(" I_PLANT_CODE => ?, ")
                    .append(" I_BIZUNIT_CODE => ?, ")
                    .append(" I_BIZDIVISION_CODE => ?, ")
                    .append(" I_REMARK => ?, ")
                    .append(" I_ORG_TYPE_CODE => ?, ")
                    .append(" I_ORG_CODE => ?, ")
                    .append(" I_USER_ID => ?, ")
                    .append(" O_TABLE_MESSAGE => ? ")
                .append(" )");        

        Collection<OutType> v_result = new ArrayList<>(); 

        // Commit Option
        jdbc.execute(v_sql_commitOption);     
    
        SqlReturnResultSet oDTable = new SqlReturnResultSet("O_TABLE_MESSAGE", new RowMapper<OutType>(){
            @Override
            public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                OutType v_row = OutType.create();
                v_row.setReturncode(v_rs.getString("returncode"));
                v_row.setReturnmessage(v_rs.getString("returnmessage"));
                v_row.setSavedkey(v_rs.getString("savedkey"));
                v_result.add(v_row);
                return v_row;
            }
        });     

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();

        paramList.add(new SqlParameter("I_TENANT_ID", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_COMPANY_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_EP_PROJECT_NUMBER", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_PROJECT_NAME", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_EP_PURCHASING_TYPE_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_PLANT_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_BIZUNIT_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_BIZDIVISION_CODE", Types.BOOLEAN));
        paramList.add(new SqlParameter("I_REMARK", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ORG_TYPE_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_ORG_CODE", Types.NVARCHAR));
        paramList.add(new SqlParameter("I_USER_ID", Types.NVARCHAR));
        paramList.add(oDTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection con) throws SQLException {
                CallableStatement stmt = con.prepareCall(v_sql_callProc.toString());
                stmt.setObject(1, context.getTenantId());
                stmt.setObject(2, context.getCompanyCode());
                stmt.setObject(3, context.getEpProjectNumber());
                stmt.setObject(4, context.getProjectName());
                stmt.setObject(5, context.getEpPurchasingTypeCode());
                stmt.setObject(6, context.getPlantCode());
                stmt.setObject(7, context.getBizunitCode());
                stmt.setObject(8, context.getBizdivisionCode());
                stmt.setObject(9, context.getRemark());
                stmt.setObject(10, context.getOrgTypeCode());
                stmt.setObject(11, context.getOrgCode());
                stmt.setObject(12, context.getUserId());
                return stmt;
            }
        }, paramList);       
        
        context.setResult(v_result);            
        context.setCompleted();            

        log.info("### EP_SAVE_PROJECT_PROC 프로시저 호출종료 ###");

    }    

    //프로젝트 삭제
    @Transactional(rollbackFor = SQLException.class)
    @On(event = DeleteProjectProcContext.CDS_NAME)
    public void onDeleteLoiVosProc(DeleteProjectProcContext context) {
        
        log.info("### EP_DELETE_PROJECT_PROC 프로시저 호출시작 ###");
        
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        StringBuffer v_sql = new StringBuffer();
        v_sql.append("CALL EP_DELETE_PROJECT_PROC ( ")
                    .append(" I_TENANT_ID => ?, ")
                    .append(" I_COMPANY_CODE => ?, ")
                    .append(" I_EP_PROJECT_NUMBER => ?, ")
                    .append(" O_RTN_MSG => ? ")
                .append(" )");        

        String resultMessage = "";

        jdbc.update(v_sql.toString()
        , context.getTenantId()
        , context.getCompanyCode()
        , context.getEpProjectNumber()
        , resultMessage
        );

        context.setResult("SUCCESS");
        context.setCompleted();

        log.info("### EP_DELETE_PROJECT_PROC 프로시저 종료 ###");

    }       
    
}