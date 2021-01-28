// using { dp as PartBaseActivityView } from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY-model';
using { dp as PartBaseActivity } from '../../../../../db/cds/dp/pd/DP_PD_PART_BASE_ACTIVITY-model';
using {dp as activityMapping} from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_MAPPING-model';

namespace dp;
@path : '/dp.partBaseActivityService'

service PartBaseActivityService {
    entity PdPartBaseActivityView as projection on PartBaseActivity.Pd_Part_Base_Activity_View;
    entity PdPartBaseActivity as projection on PartBaseActivity.Pd_Part_Base_Activity;
    entity ActivityMapping as projection on activityMapping.Pd_Activity_Mapping;
}
