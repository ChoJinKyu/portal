namespace xx.util;

using { cm.Code_Dtl as codeDetail, cm.Code_Lng as codeLanguage } from '../../../../db/cds/cm/CM_CODE_LNG-model';
using { xx.Message as message } from '../../../../db/cds/xx/template/XX_MESSAGE-model';

@path : '/xx.util.CommonService'
service CommonService {

    @deprecation
    entity CodeDetails as projection on codeDetail;

    @readonly
    entity Message as projection on message;

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

}
