
using {xx.V4Message as message} from '../../../db/cds/xx/template/XX_V4_MESSAGE-model';
using from '../../../db/cds/xx/template/XX_TENANT-model';
using from '../../../db/cds/xx/template/XX_DEPARTMENT-model';
using from '../../../db/cds/xx/template/XX_EMPLOYEE-model';

using {cm.Currency_View as Currency } from '../../../db/cds/cm/CM_CURRENCY_VIEW-model';
using {cm.Country_View as Country } from '../../../db/cds/cm/CM_COUNTRY_VIEW-model';
using {cm.Code_View as Code } from '../../../db/cds/cm/CM_CODE_VIEW-model';

namespace xx;

service TemplateV4Service {

    entity Message as projection on message;

    entity Department as projection on xx.Department;
    entity Employee as projection on xx.Employee;

    entity Tenant as projection on xx.Tenant;

    entity Currency_View as projection on Currency; //OData navigation property
    entity Country_View as projection on Country;   //OData navigation property
    entity Code_View as projection on Code;         //OData navigation property

    action SetDepartmentAndEmployees(
        department: Department, 
        employees: array of Employee
    ) returns String;

}
