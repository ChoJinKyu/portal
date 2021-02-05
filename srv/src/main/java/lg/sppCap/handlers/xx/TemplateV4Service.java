package lg.sppCap.handlers.xx;

import java.sql.SQLException;
import java.util.Collection;

import com.sap.cds.Result;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.On;
import com.sap.cds.services.handler.annotations.ServiceName;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import cds.gen.xx.templatev4service.Department;
import cds.gen.xx.templatev4service.Department_;
import cds.gen.xx.templatev4service.Employee;
import cds.gen.xx.templatev4service.Employee_;
import cds.gen.xx.templatev4service.SetDepartmentAndEmployeesContext;
import cds.gen.xx.templatev4service.TemplateV4Service_;
import lg.sppCap.frame.handler.BaseEventHandler;

@Component
@ServiceName(TemplateV4Service_.CDS_NAME)
public class TemplateV4Service extends BaseEventHandler {

    private final static Logger log = LoggerFactory.getLogger(TemplateV4Service.class);
    
    @Autowired
    @Qualifier(TemplateV4Service_.CDS_NAME)
    private CdsService templateV4CdsService;
    
    @Transactional(rollbackFor = SQLException.class)
    @Before(event = SetDepartmentAndEmployeesContext.CDS_NAME)
    public void beforeSaveSampleMultiEnitylProc(SetDepartmentAndEmployeesContext context) {
        if(log.isTraceEnabled())
            log.trace("Inside of before handler  : {}", context.toString());

        Department oDepartment = context.getDepartment();
        Collection<Employee> aEmployees = context.getEmployees();
        
    }

    @Transactional(rollbackFor = SQLException.class)
    @On(event = SetDepartmentAndEmployeesContext.CDS_NAME)
    public void onSaveSampleMultiEnitylProc(SetDepartmentAndEmployeesContext context) {
        if(log.isTraceEnabled())
            log.trace("Inside of on handler  : {}", context.toString());

        Department oDepartment = context.getDepartment();
        Collection<Employee> aEmployees = context.getEmployees();
        CqnUpdate cqnUpdate;
        Result oResult;
        
        for(Employee oEmployee: aEmployees){
            cqnUpdate = Update.entity(Employee_.CDS_NAME).data(oEmployee);
            oResult = templateV4CdsService.run(cqnUpdate);
            if(log.isDebugEnabled())
                log.debug("updated an employee  : {}", oResult.toJson());
        }
        cqnUpdate = Update.entity(Department_.CDS_NAME).data(oDepartment);
        oResult = templateV4CdsService.run(cqnUpdate);
        if(log.isDebugEnabled())
            log.debug("updated a department : {}", oResult.toJson());

        context.setResult("OK");
        context.setCompleted();
    }
    
}