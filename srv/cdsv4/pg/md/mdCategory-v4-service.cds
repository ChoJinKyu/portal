using { pg as cateId } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID-model';
using { pg as cateIdLng } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ID_LNG-model';
using { pg as cateItem } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM-model';
using { pg as cateItemLng } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_ITEM_LNG-model';
using { pg as partNoItemValue } from '../../../../db/cds/pg/md/PG_MD_MATERIAL_ITEM_VALUE-model.cds';
using { pg as vpItemMapping } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING-model';
using { pg as vpItemMappingAttr } from '../../../../db/cds/pg/md/PG_MD_VP_ITEM_MAPPING_ATTR-model';
using { pg as vpItemMappingView } from '../../../../db/cds/pg/md/PG_MD_VP_MAPPING_ITEM_VIEW-model';
using { pg as newCateCodeView } from '../../../../db/cds/pg/md/PG_MD_CATEGORY_CODE_VIEW-model';
using { pg as newItemCodeView } from '../../../../db/cds/pg/md/PG_MD_CHARACTER_CODE_VIEW-model';
using { pg as vpMaterialMappListTitleView } from '../../../../db/cds/pg/md/PG_MD_VP_MATERIAL_MAPP_LIST_TITLE_VIEW-model';
using { pg as vpMaterialMappListView } from '../../../../db/cds/pg/md/PG_MD_VP_MATERIAL_MAPP_LIST_VIEW-model';

namespace pg;

