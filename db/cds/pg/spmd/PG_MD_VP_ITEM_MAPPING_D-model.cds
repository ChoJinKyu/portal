namespace pg;

using util from '../../util/util-model';


entity Md_Vp_Item_Mapping_D {
    key tenant_id                : String(5) not null  @title : '테넌트ID';
    key company_code             : String(10) not null @title : '회사코드';
    key org_type_code            : String(30) not null @title : '조직유형코드';
    key org_code                 : String(10) not null @title : '조직코드';
    key vendor_pool_code         : String(20) not null @title : '협력사풀코드';
    key spmd_character_code      : String(4) not null  @title : 'SPMD특성코드';
        spmd_cateogry_code       : String(4) not null  @title : 'SPMD범주코드';
        spmd_character_serial_no : Integer64 not null  @title : 'SPMD특성일련번호';


}


extend Md_Vp_Item_Mapping_D with util.Managed;
