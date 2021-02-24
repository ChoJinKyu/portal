using { dp as PartCategory } from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY-model';
using {dp as partCategoryLng} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_LNG-model';	
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';
using { dp as activityStdDayView } from '../../../../../db/cds/dp/pd/DP_PD_ACTIVITY_STANDARD_DAY_VIEW-model';
using {dp as creationRequest} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_CREATION_REQUEST-model';	
// 카테고리그룹 group_code = 'DP_PD_CATEGORY_GROUP'
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';

namespace dp;
@path : '/dp.PartCategoryService'

service PartCategoryService {
    entity pdPartCategoryView as projection on PartCategory.Pd_Part_Category_View ;
    entity pdPartCategoryLng as projection on partCategoryLng.Pd_Part_Category_Lng ;
    entity pdPartParentCategoryView as projection on PartCategory.Pd_Part_Parent_Category_View ;
    entity PdPartCategory as projection on PartCategory.Pd_Part_Category;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
    entity CmCodeView as projection on Code.Code_View;
    entity pdActivityStdDayView as projection on activityStdDayView.Pd_Activity_Standard_Day_View;
    entity pdPartCategoryCreationRequestView as projection on creationRequest.Pd_Part_Category_Creation_Request_View ;

};


