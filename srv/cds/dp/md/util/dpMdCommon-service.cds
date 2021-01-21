namespace dp.util;
using { cm as codeMst } from '../../../../../db/cds/cm/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../../db/cds/cm/CM_CODE_LNG-model';

@path: '/dp.util.DpMdCommonService'
service DpMdCommonService {
   
    @readonly
    view CodeDetails as
        select
            key a.tenant_id,
            key a.group_code,
            key a.code,
            a.code_description, 
            a.parent_code,
            a.parent_group_code,
            a.sort_no,
            (select b.code_name from codeLng.Code_Lng b where a.tenant_id  = b.tenant_id 
                and a.group_code = b.group_code
                and a.code = b.code
                and b.language_cd = 'KO') as code_name: String(240)
        from
            codeDtl.Code_Dtl a
        where
            $now between a.start_date and a.end_date
    ;


}