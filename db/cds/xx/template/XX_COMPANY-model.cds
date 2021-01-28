using util from '../../cm/util/util-model';
using {cm.Currency_View as Currency } from '../../cm/CM_CURRENCY_VIEW-model';
using {cm.Country_View as Country } from '../../cm/CM_COUNTRY_VIEW-model';
using {cm.Code_View as Code } from '../../cm/CM_CODE_VIEW-model';
using from './XX_TENANT-model';
using from './XX_PLANT-model';
using from './XX_DEPARTMENT-model';

namespace xx;

entity Company {
    key tenant_id      : String(5) not null   @title : '테넌트ID';
    key company_code   : String(10) not null  @title : '회사코드';
        company_name   : String(240) not null @title : '회사명';
        use_flag       : Boolean not null     @title : '사용여부';
        currency_code  : String(30)           @title : '통화코드';
        country_code   : String(30)           @title : '국가코드';
        language_code  : String(30)           @title : '언어코드';

        tenant         : Association to xx.Tenant
                                on  tenant.tenant_id  = tenant_id;

        plants         : Composition of many xx.Plant
                                on  plants.tenant_id  = tenant_id
                                and plants.company_code = company_code;

        departments    : Composition of many xx.Department
                                on  departments.tenant_id  = tenant_id
                                and departments.company_code = company_code;
                                
        currency       : Association to Currency
                                on  currency.tenant_id  = tenant_id
                                and currency.currency_code = currency_code
                                and currency.language_code = 'KO';
                                
        country        : Association to Country
                                on  country.tenant_id  = tenant_id
                                and country.country_code = country_code
                                and country.language_code = 'KO';
                                
        language       : Association to Code
                                on  language.tenant_id  = tenant_id
                                and language.group_code = 'CM_LANG_CODE'
                                and language.language_cd = 'KO'
                                and language.code = language_code;

}

extend Company with util.Managed;
