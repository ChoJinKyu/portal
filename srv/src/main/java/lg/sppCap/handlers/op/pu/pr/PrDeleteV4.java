// package lg.sppCap.handlers.op.pu.pr;

// import java.sql.CallableStatement;
// import java.sql.Connection;
// import java.sql.PreparedStatement;
// import java.sql.ResultSet;
// import java.sql.SQLException;
// import java.sql.Types;
// import javax.sql.DataSource;
// import java.util.ArrayList;
// import java.util.Collection;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Map.Entry;
// import java.util.stream.Stream;
// import java.util.Iterator;

// import org.apache.commons.lang3.StringUtils;
// import org.apache.logging.log4j.LogManager;
// import org.apache.logging.log4j.Logger;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Qualifier;
// import org.springframework.transaction.annotation.Transactional;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.core.RowMapper;
// import org.springframework.stereotype.Component;

// import com.sap.cds.reflect.CdsModel;
// import com.sap.cds.services.EventContext;
// import com.sap.cds.services.cds.CdsCreateEventContext;
// import com.sap.cds.services.cds.CdsReadEventContext;
// import com.sap.cds.services.cds.CdsService;
// import com.sap.cds.services.handler.EventHandler;
// import com.sap.cds.services.handler.annotations.On;
// import com.sap.cds.services.handler.annotations.Before;
// import com.sap.cds.services.handler.annotations.After;
// import com.sap.cds.services.handler.annotations.ServiceName;
// import com.sap.cds.services.request.ParameterInfo;
// import org.springframework.jdbc.core.simple.SimpleJdbcCall;
// import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
// import org.springframework.jdbc.core.namedparam.SqlParameterSource;
// import org.springframework.jdbc.core.SqlParameter;
// import org.springframework.jdbc.core.SqlReturnResultSet;
// import org.springframework.jdbc.core.CallableStatementCreator;
// import org.springframework.jdbc.datasource.DataSourceUtils;

// import com.sap.cds.Result;
// import com.sap.cds.ql.cqn.CqnInsert;
// import com.sap.cds.ql.Insert;

// import lg.sppCap.util.StringUtil;
// import cds.gen.op.prdeletev4service.*;

// @Component
// @ServiceName(PrDeleteV4Service_.CDS_NAME)
// public class PrCDeleteV4 implements EventHandler {

//     private static final Logger log = LogManager.getLogger();

//     @Autowired
//     private JdbcTemplate jdbc;

//     @Transactional(rollbackFor = SQLException.class)
//     @On(event = DeletePrProcContext.CDS_NAME)
//     public void onDeletePrProc(DeletePrProcContext context) {

//         log.info("##### onDeletePrProc START ");

//         Collection<PrCreateSaveType> v_inMultiData = context.getInputData();
//         Collection<OutType> v_result = new ArrayList<>();
//         int iRow = 0;
        
//         String v_sql_commitOption = "SET TRANSACTION AUTOCOMMIT DDL OFF;";
        
//         StringBuffer v_sql_callProc = new StringBuffer();
//         v_sql_callProc.append("CALL OP_PU_PR_DELETE_PROC ( ")
//         .append("I_TENANT_ID => ?, ")
//         .append("I_COMPANY_CODE => ?, ")
//         .append("I_PR_NUMBER => ?, ")
//         .append("I_PR_CREATE_STATUS_CODE => ?, ")        
//         .append("O_RTN_MSG => ? ")
//         .append(")"); 

//         ResultSet v_rs = null;
        
//         // try {
            
//             // Commit Option
//             jdbc.execute(v_sql_commitOption);

//             Object[] values = null;

          

//             Map<String, Object> resultMap = jdbc.call(new CallableStatementCreator() {
//                     @Override
//                     public CallableStatement createCallableStatement(Connection connection) throws SQLException {
//                         CallableStatement callableStatement = connection.prepareCall(v_sql_callProc.toString());
//                         callableStatement.setString("I_TENANT_ID", v_indata.getTenantId());
//                         callableStatement.setString("I_COMPANY_CODE", v_indata.getCompanyCode());
//                         callableStatement.setString("I_PR_NUMBER", v_indata.getPrNumber());
//                         callableStatement.setString("I_PR_CREATE_STATUS_CODE", v_indata.getPrCreateStatusCode());
//                         return callableStatement;
//                     }
//                 }, paramList);
//             }

           

//             context.setResult(v_result);
//             context.setCompleted();

//             log.info("##### onSavePrCreateProc END");

// 		// } catch (SQLException sqle) { 
//         //     sqle.printStackTrace();
// 		// 	log.error("##### ErrCode : "+sqle.getErrorCode());
// 		//     log.error("##### ErrMesg : "+sqle.getMessage());
                        
//         //     OutType v_out = OutType.create();
//         //     v_out.setReturnCode(sqle.getErrorCode()+"");
//         //     v_out.setReturnMsg(sqle.getMessage());                
//         //     v_result.add(v_out);
//         //     context.setResult(v_result);
//         //     context.setCompleted();
//         // } catch(Exception ex) {
//         //     ex.printStackTrace();
//         // }
//     }

// }