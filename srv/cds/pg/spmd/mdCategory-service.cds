using { pg as cateId } from '../../../../db/cds/pg/spmd/PG_MD_CATEGORY_ID-model.cds';
using { pg as cateItem } from '../../../../db/cds/pg/spmd/PG_MD_CATEGORY_ITEM-model.cds';
using { pg as partNoItemValue } from '../../../../db/cds/pg/spmd/PG_MD_PART_NO_ITEM_VALUE-model.cds';
using { pg as vpItemMapping } from '../../../../db/cds/pg/spmd/PG_MD_VP_ITEM_MAPPING-model.cds';
namespace pg;

//@cds.query.limit.default: 20
//@cds.query.limit.max: 100
@path : '/pg.MdCategoryService'
service MdCategoryService {

    entity MdCategory as projection on cateId.Md_Category_Id;

    entity MdCategoryItem as projection on cateItem.Md_Category_Item;
    
    entity PartNoItemValue as projection on partNoItemValue.Md_Part_No_Item_Value;
    
    entity VpItemMappHeader as projection on vpItemMapping.Md_Vp_Item_Mapping;

}