package lg.sppCap.handlers.sp.np;

import java.util.Collection;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
public class SpNpBaseService {

    protected final Logger log = LogManager.getLogger( this.getClass() );

    @Autowired
    protected JdbcTemplate jdbc;


    //@Autowired
    //protected SppUserSession userSession;


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
    protected void dropTempTable(String tempTableName){
        if(tempTableName != null && !tempTableName.isEmpty()){
            jdbc.execute( String.format("DROP TABLE %s", tempTableName) );
        }
    }




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


    public enum ValidType {
        REQUIRED("required");

        private String name = null;

        ValidType(String name){
            this.name = name;
        }
    }

}