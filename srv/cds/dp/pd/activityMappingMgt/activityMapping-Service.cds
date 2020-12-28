using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';
using { dp as pdOperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as prodActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using { dp as partActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';

namespace dp;
@path : '/dp.activityMappingService'

service ActivityMappingService {
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
    entity PdOperationOrg as projection on pdOperationOrg.Pd_Operation_Org_View;
    entity PdProdActivityTemplate as projection on prodActivityTemplate.Pd_Product_Activity_Template;
    entity PdPartActivityTemplate as projection on partActivityTemplate.Pd_Part_Activity_Template;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
}