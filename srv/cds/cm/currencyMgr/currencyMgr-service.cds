using { cm as currency } from '../../../../db/cds/cm/currencyMgr/CM_CURRENCY-model';
using { cm as currencyLng } from '../../../../db/cds/cm/currencyMgr/CM_CURRENCY_LNG-model';

namespace cm;
@path : '/cm.CurrencyMgrService'
service CurrencyMgrService {

    entity Currency as projection on currency.Currency;
    entity CurrencyLng as projection on currencyLng.Currency_Lng;

    // 간단한 Currency와 Currency Lang View 생성
    view CurrencyView as
    select 
        key c.tenant_id,
        key c.currency_code,
        c.effective_start_date,
        c.effective_end_date,
        c.use_flag,
        c.scale,
        c.extension_scale,
        l.language_code,
        l.currency_code_name,
        l.currency_code_desc,
        l.currency_prefix,
        l.currency_suffix
    from currency.Currency as c 
    join currencyLng.Currency_Lng as l 
    on c.tenant_id = l.tenant_id and c.currency_code = l.currency_code
    ;
}
