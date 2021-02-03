using util from '../../cm/util/util-model';
using from './XX_COMPANY-model';

namespace xx;

entity Tenant {
    key tenant_id       : String(5) not null;
    key tenant_name     : String(100) not null;
        sort_number     : Integer default 0      @title : '정렬순서';

    companies           : Composition of many xx.Company
                                on  companies.tenant_id  = tenant_id;
}

extend Tenant with util.Managed;