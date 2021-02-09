
using util from './util/util-model';
using from './CM_COUNTRY_LNG-model';

namespace cm;

entity Country {
    key tenant_id          : String(5) not null;
    key country_code       : String(30) not null;
        iso_code           : String(30);
        eu_code            : String(30);
        language_code      : String(300) not null;
        date_format_code   : String(30);
        number_format_code : String(30);
        currency_code      : String(30);

        children           : Composition of many cm.Country_Lng
                                 on  children.tenant_id    = tenant_id
                                 and children.country_code = country_code;
}

extend Country with util.Managed;
