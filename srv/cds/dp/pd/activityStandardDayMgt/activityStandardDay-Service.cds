using { dp as OperationOrg } from '../../../../../db/cds/dp/pd/DP_PD_OPERATION_ORG_VIEW-model';
using { dp as PartCategoryActivity} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_ACTIVITY-model';
using { dp as PartCategoryView} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';
using { dp as activityStdDayView } from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_STANDARD_DAY_VIEW-model';

namespace dp;
@path : '/dp.activityStdDayService'

service ActivityStandardDayService {
    entity PdOperationOrg as projection on OperationOrg.Pd_Operation_Org_View;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
    entity pdActivityStdDayView as projection on activityStdDayView.Pd_Activity_Standard_Day_View;
    entity pdPartCategoryView as projection on PartCategoryView.Pd_Part_Category_View;

    view CompanyView as
    select key company_code
    from  PartCategoryActivity.Pd_Part_Category_Activity
    where tenant_id = 'L2101'
    group by company_code
    ;

    view OrgView as
    select key org_code
    from  PartCategoryActivity.Pd_Part_Category_Activity
    where tenant_id = 'L2101'
    group by org_code 
    ;
}