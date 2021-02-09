
using util from './util/util-model';

namespace cm;

entity Country_Lng {
    key tenant_id     : String(5) not null;
    key country_code  : String(30) not null;
    key language_code : String(30) not null;
    
        parent        : Association to cm.Country
                                 on  parent.tenant_id     = tenant_id
                                 and parent.country_code = country_code;

        country_name  : String(30) not null;
        description   : String(300);
}

extend Country_Lng with util.Managed;
