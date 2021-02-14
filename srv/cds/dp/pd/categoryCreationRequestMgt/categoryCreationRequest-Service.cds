using { dp as PartCategory } from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY-model';
using {dp as creationRequest} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_CREATION_REQUEST-model';	

// 카테고리 그룹 group_code = 'DP_PD_CATEGORY_GROUP'
// 진행상태 group_code = 'DP_PD_PROGRESS_STATUS'
using { cm as Code } from '../../../../../db/cds/cm/CM_CODE_VIEW-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';

namespace dp;
@path : '/dp.PartCategoryCreationRequestService'

service PartCategoryCreationRequestService {
    entity pdPartCategoryCreationRequestView as projection on creationRequest.Pd_Part_Category_Creation_Request_View ;
    entity pdPartCategoryCreationRequest as projection on creationRequest.Pd_Part_Category_Creation_Request;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
    entity pdPartCategoryView as projection on PartCategory.Pd_Part_Category_View;

}