namespace pg;

using util from '../../util/util-model';


entity Md_Part_No_Item_Value {
    key tenant_id                  : String(5) not null  @title : '테넌트ID';
    key company_code               : String(10) not null @title : '회사코드';
    key org_type_code              : String(30) not null @title : '조직유형코드';
    key org_code                   : String(10) not null @title : '조직코드';
    key vendor_pool_code           : String(20) not null @title : '협력사풀코드';
    key material_code              : String(40) not null @title : '자재코드';
    key supplier_code              : String(15) not null @title : '공급업체코드';
    key spmd_character_code        : String(4) not null  @title : 'SPMD특성코드';
        spmd_character_serial_no   : Integer64 not null  @title : 'SPMD특성일련번호';
        spmd_character_type_code   : String(1) not null  @title : 'SPMD특성유형코드';
        spmd_character_value_text  : String(100)         @title : 'SPMD특성값텍스트';
        spmd_character_value_digit : Decimal             @title : 'SPMD특성값숫자';
        spmd_character_value_unit  : String(3)           @title : 'SPMD특성값단위';
        spmd_category_code         : String(4) not null  @title : 'SPMD범주코드';


}


extend Md_Part_No_Item_Value with util.Managed;
