namespace pg;

using util from '../../util/util-model';


@comment : '[pg.md] VP별 관리항목 Mapping Detail'
entity Md_Vp_Item_Mapping_D {
    @comment : '테넌트ID' key tenant_id                     : String(5) not null  @title : '테넌트ID';
    @comment : '회사코드' key company_code                   : String(10) not null @title : '회사코드';
    @comment : '조직유형코드' key org_type_code                : String(30) not null @title : '조직유형코드';
    @comment : '조직코드' key org_code                       : String(10) not null @title : '조직코드';
    @comment : '협력사풀코드' key vendor_pool_code             : String(20) not null @title : '협력사풀코드';
    @comment : 'Item Code' key md_category_item_code     : String(4) not null  @title : 'Item Code';
    @comment : 'Category ID' md_category_id              : String(4) not null  @title : 'Category ID';
    @comment : 'Item 서수' md_category_item_ordinal_number : Integer64 not null  @title : 'Item 서수';

}


extend Md_Vp_Item_Mapping_D with util.Managed;
