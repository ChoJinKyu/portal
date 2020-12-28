namespace pg;

using util from '../../cm/util/util-model';


entity Md_Category_Id_Lng {
    key tenant_id               : String(5) not null  @title : '테넌트ID';
    key company_code            : String(10) not null @title : '회사코드';
    key org_type_code           : String(30) not null @title : '조직유형코드';
    key org_code                : String(10) not null @title : '조직코드';
    key spmd_category_code      : String(4) not null  @title : 'SPMD범주코드';
    key language_code           : String(4) not null  @title : '언어코드';
        spmd_category_code_name : String(50) not null @title : 'SPMD범주코드명';
}

extend Md_Category_Id_Lng with util.Managed;
