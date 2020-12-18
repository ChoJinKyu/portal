using { pg as cateId } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID-model';
using { pg as cateItem } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM-model';
using { pg as partNoItemValue } from '../../../../db/cds/pg/md/PG_MD_PART_NO_ITEM_VALUE-model';
using { pg as vpItemMapping } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING-model';
using { pg as vpItemMappingAttr } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING_ATTR-model';
using { pg as vpItemMappingView } from '../../../../db/cds/pg/md/PG_MD_VP_MAPPING_ITEM_VIEW-model';

namespace pg;

//@cds.query.limit.default: 20
//@cds.query.limit.max: 100
@path : '/pg.MdCategoryService'
service MdCategoryService {

    entity MdCategory as projection on cateId.Md_Category_Id;

    entity MdCategoryItem as projection on cateItem.Md_Category_Item;
    
    entity PartNoItemValue as projection on partNoItemValue.Md_Part_No_Item_Value;
    
    entity VpItemMapping as projection on vpItemMapping.Md_Vp_Item_Mapping;

    entity VpItemMappingAttr as projection on vpItemMappingAttr.Md_Vp_Item_Mapping_Attr;

    // DB Object로 생성된 View를 조회 하는 경우 (model-cds가 존재해야함)
    //@cds.query.limit.default: 10
    //@cds.query.limit.max: 20
    view MdVpMappingItemView as select from vpItemMappingView.Md_Vp_Mapping_Item_View;

    // Category별 Item View
    view MdCategoryCodeItemView @(title : 'Category Item Mapping View') as
    	select 
			key cid.tenant_id
			, key cid.company_code
			, key cid.org_type_code
			, key cid.org_code
			, key cid.spmd_category_code
			, key citm.spmd_character_code

			, cid.spmd_category_code_name
			, cid.rgb_font_color_code
			, cid.rgb_cell_clolor_code
			, cid.spmd_category_sort_sequence

			, citm.spmd_character_code_name
			, citm.spmd_character_desc
			, citm.spmd_character_sort_seq
			, citm.spmd_character_serial_no
            
        from cateId.Md_Category_Id as cid
			join cateItem.Md_Category_Item as citm on cid.tenant_id = citm.tenant_id
									  and cid.company_code = citm.company_code
									  and cid.org_type_code = citm.org_type_code
									  and cid.org_code = citm.org_code
									  and cid.spmd_category_code = citm.spmd_category_code
		// order by cid.spmd_category_sort_sequence
        //         , citm.spmd_character_sort_seq
		;

}