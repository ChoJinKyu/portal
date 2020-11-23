namespace pg;

using util from '../../util/util-model';


@comment : '[pg.md] VP별 관리항목 Item'
entity Md_Category_Item {
    @comment : '테넌트ID' key tenant_id                              : String(5) not null   @title : '테넌트ID';
    @comment : '회사코드' key company_code                            : String(10) not null  @title : '회사코드';
    @comment : '조직유형코드' key org_type_code                         : String(30) not null  @title : '조직유형코드';
    @comment : '조직코드' key org_code                                : String(10) not null  @title : '조직코드';
    @comment : 'SP 구매기준 정보 Category ID' key md_category_id        : String(4) not null   @title : 'SP 구매기준 정보 Category ID';
    @comment : 'Item Code' key md_category_item_code              : String(4) not null   @title : 'Item Code';
    @comment : 'Item Name' md_category_item_name                  : String(100) not null @title : 'Item Name';
    @comment : 'Item Desc' md_category_item_desc                  : String(500)          @title : 'Item Desc';
    @comment : 'Value Type' md_category_item_type                 : String(1) not null   @title : 'Value Type';
    @comment : 'Value (Decimal) Unit' md_category_item_value_unit : String(5)            @title : 'Value (Decimal) Unit';
    @comment : 'Content' md_category_item_content                 : String(100)          @title : 'Content';
    @comment : '정렬 순서' md_category_item_sort_seq                  : Integer64 not null   @title : '정렬 순서';
    @comment : 'Item 서수' md_category_item_ordinal_number          : Integer64 not null   @title : 'Item 서수';
}


extend Md_Category_Item with util.Managed;
