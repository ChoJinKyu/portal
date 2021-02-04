package lg.sppCap.handlers.sp.np;

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

}