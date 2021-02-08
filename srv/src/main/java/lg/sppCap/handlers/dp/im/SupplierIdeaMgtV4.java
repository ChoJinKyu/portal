package lg.sppCap.handlers.dp.im;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;
import org.springframework.jdbc.core.CallableStatementCreator;

import cds.gen.dp.supplierideamgtv4service.*;
import cds.gen.dp.supplierideamgtservice.*;

@Component
@ServiceName(SupplierIdeaMgtV4Service_.CDS_NAME)
public class SupplierIdeaMgtV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;

    
    @Transactional(rollbackFor = SQLException.class)
    @On(event = CreateIdeaStatusProcContext.CDS_NAME)
    public void CreateIdeaStatusProc(CreateIdeaStatusProcContext context) {
        
        IdeaStatusIn v_inDatas = context.getInputdata();
        System.out.println(v_inDatas.get("tenant_id"));
        System.out.println(v_inDatas.get("idea_number"));
        System.out.println(v_inDatas.get("idea_progress_status_code"));
    }



    
    @Transactional(rollbackFor = SQLException.class)
    @On(event = SaveIdeaProcContext.CDS_NAME)
    public void SaveIdeaProc(SaveIdeaProcContext context) {
        
        IdeaIn v_inDatas = context.getInputdata();
        /*
        System.out.println(v_inDatas.get("tenant_id"));
        System.out.println(v_inDatas.get("idea_number"));
        System.out.println(v_inDatas.get("idea_title"));if(!v_inDatas.isEmpty() && v_inDatas.size() > 0){
            for(PdProdActivityTemplateType v_inRow : v_inDatas){
                System.out.println(v_inRow.get("crud_type_code"));
                System.out.println(v_inRow.get("product_activity_code"));
                System.out.println(v_inRow.get("product_activity_name"));
            }
        }*/
        
        // local Temp table create or drop 시 이전에 실행된 내용이 commit 되지 않도록 set
        String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
        StringBuffer v_sql_createTable = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SUPPLIER_IDEA (");

        v_sql_createTable.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTable.append("COMPANY_CODE NVARCHAR(10),");
        v_sql_createTable.append("IDEA_NUMBER NVARCHAR(10),");
        v_sql_createTable.append("IDEA_TITLE NVARCHAR(100),");
        v_sql_createTable.append("IDEA_PROGRESS_STATUS_CODE NVARCHAR(30),");

        v_sql_createTable.append("SUPPLIER_CODE NVARCHAR(10),");
        v_sql_createTable.append("USER_ID NVARCHAR(255),");
        v_sql_createTable.append("BIZUNIT_CODE NVARCHAR(10),");
        v_sql_createTable.append("IDEA_PRODUCT_GROUP_CODE NVARCHAR(30),");
        v_sql_createTable.append("IDEA_TYPE_CODE NVARCHAR(30),");

        v_sql_createTable.append("IDEA_PERIOD_CODE NVARCHAR(30),");
        v_sql_createTable.append("IDEA_MANAGER_EMPNO NVARCHAR(30),");
        v_sql_createTable.append("IDEA_PART_DESC NVARCHAR(100),");
        v_sql_createTable.append("CURRENT_PROPOSAL_CONTENTS NVARCHAR(500),");
        v_sql_createTable.append("CHANGE_PROPOSAL_CONTENTS NVARCHAR(500),");

        v_sql_createTable.append("IDEA_CONTENTS NCLOB,");
        v_sql_createTable.append("ATTCH_GROUP_NUMBER NVARCHAR(100),");
        v_sql_createTable.append("MATERIAL_CODE NVARCHAR(40),");
        v_sql_createTable.append("PURCHASING_UOM_CODE NVARCHAR(3),");
        v_sql_createTable.append("CURRENCY_CODE NVARCHAR(3),");
        
        v_sql_createTable.append("VI_AMOUNT DECIMAL,");
        v_sql_createTable.append("MONTHLY_MTLMOB_QUANTITY DECIMAL,");
        v_sql_createTable.append("MONTHLY_PURCHASING_AMOUNT DECIMAL,");
        v_sql_createTable.append("ANNUAL_PURCHASING_AMOUNT DECIMAL,");
        v_sql_createTable.append("PERFORM_CONTENTS NVARCHAR(500),");

        v_sql_createTable.append("CUD_TYPE_CODE NVARCHAR(1) )");

        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_SUPPLIER_IDEA VALUES (?, ?, ?, ?, ?,    ?, ?, ?, ?, ?,    ?, ?, ?, ?, ?,     ?, ?, ?, ?, ?,     ?, ?, ?, ?, ?,   ?)";
        String v_sql_callProc = "CALL DP_IM_SAVE_IDEA_PROC(I_SAVE_TAB => #LOCAL_TEMP_SUPPLIER_IDEA, O_RETURN_TAB => ?)";
        
        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP_SUPPLIER_IDEA";

        Collection<IdeaStatusResult> v_result = new ArrayList<>();

        ResultSet v_rs = null;

                    
        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());
        
        // Local Temp Table에 insert
        List<Object[]> batch = new ArrayList<Object[]>();
        if(!v_inDatas.isEmpty() && v_inDatas.size() > 0){
            Object[] values = new Object[] {
                v_inDatas.get("tenant_id"),
                v_inDatas.get("company_code"),
                v_inDatas.get("idea_number"),
                v_inDatas.get("idea_title"),
                v_inDatas.get("idea_progress_status_code"),

                v_inDatas.get("supplier_code"),
                v_inDatas.get("idea_create_user_id"),
                v_inDatas.get("bizunit_code"),
                v_inDatas.get("idea_product_group_code"),
                v_inDatas.get("idea_type_code"),

                v_inDatas.get("idea_period_code"),
                v_inDatas.get("idea_manager_empno"),
                v_inDatas.get("idea_part_desc"),
                v_inDatas.get("current_proposal_contents"),
                v_inDatas.get("change_proposal_contents"),

                v_inDatas.get("idea_contents"),
                v_inDatas.get("attch_group_number"),
                v_inDatas.get("material_code"),
                v_inDatas.get("purchasing_uom_code"),
                v_inDatas.get("currency_code"),
                
                Integer.parseInt(String.valueOf(v_inDatas.get("vi_amount"))),
                Integer.parseInt(String.valueOf(v_inDatas.get("monthly_mtlmob_quantity"))),
                Integer.parseInt(String.valueOf(v_inDatas.get("monthly_purchasing_amount"))),
                Integer.parseInt(String.valueOf(v_inDatas.get("annual_purchasing_amount"))),
                v_inDatas.get("perform_contents"),

                v_inDatas.get("crd_type_code")
            };
            batch.add(values);
        }

        int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);
                
    
        IdeaStatusResult v_row = IdeaStatusResult.create();
        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_TABLE", new RowMapper<IdeaStatusResult>(){
            @Override
            public IdeaStatusResult mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
                v_row.setReturnMsgCode(v_rs.getString("return_msg_code"));
                v_result.add(v_row);
                return v_row;
            }
        });
    

        List<SqlParameter> paramList = new ArrayList<SqlParameter>();
        paramList.add(oTable);

        Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
            @Override
            public CallableStatement createCallableStatement(Connection connection) throws SQLException {
                CallableStatement callableStatement = connection.prepareCall(v_sql_callProc);
                return callableStatement;
            }
        }, paramList);
        


        // Local Temp Table DROP
        jdbc.execute(v_sql_dropable);

        context.setResult(v_row);
        context.setCompleted();

    }

}