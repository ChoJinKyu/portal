package lg.sppCap.handlers.xx.util;

import java.util.Optional;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnPredicate;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cds.gen.xx.util.commonservice.Code_;
import lg.sppCap.frame.handler.BaseEventHandler;

@Component
@ServiceName("xx.util.CommonService")
public class CommonService extends BaseEventHandler {

    @Autowired
    private PersistenceService db;
    
    @On(event = CdsService.EVENT_READ, entity="xx.util.CommonService.Code1")
    public void onReadCode(CdsReadEventContext context) {
        String tenantId = this.getTenantId();
        String languageCode = this.getLanguageCode(context);
        // String filter = context.getParameterInfo().getQueryParameter("$filter");
        Optional<CqnPredicate> where = context.getCqn().where();
        // CqnPredicate predicate = where.orElseThrow();
        CqnSelect codes = Select.from(Code_.class)
            // .columns("group_code", "code", "code_name", "sort_no")
            // .where(b ->
            //     b.tenant_id().eq(tenantId)
            //     .and(b.group_code().eq("CM_CHAIN_CD"))
            // )
            .columns(
                c -> c.tenant_id(), 
                c -> c.group_code(), 
                c -> c.code(),
                // c -> c.children().filter(p -> p.language_().eq(languageCode)).code_name(),
                c -> c.sort_no())
            .where(
                where.get()
            );
        Result result = db.run(codes);
        context.setResult(result.list());
    }

}