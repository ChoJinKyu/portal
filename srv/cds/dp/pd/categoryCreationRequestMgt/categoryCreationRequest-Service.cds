using { dp as PartCategory } from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';
using {dp as creationRequest} from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY_CREATION_REQUEST-model';	

namespace dp;
@path : '/dp.PartCategoryCreationRequestService'

service PartCategoryCreationRequestService {
    entity pdPartCategoryCreationRequestView as projection on creationRequest.Pd_Part_Category_Creation_Request_View ;
    entity pdPartCategoryCreationRequest as projection on creationRequest.Pd_Part_Category_Creation_Request;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
    entity pdPartCategoryView as projection on PartCategory.Pd_Part_Category_View;
    // tenant_id, language_cd, 'DP_PD_PROGRESS_STATUS' 

}