package lg.sppCap.handlers.sp.np;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.sap.cds.CdsData;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import lg.sppCap.frame.user.SppUserSession;
public class SpNpBaseService {

    protected final Logger log = LogManager.getLogger( this.getClass() );

    @Autowired
    protected JdbcTemplate jdbc;


    @Autowired
    protected SppUserSession userSession;


    protected boolean isNotEmpty( Object value ){
        return !isEmpty( value );
    }

    protected boolean isEmpty( Object value ){

        if( value == null || value.toString().isEmpty() ){
            return true;

        }else if( value instanceof Collection ){
            return ((Collection)value).isEmpty();

        }else if( value instanceof Map ){
            return ((Map)value).isEmpty();
        }

        return false;
    }

    protected String validation( ValidType type, Object value, String valueName ){
        if( ValidType.REQUIRED.equals( type ) ){
            if( isEmpty(value) ){
                return String.format( "%s is required", valueName);
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

        ValidType(String name){
            this.name = name;
        }
    }


    
    /**
     * DDL 수행시, 자동 Commit 기능 OFF
     */
    protected void setTransactionAutoCommitDdlOff(){
        jdbc.execute("SET TRANSACTION AUTOCOMMIT DDL OFF;");
    }

    /**
     * Local Temp Table 제거
     * 
     * @param tempTableName : Table Name
     */
    protected void dropTemporaryTable(String tempTableName){
        if(tempTableName != null && !tempTableName.isEmpty()){
            jdbc.execute( String.format("DROP TABLE %s", tempTableName) );
        }
    }


    /**
     * 품의 참조자를 Local Temp 테이블에 등록
     * - Local Temporary 테이블을 생성하여 Insert
     * - Procedure 호출 후, Local Temp 테이블 삭제 해야 함.
     * 
     * @param tableLayout
     * @param cdsDatas
     * @return
     */
    protected <T extends CdsData> String createTemporaryTable( LocalTempTableLayout tableLayout, Collection<T> cdsDatas ){
        
        jdbc.execute( tableLayout.getTableCreateScript() );

        String insertSql = tableLayout.getInsertScript();

        List<Object[]> batchDtl = new ArrayList<Object[]>();
        if(cdsDatas != null && !cdsDatas.isEmpty() ){
            for(CdsData cdsData : cdsDatas){
                batchDtl.add( tableLayout.convetJdbcInsertParameter( cdsData ) );
            }
        }

        jdbc.batchUpdate(insertSql, batchDtl);  

        return tableLayout.getTableName();
    }


    protected class ColumnInfo{
        private String columnName = null;
        private String columnType = null;

        public ColumnInfo(String columnName, String columnType){
            this.columnName   = columnName;
            this.columnType   = columnType;
        }

        public String getColumnName(){
            return this.columnName;
        }

        public String getColumnType(){
            return this.columnType;
        }
    }


    /**
     * Local Temporary Table Layout
     * - Table 명은 #(샵) 으로 시작해야 함
     * - Table 생성 Script 생성
     * - Insert Script 생성
     * - Insert Parameter 생성
     */
    protected class LocalTempTableLayout {

        private String tableName = null;    // Table 명은 #(샵) 으로 시작해야 함

        private List<ColumnInfo> columnList = new ArrayList<ColumnInfo>();

        public LocalTempTableLayout(String tableName){
            this.tableName = tableName;
        }

        public LocalTempTableLayout append(String columnName, String columnType){
            columnList.add( new ColumnInfo(columnName, columnType) );
            return this;
        }

        public String getTableName(){
            return this.tableName;
        }

        /**
         * Table Create Script 반환
         */
        public String getTableCreateScript(){
            StringBuilder scriptBuilder = new StringBuilder();
            scriptBuilder.append("CREATE LOCAL TEMPORARY COLUMN TABLE ").append( this.tableName ).append(" ( ");

            for(int i=0; i < columnList.size(); i++){
                if(i != 0) scriptBuilder.append(",");
                ColumnInfo column = columnList.get(i);
                scriptBuilder.append(column.getColumnName()).append(" ").append(column.getColumnType());
            }
            scriptBuilder.append(")");

            return scriptBuilder.toString();
        }

        /**
         * Table Insert Script 반환
         */
        public String getInsertScript(){
            StringBuilder scriptBuilder = new StringBuilder();
            scriptBuilder.append("INSERT INTO ").append( this.tableName ).append(" VALUES (");

            for(int i=0; i < columnList.size(); i++){
                if(i != 0) scriptBuilder.append(",");
                scriptBuilder.append("?");
            }
            scriptBuilder.append(")");

            return scriptBuilder.toString();
        }

        /**
         * Insert Parameter 변환
         * - CDS Data에서 Table 컬럼명 기준으로 get 하여, 추가 (컬럼명을 소문자로 변환)
         */
        public Object[] convetJdbcInsertParameter(CdsData cdsData){
            Object[] parameters = new Object[this.columnList.size()];

            for( int i=0; i < this.columnList.size(); i++ ){
                parameters[i] = cdsData.get( columnList.get(i).getColumnName().toLowerCase() );
            }
            return parameters;
        }


        
    }

}