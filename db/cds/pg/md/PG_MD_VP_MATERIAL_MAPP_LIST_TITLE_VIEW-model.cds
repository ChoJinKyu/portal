/* Vendor pool별 Meterial/Supplier Mapping List Title View */
namespace pg;

@cds.persistence.exists
entity Md_Vp_Material_Mapp_List_Title_View(
                                language_code : String
                                , tenant_id : String
                                , company_code : String
                                , org_type_code : String
                                , org_code : String
                                , vendor_pool_code : String
) {
    key tenant_id                : String(5)  @title : '테넌트ID';
    key company_code             : String(10) @title : '회사코드';
    key org_type_code            : String(30) @title : '조직유형코드';
    key org_code                 : String(10) @title : '조직코드';
    key vendor_pool_code         : String(20) @title : '협력사풀코드';
    key spmd_category_code       : String(4)  @title : 'SPMD범주코드';
    key spmd_character_code      : String(4)  @title : 'SPMD특성코드';
        spmd_character_serial_no : Integer64  @title : 'SPMD특성일련번호';
        spmd_category_code_name  : String(50) @title : 'SPMD범주코드명';
        spmd_character_code_name : String(100)@title : 'SPMD특성코드명';
        rgb_font_color_code      : String(7)  @title : 'RGB글꼴색상코드';
        rgb_cell_clolor_code     : String(7)  @title : 'RGB셀색상코드';
}
