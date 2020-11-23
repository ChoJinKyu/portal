using { cm as orgCodeMst } from '../../../../db/cds/cm/orgCodeMgr/CM_ORG_CODE_MST-model';
using { cm as orgCodeDtl } from '../../../../db/cds/cm/orgCodeMgr/CM_ORG_CODE_DTL-model';
using { cm as orgCodeLng } from '../../../../db/cds/cm/orgCodeMgr/CM_ORG_CODE_LNG-model';

namespace cm;
@path : '/cm.OrgCodeMgrService'
service OrgCodeMgrService {

    entity OrgCodeMasters as projection on orgCodeMst.Org_Code_Mst;
    entity OrgCodeDetails as projection on orgCodeDtl.Org_Code_Dtl;
    entity OrgCodeLanguages as projection on orgCodeLng.Org_Code_Lng;

}
