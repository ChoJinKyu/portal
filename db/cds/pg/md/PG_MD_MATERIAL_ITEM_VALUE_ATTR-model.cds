namespace pg;

using util from '../../cm/util/util-model';


entity Md_Material_Item_Value_Attr {
    key tenant_id                : String(5) not null    @title : '테넌트ID';
    key company_code             : String(10) not null   @title : '회사코드';
    key org_type_code            : String(30) not null   @title : '조직유형코드';
    key org_code                 : String(10) not null   @title : '조직코드';
    key material_code            : String(40) not null   @title : '자재코드';
    key supplier_code            : String(10) not null   @title : '공급업체코드';
    key spmd_character_code      : String(4) not null    @title : 'SPMD특성코드';
        spmd_character_value     : String(100)           @title : 'SPMD특성값';
        spmd_character_serial_no : Integer64             @title : 'SPMD특성일련번호';
        vendor_pool_code         : String(20)            @title : '협력사풀코드';
        use_flag                 : Boolean default TRUE  @title : '사용여부';
        mapping_flag             : Boolean default FALSE @title : '매핑여부';
}

extend Md_Material_Item_Value_Attr with util.Managed;
