/* Vendor Pool별 자재-공급업체별 Category/Item Attr Mapping 목록 정보 조회 View */
namespace pg;

@cds.persistence.exists
entity Md_Vp_Material_Mapp_List_View(
                        language_code : String
                        , tenant_id : String
                        , company_code : String
                        , org_type_code : String
                        , org_code : String
                        , vendor_pool_code : String
) {
    key tenant_id                    : String(5)   @title : '테넌트ID';
    key company_code                 : String(10)  @title : '회사코드';
    key org_type_code                : String(30)  @title : '조직유형코드';
    key org_code                     : String(10)  @title : '조직코드';
    key vendor_pool_code             : String(20)  @title : '협력사풀코드';
        vendor_pool_local_name       : String(240) @title : '협력사풀로컬명';
        vendor_pool_english_name     : String(240) @title : '협력사풀로칼명';
        repr_department_code         : String(50)  @title : '대표부서코드';
        department_local_name        : String(240) @title : '대표부서명';
    key material_code                : String(40)  @title : '품목코드';
        material_code_name           : String(300) @title : '품목설명';
        supplier_code                : String(10)  @title : '공급업체코드';
        supplier_code_name           : String(240) @title : '공급업체명';
        use_flag                     : Boolean     @title : '사용여부';
        mapping_flag                 : Boolean     @title : '매핑여부';
        vendor_pool_item_mapping_cnt : Integer64   @title : '협력사Item매핑총Count';
        
        spmd_attr_info_001           : String(1000)@title : 'spmd_attr_info_001';
        spmd_attr_info_002           : String(1000)@title : 'spmd_attr_info_002';
        spmd_attr_info_003           : String(1000)@title : 'spmd_attr_info_003';
        spmd_attr_info_004           : String(1000)@title : 'spmd_attr_info_004';
        spmd_attr_info_005           : String(1000)@title : 'spmd_attr_info_005';
        spmd_attr_info_006           : String(1000)@title : 'spmd_attr_info_006';
        spmd_attr_info_007           : String(1000)@title : 'spmd_attr_info_007';
        spmd_attr_info_008           : String(1000)@title : 'spmd_attr_info_008';
        spmd_attr_info_009           : String(1000)@title : 'spmd_attr_info_009';
        spmd_attr_info_010           : String(1000)@title : 'spmd_attr_info_010';
        spmd_attr_info_011           : String(1000)@title : 'spmd_attr_info_011';
        spmd_attr_info_012           : String(1000)@title : 'spmd_attr_info_012';
        spmd_attr_info_013           : String(1000)@title : 'spmd_attr_info_013';
        spmd_attr_info_014           : String(1000)@title : 'spmd_attr_info_014';
        spmd_attr_info_015           : String(1000)@title : 'spmd_attr_info_015';
        spmd_attr_info_016           : String(1000)@title : 'spmd_attr_info_016';
        spmd_attr_info_017           : String(1000)@title : 'spmd_attr_info_017';
        spmd_attr_info_018           : String(1000)@title : 'spmd_attr_info_018';
        spmd_attr_info_019           : String(1000)@title : 'spmd_attr_info_019';
        spmd_attr_info_020           : String(1000)@title : 'spmd_attr_info_020';
        spmd_attr_info_021           : String(1000)@title : 'spmd_attr_info_021';
        spmd_attr_info_022           : String(1000)@title : 'spmd_attr_info_022';
        spmd_attr_info_023           : String(1000)@title : 'spmd_attr_info_023';
        spmd_attr_info_024           : String(1000)@title : 'spmd_attr_info_024';
        spmd_attr_info_025           : String(1000)@title : 'spmd_attr_info_025';
        spmd_attr_info_026           : String(1000)@title : 'spmd_attr_info_026';
        spmd_attr_info_027           : String(1000)@title : 'spmd_attr_info_027';
        spmd_attr_info_028           : String(1000)@title : 'spmd_attr_info_028';
        spmd_attr_info_029           : String(1000)@title : 'spmd_attr_info_029';
        spmd_attr_info_030           : String(1000)@title : 'spmd_attr_info_030';
        spmd_attr_info_031           : String(1000)@title : 'spmd_attr_info_031';
        spmd_attr_info_032           : String(1000)@title : 'spmd_attr_info_032';
        spmd_attr_info_033           : String(1000)@title : 'spmd_attr_info_033';
        spmd_attr_info_034           : String(1000)@title : 'spmd_attr_info_034';
        spmd_attr_info_035           : String(1000)@title : 'spmd_attr_info_035';
        spmd_attr_info_036           : String(1000)@title : 'spmd_attr_info_036';
        spmd_attr_info_037           : String(1000)@title : 'spmd_attr_info_037';
        spmd_attr_info_038           : String(1000)@title : 'spmd_attr_info_038';
        spmd_attr_info_039           : String(1000)@title : 'spmd_attr_info_039';
        spmd_attr_info_040           : String(1000)@title : 'spmd_attr_info_040';
        spmd_attr_info_041           : String(1000)@title : 'spmd_attr_info_041';
        spmd_attr_info_042           : String(1000)@title : 'spmd_attr_info_042';
        spmd_attr_info_043           : String(1000)@title : 'spmd_attr_info_043';
        spmd_attr_info_044           : String(1000)@title : 'spmd_attr_info_044';
        spmd_attr_info_045           : String(1000)@title : 'spmd_attr_info_045';
        spmd_attr_info_046           : String(1000)@title : 'spmd_attr_info_046';
        spmd_attr_info_047           : String(1000)@title : 'spmd_attr_info_047';
        spmd_attr_info_048           : String(1000)@title : 'spmd_attr_info_048';
        spmd_attr_info_049           : String(1000)@title : 'spmd_attr_info_049';
        spmd_attr_info_050           : String(1000)@title : 'spmd_attr_info_050';
        local_create_dtm             : DateTime    @title : '로컬등록시간';
        local_update_dtm             : DateTime    @title : '로컬수정시간';
        create_user_id               : String(255) @title : '등록사용자ID';
        update_user_id               : String(255) @title : '변경사용자ID';
}
