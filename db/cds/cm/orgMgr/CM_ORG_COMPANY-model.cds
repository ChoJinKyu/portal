namespace cm;
using { User } from '@sap/cds/common';
using util from '../../util/util-model';


entity Org_Company {
  key tenant_id     : String(5)     not null @title: '테넌트ID';
  key company_code  : String(10)    not null @title: '회사코드';
    company_name    : String(240)   not null @title: '회사명';
    use_flag        : Boolean       not null @title: '사용여부';
    erp_type_code   : String(30)             @title: 'ERP유형코드';
    currency_code   : String(30)             @title: '통화코드';
    country_code    : String(30)             @title: '국가코드';
    language_code   : String(30)             @title: '언어코드';
    affiliate_code  : String(10)             @title: '관계사코드';
}

extend Org_Company with util.Managed;