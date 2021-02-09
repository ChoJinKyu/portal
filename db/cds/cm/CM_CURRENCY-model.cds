
using util from './util/util-model';
using from './CM_CURRENCY_LNG-model';

namespace cm;

entity Currency {
    key tenant_id            : String(5) not null;
    key currency_code        : String(30) not null;

        children             : Composition of many cm.Currency_Lng
                                   on  children.tenant_id     = tenant_id
                                   and children.currency_code = currency_code;
                                   
        effective_start_date : DateTime;
        effective_end_date   : DateTime;
        use_flag             : Boolean not null;
        scale                : Decimal;
        extension_scale      : Decimal;
}

extend Currency with util.Managed;
