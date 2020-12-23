using { pg as cateId } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID-model';
using { pg as cateItem } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM-model';
using { pg as partNoItemValue } from '../../../../db/cds/pg/md/PG_MD_MATERIAL_ITEM_VALUE-model.cds';
using { pg as vpItemMapping } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING-model';
using { pg as vpItemMappingAttr } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING_ATTR-model';
using { pg as vpItemMappingView } from '../../../../db/cds/pg/md/PG_MD_VP_MAPPING_ITEM_VIEW-model';

namespace pg;

//@cds.query.limit.default: 20
//@cds.query.limit.max: 100
@path : '/pg.MdCategoryV4Service'
service MdCategoryV4Service {

    // VendorPool Category Item Mapping 1건 Procedure 호출
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.MdCategoryV4Service/MdVpMappingItemProc
    /*********************************
    {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "spmd_category_code":"C001", "spmd_character_code":"T001", "spmd_character_serial_no":1, "vendor_pool_code":"VP201610260092"}
    *********************************/
    action MdVpMappingItemProc(
        tenant_id : String(5), 
        company_code : String(10), 
        org_type_code : String(30), 
        org_code : String(10), 
        spmd_category_code : String(4),
        spmd_character_code : String(4),
        spmd_character_serial_no : Integer64,
        vendor_pool_code : String(20),
        update_user_id : String(500)
    ) returns String; 

    type MdVpMappingItemProcType {
        tenant_id : String(5); 
        company_code : String(10); 
        org_type_code : String(30); 
        org_code : String(10); 
        spmd_category_code : String(4);
        spmd_character_code : String(4);
        spmd_character_serial_no : Integer64;
        vendor_pool_code : String(20);
        update_user_id : String(500);
    }
    // VendorPool Category Item Mapping array multi건 Procedure 호출
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.MdCategoryV4Service/MdVpMappingItemMultiProc
    /*********************************
    {
        "items" : [
            {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "spmd_category_code":"C001", "spmd_character_code":"T001", "spmd_character_serial_no":1, "vendor_pool_code":"VP201610260092"},
            {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "spmd_category_code":"C002", "spmd_character_code":"T013", "spmd_character_serial_no":13, "vendor_pool_code":"VP201610260092"}
        ]
    }
    *********************************/
    action MdVpMappingItemMultiProc( items : array of MdVpMappingItemProcType ) returns String; 


    // VendorPool Mapping 상태(신규/저장/확정)처리 1건 Procedure 호출
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.MdCategoryV4Service/MdVpMappingStatusProc
    /*********************************
    {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260092"}
    *********************************/
    action MdVpMappingStatusProc(
        tenant_id : String(5), 
        company_code : String(10), 
        org_type_code : String(30), 
        org_code : String(10), 
        vendor_pool_code : String(20),
        confirmed_status_code : String(3),
        update_user_id : String(500)
    ) returns String; 

    type MdVpMappingStatusProcType {
        tenant_id : String(5); 
        company_code : String(10); 
        org_type_code : String(30); 
        org_code : String(10); 
        vendor_pool_code : String(20);
        confirmed_status_code : String(3);
        update_user_id : String(500);
    }
    // VendorPool Mapping 상태(신규/저장/확정)처리 array multi건 Procedure 호출
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.MdCategoryV4Service/MdVpMappingStatusMultiProc
    /*********************************
    {
        "items" : [
            {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260092"},
            {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260092"}
        ]
    }
    *********************************/
    action MdVpMappingStatusMultiProc( items : array of MdVpMappingStatusProcType ) returns String; 
    
    // Category별 Item Condition View
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.MdCategoryV4Service/MdCategoryCodeItemConditionView
    /*********************************
    {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "spmd_category_code":"C001"}
    *********************************/
    view MdCategoryCodeItemConditionView (
                        tenant_id: String(5), 
                        company_code: String(10), 
                        org_type_code: String(30), 
                        org_code: String(10), 
                        spmd_category_code: String(4)
    ) as
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
		where cid.tenant_id = :tenant_id
		and cid.company_code = :company_code
		and cid.org_type_code = :org_type_code
		and cid.org_code = :org_code
		and cid.spmd_category_code = :spmd_category_code
		;


}