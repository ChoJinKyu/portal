import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;
import java.math.BigDecimal;
import java.util.Calendar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.stereotype.Component;

import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsCreateEventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.request.ParameterInfo;
import org.springframework.beans.factory.annotation.Qualifier;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Delete;
import com.sap.cds.Result;

import cds.gen.dp.assetlistservice.*;
import cds.gen.dp.assetlistv4service.*;

@Component
@ServiceName(AssetListV4Service_.CDS_NAME)
public class AssetListV4 implements EventHandler {

    @Autowired
    private JdbcTemplate jdbc;
    
    @Autowired
    @Qualifier(AssetListService_.CDS_NAME)
    private CdsService assetListService;

    private String MOLD_ID;

    @On(event = UpdateListVendorContext.CDS_NAME)
    public void onUpdate(UpdateListVendorContext context){
        Data data = context.getInputData();

        Collection<AssetMasterV4> aMasterList = data.getAssetData();
        if(!aMasterList.isEmpty() && aMasterList.size() > 0){
            for(AssetMasterV4 row : aMasterList ){
                System.out.println("aMasterList >>>>>>>>>>>>>>>>>>>" + aMasterList);
            }
        }
        
    }
}