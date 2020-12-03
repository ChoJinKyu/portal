namespace cm.util;

using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
using { cm as currency } from '../../../../db/cds/cm/currencyMgr/CM_CURRENCY_LNG-model';
using { cm as msg } from '../../../../db/cds/cm/msgMgr/CM_MESSAGE-model';

@path : '/cm.util.CommonService'
service CommonService {

    entity CodeDetails as projection on codeDtl.Code_Dtl;

    entity Message as projection on msg.Message;

    view Currency as
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
            join currency.Currency_Lng as l 
                on c.tenant_id = l.tenant_id 
                and c.currency_code = l.currency_code
    ;
}
