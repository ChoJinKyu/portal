namespace xx;

using from '../../../db/cds/xx/template/XX_MESSAGE-model';
using {xx as controlOption} from '../../../db/cds/xx/template/XX_CONTROL_OPTION_DTL-model';
using from '../../../db/cds/xx/template/XX_TENANT-model';
using from '../../../db/cds/xx/template/XX_COMPANY-model';
using from '../../../db/cds/xx/template/XX_PLANT-model';
using from '../../../db/cds/xx/template/XX_DEPARTMENT-model';
using from '../../../db/cds/xx/template/XX_EMPLOYEE-model';

using {cm.Currency_View as Currency } from '../../../db/cds/cm/CM_CURRENCY_VIEW-model';
using {cm.Country_View as Country } from '../../../db/cds/cm/CM_COUNTRY_VIEW-model';
using {cm.Code_View as Code } from '../../../db/cds/cm/CM_CODE_VIEW-model';

service TemplateService {

    entity Message as projection on xx.Message;

    entity ControlOptionMasters as projection on controlOption.Control_Option_Mst;
    entity ControlOptionDetails as projection on controlOption.Control_Option_Dtl;

    entity Tenant as projection on xx.Tenant;
    entity Company as projection on xx.Company;
    entity Plant as projection on xx.Plant;
    entity Department as projection on xx.Department;
    entity Employee as projection on xx.Employee;

    entity Currency_View as projection on Currency;
    entity Country_View as projection on Country;
    entity Code_View as projection on Code;

}

annotate TemplateService.Message with @(
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
