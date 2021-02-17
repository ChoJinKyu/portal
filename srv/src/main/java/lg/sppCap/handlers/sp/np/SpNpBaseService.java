package lg.sppCap.handlers.sp.np;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.sap.cds.CdsData;
import com.sap.cds.services.ErrorStatus;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.SqlReturnResultSet;

import lg.sppCap.frame.user.SppUserSession;

public class SpNpBaseService {

    protected final Logger log = LogManager.getLogger(this.getClass());

    @Autowired
    protected JdbcTemplate jdbc;

    @Autowired
    protected SppUserSession userSession;


    /**
     * object 를 받아서, LocalDate로 변환
     * 
     * @param obj   : 현재는 java.sql.Date만 받지만, 향후는 Object를 받아, Class Type에 따라, 분기하여, 변환 될수 있게 수정 되어야 함.
     * @return
     */
    //protected LocalDate toLocalDate(Object obj){
    protected LocalDate toLocalDate(java.sql.Date obj){
        if(obj == null){
            return null;
        }
        /*
        if(obj instanceof java.sql.Date){
            return ((java.sql.Date)obj).toLocalDate();
        }
        */
        return obj.toLocalDate();
    }

    protected boolean isNotEmpty(Object value) {
        return !isEmpty(value);
    }

    protected boolean isEmpty(Object value) {

        if (value == null || value.toString().isEmpty()) {
            return true;

        } else if (value instanceof Collection) {
            return ((Collection) value).isEmpty();

        } else if (value instanceof Map) {
            return ((Map) value).isEmpty();
        }

        return false;
    }

    protected String validation(ValidType type, Object value, String valueName) {
        if (ValidType.REQUIRED.equals(type)) {
            if (isEmpty(value)) {
                return String.format("%s is required", valueName);
            }
        }

        return null;
    }

    /**
     * Validation 유형 Enum
     */
    public enum ValidType {
        REQUIRED("required");

        private String name = null;

        ValidType(String name) {
            this.name = name;
        }
    }

    /**
     * DDL 수행시, 자동 Commit 기능 OFF
     */
    protected void setTransactionAutoCommitDdlOff() {
        jdbc.execute("SET TRANSACTION AUTOCOMMIT DDL OFF;");
    }

    /**
     * Local Temp Table 제거
     * 
     * @param tempTableName : Table Name
     */
    protected void dropTemporaryTable(String tempTableName) {
        if (tempTableName != null && !tempTableName.isEmpty()) {
            jdbc.execute(String.format("DROP TABLE %s", tempTableName));
        }
    }

    /**
     * 품의 참조자를 Local Temp 테이블에 등록 - Local Temporary 테이블을 생성하여 Insert - Procedure 호출
     * 후, Local Temp 테이블 삭제 해야 함.
     * 
     * @param tableLayout
     * @param cdsDatas
     * @return
     */
    protected <T extends CdsData> String createTemporaryTable(LocalTempTableLayout tableLayout,
            Collection<T> cdsDatas) {

        jdbc.execute(tableLayout.getTableCreateScript());

        String insertSql = tableLayout.getInsertScript();

        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if (cdsDatas != null && !cdsDatas.isEmpty()) {
            for (CdsData cdsData : cdsDatas) {
                batchDtl.add(tableLayout.convetJdbcInsertParameter(cdsData));
            }
        }

        jdbc.batchUpdate(insertSql, batchDtl);

        return tableLayout.getTableName();
    }

    /**
     * Local Temporary Table Layout - Table 명은 #(샵) 으로 시작해야 함 - Table 생성 Script 생성 -
     * Insert Script 생성 - Insert Parameter 생성
     */
    protected class LocalTempTableLayout {

        private String tableName = null; // Table 명은 #(샵) 으로 시작해야 함

        private List<ColumnInfo> columnList = new ArrayList<ColumnInfo>();

        public LocalTempTableLayout(String tableName) {
            this.tableName = tableName;
        }

        public LocalTempTableLayout append(String columnName, String columnType) {
            columnList.add(new ColumnInfo(columnName, columnType));
            return this;
        }

        public String getTableName() {
            return this.tableName;
        }

        /**
         * Table Create Script 반환
         */
        public String getTableCreateScript() {
            StringBuilder scriptBuilder = new StringBuilder();
            scriptBuilder.append("CREATE LOCAL TEMPORARY COLUMN TABLE ").append(this.tableName).append(" ( ");

            for (int i = 0; i < columnList.size(); i++) {
                if (i != 0)
                    scriptBuilder.append(",");
                ColumnInfo column = columnList.get(i);
                scriptBuilder.append(column.getColumnName()).append(" ").append(column.getColumnType());
            }
            scriptBuilder.append(")");

            return scriptBuilder.toString();
        }

