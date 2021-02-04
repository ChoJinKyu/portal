 using { dp as PartBaseActivityView } from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY_VIEW-model';
using { dp as PartBaseActivity } from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY-model';
using { dp as PartBaseActivityLng } from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY_LNG-model';
using { dp as PartBaseActivityCategory } from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY_CATEGORY-model';
using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.partBaseActivityService'

service PartBaseActivityService {
    entity PdPartBaseActivityView as projection on PartBaseActivityView.Pd_Part_Base_Activity_View;
    entity PdPartBaseActivityCategoryView as projection on PartBaseActivity.Pd_Part_Base_Activity_Category_View;
    entity PdPartBaseActivityCategoryPopView as projection on PartBaseActivity.Pd_Part_Base_Activity_Category_Pop_View;
    entity PdPartBaseActivity as projection on PartBaseActivity.Pd_Part_Base_Activity;
    entity PdPartBaseActivityLng as projection on PartBaseActivityLng.Pd_Part_Base_Activity_Lng;
    entity PdPartBaseActivityCategory as projection on PartBaseActivityCategory.Pd_Part_Base_Activity_Category;
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
}
