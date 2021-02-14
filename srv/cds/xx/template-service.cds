
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

namespace xx;

service TemplateService {

    entity Message as projection on xx.Message;

    entity ControlOptionMasters as projection on controlOption.Control_Option_Mst;
    entity ControlOptionDetails as projection on controlOption.Control_Option_Dtl;

    entity Tenant as projection on xx.Tenant;

    entity Company @(restrict: [
        { grant: ['READ', 'WRITE'], where: 'tenant_id = $user.TENANT_ID'}
    ]) as select from xx.Company {
            *,
            tenant.tenant_name,
            currency.currency_code_name as currency_name,
            country.country_name,
            language.code_name as language_name
        };

    entity Plant @(restrict: [
        { grant: ['READ', 'WRITE'], where: 'tenant_id = $user.TENANT_ID'}
    ]) as select from xx.Plant {
            *,
            parent.company_name
        };

    entity Department @(restrict: [
        { grant: ['READ', 'WRITE'], where: 'tenant_id = $user.TENANT_ID'}
    ]) as select from xx.Department {
            *,
            company.company_name,
            parent.department_name as parent_department_name,
            parent.department_korean_name as parent_department_korean_name,
            parent.department_english_name as parent_department_english_name
        };

    entity Employee @(restrict: [
        { grant: ['READ', 'WRITE'], where: 'tenant_id = $user.TENANT_ID'}
    ]) as select from xx.Employee {
            *,
            department.department_name as department_name,
            department.department_korean_name as department_korean_name,
            department.department_english_name as department_english_name
        };

    entity Currency_View as projection on Currency; //OData navigation property
    entity Country_View as projection on Country;   //OData navigation property
    entity Code_View as projection on Code;         //OData navigation property

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