        /**
         * Table Insert Script 반환
         */
        public String getInsertScript() {
            StringBuilder scriptBuilder = new StringBuilder();
            scriptBuilder.append("INSERT INTO ").append(this.tableName).append(" VALUES (");

            for (int i = 0; i < columnList.size(); i++) {
                if (i != 0)
                    scriptBuilder.append(",");
                scriptBuilder.append("?");
            }
            scriptBuilder.append(")");

            return scriptBuilder.toString();
        }

        /**
         * Insert Parameter 변환 - CDS Data에서 Table 컬럼명 기준으로 get 하여, 추가 (컬럼명을 소문자로 변환)
         */
        public Object[] convetJdbcInsertParameter(CdsData cdsData) {
            Object[] parameters = new Object[this.columnList.size()];

            for (int i = 0; i < this.columnList.size(); i++) {
                parameters[i] = cdsData.get(columnList.get(i).getColumnName().toLowerCase());
            }
            return parameters;
        }

        private class ColumnInfo {
            private String columnName = null;
            private String columnType = null;

            public ColumnInfo(String columnName, String columnType) {
                this.columnName = columnName;
                this.columnType = columnType;
            }

            public String getColumnName() {
                return this.columnName;
            }

            public String getColumnType() {
                return this.columnType;
            }
        }

    }

    protected final static short IN = 1;
    protected final static short OUT = 2;
    protected final static int TABLE_TYPE = 3001;

    /**
     * Procedure 실행
     * 
     * @param procedureLayout   : 실행 할 Procedure 정보
     * @param paramMap          : Procedure 호출에 사용할 Parameter
     * @return
     */
    protected Map<String, Object> executeProcedure(ProcedureLayout procedureLayout, Map<String, Object> paramMap) {

        Map<String, Object> resultMap = jdbc.call((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall(procedureLayout.getCallScript(paramMap));
            procedureLayout.setProcedureParameterValue(callableStatement, paramMap);
            return callableStatement;
        }, procedureLayout.getParamTypeList());

        log.info(">>>>>>>>>>>>>>> PROCEDURE ResultMap : {}", resultMap );

        return resultMap;
    }

    /**
     * Local Temporary Table Layout - Table 명은 #(샵) 으로 시작해야 함 - Table 생성 Script 생성 -
     * Insert Script 생성 - Insert Parameter 생성
     */
    protected class ProcedureLayout {

        private String name = null;

        private List<ParameterInfo> parameterList = new ArrayList<ParameterInfo>();

        public ProcedureLayout(String name) {
            this.name = name;
        }

        public ProcedureLayout append(short inOut, String parameterName, int dataType, String valueMappingKey) {
            parameterList.add(new ParameterInfo(inOut, parameterName, dataType, valueMappingKey));
            return this;
        }

        public ProcedureLayout append(short inOut, String parameterName, int dataType, String valueMappingKey, RowMapper<?> sqlReturnResultSet) {
            parameterList.add(new ParameterInfo(inOut, parameterName, dataType, valueMappingKey, sqlReturnResultSet));
            return this;
        }

        public String getProcedureName() {
            return this.name;
        }

        /**
         * Procedure Call Script 반환
         * @param paramMap
         * @return
         */
        public String getCallScript(Map<String, Object> paramMap) {
            StringBuilder scriptBuilder = new StringBuilder();
            scriptBuilder.append("CALL ").append(this.name).append("( ");

            for (int i = 0; i < parameterList.size(); i++) {
                if (i != 0)
                    scriptBuilder.append(",");

                ParameterInfo parameterInfo = parameterList.get(i);

                if (parameterInfo.getInOut() == IN &&  parameterInfo.getDataType() == TABLE_TYPE) {
                    scriptBuilder.append(parameterInfo.getParameterName()).append(" => ").append(paramMap.get(parameterInfo.getValueMappingKey()));
                } else {
                    scriptBuilder.append(parameterInfo.getParameterName()).append(" => ?");
                }
            }
            scriptBuilder.append(")");

            return scriptBuilder.toString();
        }

