using { dp as ProdActivityTemplateView } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using { dp as ProdActivityTemplate } from '../../../../../db/cds/dp/pd/DP_PD_PRODUCT_ACTIVITY_TEMPLATE-model';
using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.productActivityService'

service ProductActivityService {
    entity PdProdActivityTemplateView as projection on ProdActivityTemplate.Pd_Product_Activity_Template_View;
    entity PdProdActivityTemplate as projection on ProdActivityTemplate.Pd_Product_Activity_Template;
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
}
