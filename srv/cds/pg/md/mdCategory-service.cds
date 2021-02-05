using { pg as cateId } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID-model';
using { pg as cateIdLng } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID_LNG-model';
using { pg as cateItem } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM-model';
using { pg as cateItemLng } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM_LNG-model';
using { pg as partNoItemValue } from '../../../../db/cds/pg/md/PG_MD_MATERIAL_ITEM_VALUE-model.cds';
using { pg as vpItemMapping } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING-model';
using { pg as vpItemMappingAttr } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING_ATTR-model';
using { pg as vpItemMappingView } from '../../../../db/cds/pg/md/PG_MD_VP_MAPPING_ITEM_VIEW-model';
//CM ORG
using {cm.Org_Tenant as CommomOrgTenant} from '../../../../db/cds/cm/CM_ORG_TENANT-model';
using {cm.Org_Company as CommomOrgCompany} from '../../../../db/cds/cm/CM_ORG_COMPANY-model';
using {cm.Org_Unit as CommomOrgUnit} from '../../../../db/cds/cm/CM_ORG_UNIT-model';

namespace pg;

//@cds.query.limit.default: 20
//@cds.query.limit.max: 100
@path : '/pg.MdCategoryService'
service MdCategoryService {

    @readonly
    entity CmOrgTenant @(title : '테넌트 정보') as projection on CommomOrgTenant;

    @readonly
    entity CmOrgBizunit @(title : '사업본부 정보') as projection on CommomOrgUnit;

    entity MdCategory as projection on cateId.Md_Category_Id;

    entity MdCategoryLng as projection on cateIdLng.Md_Category_Id_Lng;

    entity MdCategoryItem as projection on cateItem.Md_Category_Item;

    entity MdCategoryItemLng as projection on cateItemLng.Md_Category_Item_Lng;
    
    entity MdMaterialItemValue as projection on partNoItemValue.Md_Material_Item_Value;
    
    entity MdVpItemMapping as projection on vpItemMapping.Md_Vp_Item_Mapping;

    entity MdVpItemMappingAttr as projection on vpItemMappingAttr.Md_Vp_Item_Mapping_Attr;
    
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
		;

    // DB Object로 생성된 View를 조회 하는 경우 (model-cds가 존재해야함)
    //@cds.query.limit.default: 10
    //@cds.query.limit.max: 20
    view MdVpMappingItemView as 
        select from vpItemMappingView.Md_Vp_Mapping_Item_View(language_code:'KO');


/*
    // Tenant View
    view orgTenant @(title : '회사 마스터 View') as
        select
            key tenant_id,
                tenant_name
        from CommomOrgTenant
        where
            use_flag = 'true';

    // Company View
    view OrgCompanyView @(title : '법인 마스터 View') as
        select
            key tenant_id,
            key company_code,
                company_name
        from CommomOrgCompany
        where
            use_flag = 'true';

    // Biz Unit View
    view orgBizunit @(title : '사업부분 마스터 View') as
        select
            key tenant_id,
            key bizunit_code,
                bizunit_name
        from CommomOrgUnit
        where
            use_flag = 'true';
*/

}