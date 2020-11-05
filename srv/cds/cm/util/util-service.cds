namespace cm;

using { cm as codeMst } from '../../../../db/cds/cm/codeMgr/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';

@path : '/cm.ServiceUtils'
service ServiceUtils {

    entity CodeList as projection on codeDtl.Code_Dtl;

    view Codes as select 
        tenant_id,  
        company_code,
        group_code,
        code,
        language_cd,
        code_name
    from codeLng.Code_Lng;

}
