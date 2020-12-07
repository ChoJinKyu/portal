
using { cm.Code_Dtl as codeDetail, cm.Code_Lng as codeLanguage } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
using { cm.Message as message } from '../../../../db/cds/cm/msgMgr/CM_MESSAGE-model';
using { cm as codeView } from '../../../../db/cds/cm/util/CM_CODE_VIEW-model';
using { cm.Currency as currency, cm.Currency_Lng as currencyLanguage } from '../../../../db/cds/cm/currencyMgr/CM_CURRENCY_LNG-model';

namespace cm.util;

@path : '/cm.util.CommonService'
service CommonService {

    @deprecation
    entity CodeDetails as projection on codeDetail;

    @readonly
    entity Message as projection on message;
    
    view CodeView as select from codeView.Code_View;

    @readonly
    view Code as
        select
            key a.tenant_id,
            key a.group_code,
            key a.code,
            a.code_description,
            a.sort_no,
            (select b.code_name from codeLanguage b where a.tenant_id  = b.tenant_id 
                and a.group_code = b.group_code
                and a.code = b.code
                and b.language_cd = 'KO') as code_name: String(240)
        from
            codeDetail a
        where
            $now between a.start_date and a.end_date
    ;

    @readonly
    view Currency as
        select 
            key c.tenant_id,
            key c.currency_code,
            l.currency_code_name
        from currency as c 
            left join currencyLanguage as l 
                on c.tenant_id = l.tenant_id 
                and c.currency_code = l.currency_code
                and l.language_code = 'KO'
        where
            $now between c.effective_start_date and c.effective_end_date
            and c.use_flag = true
    ;

}
