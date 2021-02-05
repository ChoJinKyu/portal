
using {xx.V4Message as message} from '../../../db/cds/xx/template/XX_V4_MESSAGE-model';
using from '../../../db/cds/xx/template/XX_DEPARTMENT-model';
using from '../../../db/cds/xx/template/XX_EMPLOYEE-model';

namespace xx;

service TemplateV4Service {

    entity Message as projection on message;

    entity Department as projection on xx.Department;
    entity Employee as projection on xx.Employee;

    action SetDepartmentAndEmployees(
        department: Department, 
        employees: array of Employee
    ) returns String;

}
