using { dp as pdOperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as prodActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.productActivityService'

service ProductActivityService {
    entity PdOperationOrg as projection on pdOperationOrg.Pd_Operation_Org_View;
    entity PdProdActivityTemplate as projection on prodActivityTemplate.Pd_Product_Activity_Template;
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
}
