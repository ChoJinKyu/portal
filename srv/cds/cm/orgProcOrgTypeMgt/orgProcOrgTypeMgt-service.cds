using { cm as codeMst } from '../../../../db/cds/cm/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../db/cds/cm/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/CM_CODE_LNG-model';
using { cm as purOrgTypeMap } from '../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using { cm as px } from '../../../../db/cds/cm/CM_PUR_ORG_TYPE_VIEW-model';

namespace cm;
@path : '/cm.orgProcOrgTypeMgtService'
service orgProcOrgTypeMgtService {
    entity PurOrgTypeView as projection on px.Pur_Org_Type_View;
    
    entity CodeMst as projection on codeMst.Code_Mst;
    entity CodeDtl as projection on codeDtl.Code_Dtl;
    entity CodeLng as projection on codeLng.Code_Lng;
    entity PurOrgTypeMap as projection on purOrgTypeMap.Pur_Org_Type_Mapping;

    // view PurOrgTypeMapView as
    // select key p.tenant_id,
    //        key p.company_code,
    //        key p.process_type_code,
    //        ( select l.code_name
    //          from   codeLng.Code_Lng l
    //          where  l.group_code = 'CM_PROCESS_TYPE_CODE'
    //          and    l.code = p.process_type_code
    //          and    l.language_cd = 'KO'
    //          and    l.tenant_id = p.tenant_id
    //         )  as process_type_name: String(240),
    //        p.org_type_code,
    //        ( select l.code_name
    //          from   codeLng.Code_Lng l
    //          where  l.group_code = 'CM_ORG_TYPE_CODE'
    //          and    l.code = p.org_type_code
    //          and    l.language_cd = 'KO'
    //          and    l.tenant_id = p.tenant_id
    //         )  as org_type_name: String(240),
    //        p.use_flag
    // from   purOrgTypeMap.Pur_Org_Type_Mapping p
    // ;


}
