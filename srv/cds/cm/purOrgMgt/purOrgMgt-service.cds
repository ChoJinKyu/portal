using cm.Pur_Org_Type_Mapping from '../../../../db/cds/cm/CM_PUR_ORG_TYPE_MAPPING-model';
using cm.Pur_Operation_Org from '../../../../db/cds/cm/CM_PUR_OPERATION_ORG-model';

namespace cm;
@path : '/cm.PurOrgMgtService'
service PurOrgMgtService {
    entity Pur_Org_Type_Mapping as projection on cm.Pur_Org_Type_Mapping;
    entity Pur_Operation_Org as projection on cm.Pur_Operation_Org;
}