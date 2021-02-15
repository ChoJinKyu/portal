package lg.sppCap.handlers.dp.pd;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cds.gen.dp.partcategoryv4service.*;

@Component
@ServiceName(PartCategoryV4Service_.CDS_NAME)
public class PartCategoryV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;
    
    private final static Logger log = LoggerFactory.getLogger(TemplateV4Service.class);

    @Transactional(rollbackFor = SQLException.class)
    @On(event = PdPartCategorySaveProcContext.CDS_NAME)
    public void PdPartCategorySaveProc(PdPartCategorySaveProcContext context) {
        
        // ProcInputType v_inDatas = context.getInputdata();
        // System.out.println(v_inDatas.get("crud_type"));
        String crudType = context.getInputData().getCrudType();
        PdPartCategoryType v_pdMst = context.getInputData().getPdMst();
        Collection<PdPartCategoryLngType> v_pdDtl = context.getInputData().getPdDtl();
        Collection<PdpartCategoryActivityType> v_pdSD = context.getInputData().getPdSD();
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
        v_sql_createTable.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_CATE_TYPE (");

        v_sql_createTable.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTable.append("CATEGORY_GROUP_CODE NVARCHAR(30),");
        v_sql_createTable.append("CATEGORY_CODE NVARCHAR(40),");
        v_sql_createTable.append("PARENT_CATEGORY_CODE NVARCHAR(40),");
        v_sql_createTable.append("SEQUENCE DECIMAL,");
        
        v_sql_createTable.append("ACTIVE_FLAG BOOLEAN,");
        v_sql_createTable.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createTable.append("CRUD_TYPE_CODE NVARCHAR(1) )");

        
        StringBuffer v_sql_createTable2 = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createTable2.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_LANG (");

        v_sql_createTable2.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTable2.append("CATEGORY_GROUP_CODE NVARCHAR(30),");
        v_sql_createTable2.append("CATEGORY_CODE NVARCHAR(40),");
        v_sql_createTable2.append("LANGUAGE_CD NVARCHAR(30),");
        v_sql_createTable2.append("CODE_NAME NVARCHAR(240),");
        
        v_sql_createTable2.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createTable2.append("CRUD_TYPE_CODE NVARCHAR(1) )");
        
        StringBuffer v_sql_createTable3 = new StringBuffer();
        // local Temp table은 테이블명이 #(샵) 으로 시작해야 함
        v_sql_createTable3.append("CREATE local TEMPORARY column TABLE #LOCAL_TEMP_SD (");

        v_sql_createTable3.append("TENANT_ID NVARCHAR(5),");
        v_sql_createTable3.append("CATEGORY_GROUP_CODE NVARCHAR(30),");
        v_sql_createTable3.append("CATEGORY_CODE NVARCHAR(40),");
        v_sql_createTable3.append("ACTIVITY_CODE NVARCHAR(40),");
        v_sql_createTable3.append("S_GRADE_STANDARD_DAYS INTEGER,");

        v_sql_createTable3.append("A_GRADE_STANDARD_DAYS INTEGER,");
        v_sql_createTable3.append("B_GRADE_STANDARD_DAYS INTEGER,");
        v_sql_createTable3.append("C_GRADE_STANDARD_DAYS INTEGER,");
        v_sql_createTable3.append("D_GRADE_STANDARD_DAYS INTEGER,");        
        v_sql_createTable3.append("ACTIVE_FLAG BOOLEAN,");
        
        v_sql_createTable3.append("UPDATE_USER_ID NVARCHAR(255),");
        v_sql_createTable3.append("CRUD_TYPE_CODE NVARCHAR(1) )");


        String v_sql_insertTable = "INSERT INTO #LOCAL_TEMP_CATE_TYPE VALUES (?, ?, ?, ?, ?,  ?, ?, ?)";
        String v_sql_insertTable2 = "INSERT INTO #LOCAL_TEMP_LANG VALUES (?, ?, ?, ?, ?,  ?, ?)";
        String v_sql_insertTable3 = "INSERT INTO #LOCAL_TEMP_SD VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,   ?, ?)";
        String v_sql_callProc = "CALL DP_PD_PART_CATEGORY_SAVE_PROC(CRUD_TYPE => ?, I_M => #LOCAL_TEMP_CATE_TYPE, I_D => #LOCAL_TEMP_LANG, I_SD => #LOCAL_TEMP_SD, O_MSG => ?)";
        

        String v_sql_dropable = "DROP TABLE #LOCAL_TEMP_CATE_TYPE";
        String v_sql_dropable2 = "DROP TABLE #LOCAL_TEMP_LANG";
        String v_sql_dropable3 = "DROP TABLE #LOCAL_TEMP_SD";

        Collection<OutType> v_result = new ArrayList<>();

        ResultSet v_rs = null;

                    
        // Commit Option
        jdbc.execute(v_sql_commitOption);
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable.toString());
        
        // Local Temp Table에 insert
        List<Object[]> batch = new ArrayList<Object[]>();
        if(!v_pdMst.isEmpty() && v_pdMst.size() > 0){
            boolean active_flag = false;
            if(v_pdMst.get("active_flag")!=null && (v_pdMst.get("active_flag")).equals("true")){
                active_flag = true;
            }
            Object[] values = new Object[] {
                v_pdMst.get("tenant_id"),
                v_pdMst.get("category_group_code"),
                v_pdMst.get("category_code"),
                v_pdMst.get("parent_category_code"),
                Integer.parseInt(String.valueOf(v_pdMst.get("sequence"))),
                
                
                active_flag,
                v_pdMst.get("update_user_id"),
                v_pdMst.get("crud_type_code")
            };
            batch.add(values);
        }

        int[] updateCounts = jdbc.batchUpdate(v_sql_insertTable, batch);

        
        
        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable2.toString());
        
        // BaseExtrate Local Temp Table에 insert
        List<Object[]> batch_dtl2 = new ArrayList<Object[]>();
        if(!v_pdDtl.isEmpty() && v_pdDtl.size() > 0){
            for(PdPartCategoryLngType v_inRow : v_pdDtl){
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("category_group_code"),
                    v_inRow.get("category_code"),
                    v_inRow.get("langauge_cd"),
                    v_inRow.get("code_name"),
                    

                    v_inRow.get("update_user_id"),
                    v_inRow.get("crud_type_code")
                };

                batch_dtl2.add(values);
            }
        }
        int[] updateDtlCounts2 = jdbc.batchUpdate(v_sql_insertTable2, batch_dtl2);


        // Local Temp Table 생성
        jdbc.execute(v_sql_createTable3.toString());
        
        // BaseExtrate Local Temp Table에 insert
        List<Object[]> batch_dtl3 = new ArrayList<Object[]>();
        if(!v_pdSD.isEmpty() && v_pdSD.size() > 0){
            for(PdpartCategoryActivityType v_inRow : v_pdSD){
                boolean active_flag = false;
                if(v_inRow.get("active_flag")!=null && (v_inRow.get("active_flag")).equals("true")){
                    active_flag = true;
                }
                Object[] values = new Object[] {
                    v_inRow.get("tenant_id"),
                    v_inRow.get("category_group_code"),
                    v_inRow.get("category_code"),   
                    v_inRow.get("activity_code"),                 
                    Integer.parseInt(String.valueOf(v_inRow.get("s_grade_standard_days"))),

                    Integer.parseInt(String.valueOf(v_inRow.get("a_grade_standard_days"))),
                    Integer.parseInt(String.valueOf(v_inRow.get("b_grade_standard_days"))),
                    Integer.parseInt(String.valueOf(v_inRow.get("c_grade_standard_days"))),
                    Integer.parseInt(String.valueOf(v_inRow.get("d_grade_standard_days"))),
                    active_flag,

                    v_inRow.get("update_user_id"),
                    v_inRow.get("crud_type_code")
                };

                batch_dtl3.add(values);
            }
        }
        int[] updateDtlCounts3 = jdbc.batchUpdate(v_sql_insertTable3, batch_dtl3);

                
    
        OutType v_row = OutType.create();
        // Procedure Call
        SqlReturnResultSet oTable = new SqlReturnResultSet("O_MSG", new RowMapper<OutType>(){
            @Override
            public OutType mapRow(ResultSet v_rs, int rowNum) throws SQLException {
                v_row.setReturnCode(v_rs.getString("return_code"));
                v_row.setReturnMsg(v_rs.getString("return_msg"));
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
                callableStatement.setString("CRUD_TYPE", crudType);
                return callableStatement;
            }
        }, paramList);
        


        // 아래 주석 처리는 표준 try 처리 나오기 전까지 꼭 함께 가져가십시요.
        //프로시저에서 오류 발생시 드랍 테이블에서 오류가 발생하여 오류 발생 시점을 알수 없으므로 msg를 가져 갈수 있도록 try 처리함
        //실제 프로시저 오류는 아래 드랍 테이블을 주석 처리 하면 나옴  
        try{
            jdbc.execute(v_sql_dropable);
            jdbc.execute(v_sql_dropable2);
            jdbc.execute(v_sql_dropable3);
        }catch(Exception e){
            log.error("PartCategoryV4  PdPartCategorySaveProc Error : {}", v_row);
        }

        context.setResult(v_row);
        context.setCompleted();

    }

}