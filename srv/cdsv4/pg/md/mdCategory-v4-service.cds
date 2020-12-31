using { pg as cateId } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID-model';
using { pg as cateIdLng } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID_LNG-model';
using { pg as cateItem } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM-model';
using { pg as cateItemLng } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM_LNG-model';
using { pg as partNoItemValue } from '../../../../db/cds/pg/md/PG_MD_MATERIAL_ITEM_VALUE-model.cds';
using { pg as vpItemMapping } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING-model';
using { pg as vpItemMappingAttr } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING_ATTR-model';
using { pg as vpItemMappingView } from '../../../../db/cds/pg/md/PG_MD_VP_MAPPING_ITEM_VIEW-model';

namespace pg;

//@cds.query.limit.default: 20
//@cds.query.limit.max: 100
@path : '/pg.MdCategoryV4Service'
service MdCategoryV4Service {

    // 처리 결과 Return
    type ReturnRslt {
        rsltCd : String;
        rsltMesg : String;
        rsltInfo : String;  // result 추가JSON 정보 
    }

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
    action MdVpMappingItemMultiProc( items : array of MdVpMappingItemProcType ) returns ReturnRslt; 


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
    //action MdVpMappingStatusMultiProc( items : array of MdVpMappingStatusProcType ) returns String; 
    action MdVpMappingStatusMultiProc( items : array of MdVpMappingStatusProcType ) returns ReturnRslt; 
    
    // Category범주 목록 Parameter View V4호출
    // URL : /pg.MdCategoryV4Service/MdCategoryListConditionView(language_code='EN')/Set
    /*********************************
    {"language_code":"EN"}
    *********************************/
    view MdCategoryListConditionView ( language_code:String ) as
		select 
			key cid.tenant_id
			, key cid.company_code
			, key cid.org_type_code
			, key cid.org_code
			, key cid.spmd_category_code
			, cid.rgb_font_color_code
			, cid.rgb_cell_clolor_code
			, cid.spmd_category_sort_sequence
			, cid.local_create_dtm
			, cid.local_update_dtm
			, cid.create_user_id
			, cid.update_user_id
			, cid.system_create_dtm
			, cid.system_update_dtm
            , ifnull(cidl.language_code, :language_code) as language_code : String(4)
			, ifnull(cidl.spmd_category_code_name, cid.spmd_category_code_name) as spmd_category_code_name : String(50)
		from cateId.Md_Category_Id as cid
		left outer join cateIdLng.Md_Category_Id_Lng as cidl on (        
									  cid.tenant_id = cidl.tenant_id
									  and cid.company_code = cidl.company_code
									  and cid.org_type_code = cidl.org_type_code
									  and cid.org_code = cidl.org_code
									  and cid.spmd_category_code = cidl.spmd_category_code
									  and cidl.language_code = :language_code
								)
		;

    // Item특성 목록 Parameter View V4호출
    // URL : /pg.MdCategoryV4Service/MdItemListConditionView(language_code='EN')/Set
    /*********************************
    {"language_code":"EN"}
    *********************************/
    view MdItemListConditionView ( language_code:String ) as
		select 
			key citm.tenant_id
			, key citm.company_code
			, key citm.org_type_code
			, key citm.org_code
			, key citm.spmd_category_code
			, key citm.spmd_character_code
			, cid.spmd_category_code_name
			, citm.spmd_character_sort_seq
			, citm.spmd_character_serial_no
            , ifnull(citml.language_code, :language_code) as language_code : String(4)
			, ifnull(citml.spmd_character_code_name, citm.spmd_character_code_name) as spmd_character_code_name : String(100)
			, ifnull(citml.spmd_character_desc, citm.spmd_character_desc) as spmd_character_desc : String(500)
			, citm.local_create_dtm
			, citm.local_update_dtm
			, citm.create_user_id
			, citm.update_user_id
			, citm.system_create_dtm
			, citm.system_update_dtm
		from cateItem.Md_Category_Item as citm
		left outer join cateItem.Md_Category_Item_Lng as citml on (
									  citm.tenant_id = citml.tenant_id
									  and citm.company_code = citml.company_code
									  and citm.org_type_code = citml.org_type_code
									  and citm.org_code = citml.org_code
									  and citm.spmd_category_code = citml.spmd_category_code
									  and citm.spmd_character_code = citml.spmd_character_code
									  and citml.language_code = :language_code
								)
		left outer join ( select
								cid.tenant_id
								, cid.company_code
								, cid.org_type_code
								, cid.org_code
								, cid.spmd_category_code
								, ifnull(cidl.spmd_category_code_name, cid.spmd_category_code_name) as spmd_category_code_name : String(50)
							from cateId.Md_Category_Id as cid
									left outer join cateIdLng.Md_Category_Id_Lng as cidl on (cid.tenant_id = cidl.tenant_id
																  and cid.company_code = cidl.company_code
																  and cid.org_type_code = cidl.org_type_code
																  and cid.org_code = cidl.org_code
																  and cid.spmd_category_code = cidl.spmd_category_code
																  and cidl.language_code = :language_code
									)
			
						) as cid on (
							  citm.tenant_id = cid.tenant_id
							  and citm.company_code = cid.company_code
							  and citm.org_type_code = cid.org_type_code
							  and citm.org_code = cid.org_code
							  and citm.spmd_category_code = cid.spmd_category_code
						)
		;


    // Category별 Item Condition View
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.MdCategoryV4Service/MdCategoryCodeItemConditionView(tenant_id='L2100',company_code='*',org_type_code='BU',org_code='BIZ00200',spmd_category_code='C001')/Set
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