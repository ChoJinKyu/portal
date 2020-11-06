using cm.Pur_Org_Type_Mapping from '../../../../db/cds/cm/purOrgMgr/CM_PUR_ORG_TYPE_MAPPING-model';
using cm.Pur_Operation_Org from '../../../../db/cds/cm/purOrgMgr/CM_PUR_OPERATION_ORG-model';

namespace cm;
@path : '/cm.PurOrgMgrService'
service PurOrgMgrService {
    entity Pur_Org_Type_Mapping as projection on cm.Pur_Org_Type_Mapping;
    entity Pur_Operation_Org as projection on cm.Pur_Operation_Org;
}