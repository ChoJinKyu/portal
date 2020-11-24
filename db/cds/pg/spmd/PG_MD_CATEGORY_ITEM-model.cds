namespace pg;

using util from '../../util/util-model';


entity Md_Category_Item {
    key tenant_id                 : String(5) not null   @title : '테넌트ID';
    key company_code              : String(10) not null  @title : '회사코드';
    key org_type_code             : String(30) not null  @title : '조직유형코드';
    key org_code                  : String(10) not null  @title : '조직코드';
    key spmd_cateogry_code        : String(4) not null   @title : 'SPMD범주코드';
    key spmd_character_code       : String(4) not null   @title : 'SPMD특성코드';
        spmd_character_code_name  : String(100) not null @title : 'SPMD특성코드명';
        spmd_character_desc       : String(500)          @title : 'SPMD특성설명';
        spmd_character_type_code  : String(1) not null   @title : 'SPMD특성유형코드';
        spmd_character_value_unit : String(3)            @title : 'SPMD특성값단위';
        spmd_character_sort_seq   : Integer64 not null   @title : 'SPMD특성정렬순서';
        spmd_character_serial_no  : Integer64 not null   @title : 'SPMD특성일련번호';

}


extend Md_Category_Item with util.Managed;