//@cds.query.limit.default: 20
//@cds.query.limit.max: 100
@path : '/pg.MdCategoryV4Service'
service MdCategoryV4Service {

        // Category범주코드 생성 DB Object로 생성된 View를 model-cds로 entity를 생성하는 경우
    view MdNewCategoryCode(tenant_id: String, company_code: String, org_type_code: String, org_code: String) as 
            select from newCateCodeView.Md_Category_Code_View(tenant_id: :tenant_id, company_code: :company_code, org_type_code: :org_type_code, org_code: :org_code);

    // CategoryItem특성코드 생성 DB Object로 생성된 View를 model-cds로 entity를 생성하는 경우
    view MdNewCategoryItemCode(tenant_id: String, company_code: String, org_type_code: String, org_code: String) as 
            select from newItemCodeView.Md_Character_Code_View(tenant_id: :tenant_id, company_code: :company_code, org_type_code: :org_type_code, org_code: :org_code);

    // Vendor pool별 Material/Supplier Mapping List Title View
    view MdVpMaterialMappListTitleView(language_code: String, tenant_id: String, company_code: String, org_type_code: String, org_code: String, vendor_pool_code: String) as 
            select from vpMaterialMappListTitleView.Md_Vp_Material_Mapp_List_Title_View(language_code: :language_code, tenant_id: :tenant_id, company_code: :company_code, org_type_code: :org_type_code, org_code: :org_code, vendor_pool_code: :vendor_pool_code);

    // Vendor Pool별 Material/Supplier Mapping List View
    view MdVpMaterialMappListView(language_code: String, tenant_id: String, company_code: String, org_type_code: String, org_code: String, vendor_pool_code: String) as 
            select from vpMaterialMappListView.Md_Vp_Material_Mapp_List_View(language_code: :language_code, tenant_id: :tenant_id, company_code: :company_code, org_type_code: :org_type_code, org_code: :org_code, vendor_pool_code: :vendor_pool_code);

    // Vendor Pool별 Material/Supplier Mapping 목록 Value Keyin 저장 Procedure 호출
    // Fiori Json Array 데이터 Ajax로 V4호출
    // URL : /pg.md.MdCategoryV4Service/MdVpMaterialMappSaveProc
    //{
    //	"params" : {"tenant_id":"L2100", "company_code":"*", "org_type_code":"BU", "org_code":"BIZ00200", "vendor_pool_code":"VP201610260087", "values":[
    //		{"material_code":"MCode-1", "supplier_code":"SCode-1", "item_serial_no":"1", "attr_value":"Value-1값"},
    //		{"material_code":"MCode-1", "supplier_code":"SCode-1", "item_serial_no":"2", "attr_value":"Value-2값"},
    //		{"material_code":"MCode-1", "supplier_code":"SCode-1", "item_serial_no":"3", "attr_value":"Value-3값"},
    //		{"material_code":"MCode-1", "supplier_code":"SCode-2", "item_serial_no":"1", "attr_value":"Value-1값"},
    //		{"material_code":"MCode-1", "supplier_code":"SCode-2", "item_serial_no":"100", "attr_value":"Value-100값"},
    //		{"material_code":"MCode-2", "supplier_code":"SCode-1", "item_serial_no":"5", "attr_value":"Value-5값"}
    //	]}
    //}
    action MdVpMaterialMappSaveProc( params : VpValueInfo ) returns ReturnRslt;

    type VpValueInfo {
        tenant_id: String;
        company_code: String;
        org_type_code: String;
        org_code: String;
        vendor_pool_code: String;
        values: array of VpMaterialValue;
    };
    type VpMaterialValue {
        material_code: String;
        supplier_code: String;
        item_serial_no: String;
        attr_value: String;
    };

    // DB Object로 생성된 View를 조회 하는 경우 (model-cds가 존재해야함)
    //@cds.query.limit.default: 10
    //@cds.query.limit.max: 20
    view MdVpMappingItemView( language_code: String )  as select from vpItemMappingView.Md_Vp_Mapping_Item_View(language_code: :language_code);

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


    // VP3별 Item특성 Mapping Right 진행 목록 Parameter View V4호출
    // URL : /pg.MdCategoryV4Service/MdVpMappingItemIngView(language_code='EN')/Set
    /*********************************
    {"language_code":"EN"}
    *********************************/
    view MdVpMappingItemIngView( language_code:String ) as
        select 
			key civma.tenant_id
			, key civma.company_code
			, key civma.org_type_code
			, key civma.org_code
            , key civma.vendor_pool_code
            , key civma.spmd_category_code
            , key civma.spmd_character_code
            , mst.spmd_category_sort_sequence
            , mst.rgb_cell_clolor_code
            , mst.rgb_font_color_code
            , mst.spmd_category_code_name
            , mst.spmd_character_code_name
            , mst.spmd_character_desc
			, mst.spmd_character_sort_seq
			, mst.spmd_character_serial_no
			, civma.local_create_dtm
			, civma.local_update_dtm
			, civma.create_user_id
			, civma.update_user_id
			, civma.system_create_dtm
			, civma.system_update_dtm
        from vpItemMappingAttr.Md_Vp_Item_Mapping_Attr as civma
        join (
                select 
                    tenant_id
                    , company_code
                    , org_type_code
                    , org_code
                    , spmd_category_code
                    , spmd_category_code_name
                    , spmd_category_sort_sequence
                    , rgb_cell_clolor_code
                    , rgb_font_color_code
                    , spmd_character_code
                    , spmd_character_code_name
                    , spmd_character_desc
                    , spmd_character_sort_seq
                    , spmd_character_serial_no
                    , language_code
                from MdItemListConditionView(language_code: :language_code) 
        ) as mst on (
                    mst.tenant_id = civma.tenant_id
                    and mst.company_code = civma.company_code
                    and mst.org_type_code = civma.org_type_code
                    and mst.org_code = civma.org_code
                    and mst.spmd_category_code = civma.spmd_category_code
                    and mst.spmd_character_code = civma.spmd_character_code
        )
        ;

    // 전체 Item특성 Mapping Left 목록 Parameter View V4호출
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
            , cid.spmd_category_sort_sequence
            , cid.rgb_cell_clolor_code
            , cid.rgb_font_color_code
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
                                , cid.rgb_cell_clolor_code
                                , cid.rgb_font_color_code
                                , cid.spmd_category_sort_sequence
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
















    // Vendor Pool Level-3별 Category범주>Item특성 Mapping 목록 Parameter View V4호출
    // URL : /pg.MdCategoryV4Service/MdVpMappingItemViewProc
    /*********************************
    {"language_code":"EN"}
    /*********************************
    {
        "params" : {"language_code":"EN"}
    }
    *********************************/
    //@cds.query.limit.default: 10
    //@cds.query.limit.max: 20
    action MdVpMappingItemViewProc( params : DynamicParamType ) returns MdVpMappingItemViewData;

    type DynamicParamType {
        language_code : String(4);
        /*
        tenant_id : String(5); 
        company_code : String(10); 
        org_type_code : String(30); 
        org_code : String(10); 
        vendor_pool_code : String(20);
        */
    }

    // UI5 - PivotTable Backend CDS
    type DynamicTitle {
        label: String;
        colId: String;
    };
    type DynamicRecord {
        colIds: many String;
        values: many String null;
    };
    type MdVpMappingItemViewData {
        titles: many DynamicTitle;
        records: many DynamicRecord;
    };

}