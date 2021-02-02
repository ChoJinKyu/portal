using { dp as PartCategory } from '../../../../../db/cds/dp/pd/DP_PD_PART_CATEGORY-model';
using { dp as getCmCodeCombo } from '../../../../../db/cds/dp/pd/DP_PD_GET_CM_CODE_COMBO_VIEW-model';

namespace dp;
@path : '/dp.PartCategoryService'

service PartCategoryService {
    entity pdPartCategoryView as projection on PartCategory.Pd_Part_Category_View ;
    entity pdPartParentCategoryView as projection on PartCategory.Pd_Part_Parent_Category_View ;
    entity PdPartCategory as projection on PartCategory.Pd_Part_Category;
    entity PdGetCmCodeCombo as projection on getCmCodeCombo.Pd_Get_Cm_Code_Combo_View;
    // tenant_id, language_cd, 'DP_PD_CATEGORY_GROUP' 

}