namespace pg;

using util from '../../cm/util/util-model';


entity Md_Category_Item_Lng {
    @comment : '테넌트ID' key tenant_id                : String(5) not null   @title : '테넌트ID';
    @comment : '회사코드' key company_code              : String(10) not null  @title : '회사코드';
    @comment : '조직유형코드' key org_type_code           : String(30) not null  @title : '조직유형코드';
    @comment : '조직코드' key org_code                  : String(10) not null  @title : '조직코드';
    @comment : 'SPMD범주코드' key spmd_category_code    : String(4) not null   @title : 'SPMD범주코드';
    @comment : 'SPMD특성코드' key spmd_character_code   : String(4) not null   @title : 'SPMD특성코드';
    @comment : '언어코드' key language_code             : String(4) not null   @title : '언어코드';
    @comment : 'SPMD특성코드명' spmd_character_code_name : String(100) not null @title : 'SPMD특성코드명';
    @comment : 'SPMD특성설명' spmd_character_desc       : String(500)          @title : 'SPMD특성설명';

}

//
extend Md_Category_Item_Lng with util.Managed;
