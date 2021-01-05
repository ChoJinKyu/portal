namespace dp.util;
using {cm as emp} from '../../../../../db/cds/cm/CM_HR_EMPLOYEE-model';

@path: '/dp.util.ModelDeveloperSelectionService'
service ModelDeveloperSelectionService {
    
    view ModelDeveloper as 
    SELECT 
        key emp.tenant_id,
            emp.department_id,
            emp.user_local_name ||'['|| substr_before(emp.email_id, '@')||'] ' AS user_name : String(480), 
        key emp.employee_number,
            emp.user_local_name ,
            emp.user_english_name , 
            substr_before(emp.email_id, '@') AS user_id : String(240)
    FROM emp.Hr_Employee emp
    ;
}