
using from '../../../db/cds/xx/template/XX_V4_MESSAGE-model';

using from '../../cds/xx/template-service';

namespace xx;

service TemplateV4Service {

    entity Message as projection on xx.V4Message;

    entity Tenant as projection on xx.TemplateService.Tenant;
    entity Company as projection on xx.TemplateService.Company;
    entity Plant as projection on xx.TemplateService.Plant;
    entity Department as projection on xx.TemplateService.Department;
    entity Employee as projection on xx.TemplateService.Employee;

    entity Currency_View as projection on xx.TemplateService.Currency_View; //OData navigation property
    entity Country_View as projection on xx.TemplateService.Country_View;   //OData navigation property
    entity Code_View as projection on xx.TemplateService.Code_View;         //OData navigation property

    action SetDepartmentAndEmployees(
        department: Department, 
        employees: array of Employee
    ) returns String;


}

annotate TemplateV4Service.Message with @(
  UI: {
    SelectionFields: [ tenant_id, message_code, language_code, chain_code, message_type_code, message_contents ],
    LineItem: [
      { Value: message_code, Label:'Message Code'},
      { Value: language_code, Label: 'Language Code'},
      { Value: chain_code, Label:'Chain' },
      { Value: message_type_code, Label:'Message Type Code' },
      { Value: message_contents, Label:'Content'},
    ]
  }
);
