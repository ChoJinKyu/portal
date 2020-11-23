namespace pg;

using util from '../../util/util-model';


@comment : '[pg.md] Part No별 관리항목 속성값'
entity Md_Part_No_Item_Value {
    @comment : '테넌트ID' key tenant_id                              : String(5) not null  @title : '테넌트ID';
    @comment : '회사코드' key company_code                            : String(10) not null @title : '회사코드';
    @comment : '조직유형코드' key org_type_code                         : String(30) not null @title : '조직유형코드';
    @comment : '조직코드' key org_code                                : String(10) not null @title : '조직코드';
    @comment : '협력사풀코드' key vendor_pool_code                      : String(20) not null @title : '협력사풀코드';
    @comment : 'Part No' key item_code                            : String(40) not null @title : 'Part No';
    @comment : '공급업체코드' key supplier_code                         : String(40) not null @title : '공급업체코드';
    @comment : 'Item Code' key md_category_item_code              : String(4) not null  @title : 'Item Code';
    @comment : 'Item 서수' md_category_item_ordinal_number          : Integer64 not null  @title : 'Item 서수';
    @comment : 'Value Type' md_category_item_type                 : String(1) not null  @title : 'Value Type';
    @comment : 'Item Value (Text)' md_category_item_value_t       : String(100)         @title : 'Item Value (Text)';
    @comment : 'Item Value (Decimal)' md_category_item_value_d    : Integer64           @title : 'Item Value (Decimal)';
    @comment : 'Value (Decimal) Unit' md_category_item_value_unit : String(5)           @title : 'Value (Decimal) Unit';
    @comment : 'Category ID' md_category_id                       : String(4) not null  @title : 'Category ID';

}


extend Md_Part_No_Item_Value with util.Managed;
