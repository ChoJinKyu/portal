using { cm as codeMst } from '../../../../db/cds/cm/codeMgr/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';

namespace cm;
@path : '/cm.CodeMgrService'
service CodeMgrService {

    entity CodeMasters as projection on codeMst.Code_Mst;
    entity CodeDetails as projection on codeDtl.Code_Dtl;
    entity CodeLanguages as projection on codeLng.Code_Lng;

/*    view CodeCombo as 
    select 
        key tenant_id,
        key company_code,
        key group_code,
        key code,
        key language_cd,
        code_name
    from codeLng.Code_Lng; */
}