        /**
         * Procedure Parameter의 Data 유형 내역을 반환
         * - Procedure 호출시 사용
         * 
         * @return
         */
        public List<SqlParameter> getParamTypeList() {
            List<SqlParameter> paramList = new ArrayList<SqlParameter>();
            for (int i = 0; i < parameterList.size(); i++) {
                ParameterInfo parameterInfo = parameterList.get(i);

                // In Parameter가 일반 유형인 경우. (Table 유형은 Call 스크립트 생시, 이미 Table Name 셋팅 됨.)
                if (parameterInfo.getInOut() == IN && parameterInfo.getDataType() != TABLE_TYPE) {
                    paramList.add(new SqlParameter(parameterInfo.getParameterName(), parameterInfo.getDataType()));
                    log.info(" {} - SqlParameter : {} ", i, parameterInfo.getParameterName());

                // Out Parameter가 일반 유형인 경우.
                } else if (parameterInfo.getInOut() == OUT && parameterInfo.getDataType() != TABLE_TYPE) {
                    paramList.add(new SqlOutParameter(parameterInfo.getValueMappingKey(), parameterInfo.getDataType()));
                    log.info(" {} - SqlOutParameter : {} ", i, parameterInfo.getValueMappingKey());

                // Out Parameter가 Table인 경우.
                } else if (parameterInfo.getInOut() == OUT && parameterInfo.getDataType() == TABLE_TYPE) {
                    paramList.add(new SqlReturnResultSet(parameterInfo.getValueMappingKey(), parameterInfo.getRowMapper()));
                    log.info(" {} - SqlReturnResultSet : {} ", i, parameterInfo.getValueMappingKey());
                }
            }
            return paramList;
        }

        /**
         * 
         * @param callableStatement
         * @param paramMap
         * @throws SQLException
         */
        public void setProcedureParameterValue(CallableStatement callableStatement, Map<String, Object> paramMap) throws SQLException {
            for(int i=0; i < parameterList.size(); i++){
                ParameterInfo parameterInfo = parameterList.get(i);

                if( parameterInfo.getInOut() == IN && parameterInfo.getDataType() != TABLE_TYPE ){

                    String parameterName = parameterInfo.getParameterName();
                    Object value = paramMap.get( parameterInfo.getValueMappingKey() );

                    if( value == null ){
                        callableStatement.setNull(parameterName, parameterInfo.getDataType());

                    }else if(value instanceof Boolean){
                        callableStatement.setBoolean(parameterName, (Boolean)value );

                    }else if(value instanceof BigDecimal){
                        callableStatement.setBigDecimal(parameterName, (BigDecimal)value );

                    }else if(value instanceof Integer){
                        callableStatement.setInt(parameterName, (Integer)value );

                    }else if(value instanceof Double){
                        callableStatement.setDouble(parameterName, (Double)value );

                    }else if(value instanceof Long){
                        callableStatement.setLong(parameterName, (Long)value );

                    }else if(value instanceof Float){
                        callableStatement.setFloat(parameterName, (Float)value );

                    }else if(value instanceof Short){
                        callableStatement.setShort(parameterName, (Short)value );

                    }else if(value instanceof java.sql.Date){
                        callableStatement.setDate(parameterName, (java.sql.Date)value );

                    }else if(value instanceof java.sql.Timestamp){
                        callableStatement.setTimestamp(parameterName, (java.sql.Timestamp)value );

                    }else{
                        callableStatement.setString(parameterName, value.toString() );
                    }
                }
            }
        }

        /**
         * Procedure Parameter 정보
         */
        private class ParameterInfo{
            private short inOut;
            private String parameterName;
            private int dataType;
            private String valueMappingKey;
            private RowMapper<?> rowMapper;

            public ParameterInfo(short inOut, String parameterName, int dataType, String valueMappingKey){
                this.inOut   = inOut;
                this.parameterName   = parameterName;
                this.dataType   = dataType;
                this.valueMappingKey = valueMappingKey;
            }

            public ParameterInfo(short inOut, String parameterName, int dataType, String valueMappingKey, RowMapper<?> rowMapper){
                this.inOut   = inOut;
                this.parameterName   = parameterName;
                this.dataType   = dataType;
                this.valueMappingKey = valueMappingKey;
                this.rowMapper = rowMapper;
            }

            public short getInOut(){
                return this.inOut;
            }

            public String getParameterName(){
                return this.parameterName;
            }

            public int getDataType(){
                return this.dataType;
            }

            public String getValueMappingKey(){
                return this.valueMappingKey;
            }

            public RowMapper<?> getRowMapper(){
                return this.rowMapper;
            }
        }

    }




    protected enum ErrorCode implements ErrorStatus {

        USER_MESSAGE_SERVER_ERROR(599, "Internal server error", 599);

        private final int code;
        private final String description;
        private final int httpStatus;

        private ErrorCode(int code, String description, int httpStatus) {
            this.code = code;
            this.description = description;
            this.httpStatus = httpStatus;
        }

        @Override
        public int getCode() {
            return code;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public int getHttpStatus() {
            return httpStatus;
        }

        /**
         * @param code the code
         * @return the ErrorStatus from this enum, associated with the given code or {@code null}
         */
        public static ErrorCode getByCode(int code) {
            for(ErrorCode errorStatus : ErrorCode.values()) {
                if(errorStatus.getHttpStatus() == code) {
                    return errorStatus;
                }
            }
            return null;
        }
    }

}