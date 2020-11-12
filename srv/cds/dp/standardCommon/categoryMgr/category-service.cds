using {dp as partCategory} from '../../../../../db/cds/dp/standardCommon/DP_SC_PART_CATEGORY-model';
using {dp as categoryClass} from '../../../../../db/cds/dp/standardCommon/DP_SC_PART_CATEGORY_CLASS-model';
using {dp as categoryAuth} from '../../../../../db/cds/dp/standardCommon/DP_SC_PART_CATEGORY_AUTH-model';

namespace dp;
@path : '/dp.CategoryService'

service CategoryService {

    entity partCategorys as projection on partCategory.Sc_Part_Category;
    entity partCategoryClasses as projection on categoryClass.Sc_Part_Category_Class;
    entity partcategoryAuthes as projection on categoryAuth.Sc_Part_Category_Auth;

}