using { cm as codeMst } from '../../../../db/cds/cm/codeMgr/CM_CODE_MST-model';
using { cm as codeDtl } from '../../../../db/cds/cm/codeMgr/CM_CODE_DTL-model';
using { cm as codeLng } from '../../../../db/cds/cm/codeMgr/CM_CODE_LNG-model';
using { cm as purOrgTypeMap } from '../../../../db/cds/cm/purOrgMgr/CM_PUR_ORG_TYPE_MAPPING-model';

namespace cm;
@path : '/cm.orgProcOrgTypeMgrService'
service orgProcOrgTypeMgrService {

    entity CodeMst as projection on codeMst.Code_Mst;
    entity CodeDtl as projection on codeDtl.Code_Dtl;
    entity CodeLng as projection on codeLng.Code_Lng;
    entity PurOrgTypeMap as projection on purOrgTypeMap.Pur_Org_Type_Mapping;

    view PurOrgTypeMapView as
    select key p.tenant_id,
           key p.company_code,
           key p.process_type_code
    from   purOrgTypeMap.Pur_Org_Type_Mapping p
    ;

}
