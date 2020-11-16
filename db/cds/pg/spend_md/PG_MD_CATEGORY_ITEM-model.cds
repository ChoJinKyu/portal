namespace pg;

using util from '../../util/util-model';


entity Md_Category_Item {
    key tenant_id                 : String(5) not null   @title : '테넌트ID';
    key company_code              : String(10) not null  @title : '회사코드';
    key org_type_code             : String(30) not null  @title : '조직유형코드';
    key org_code                  : String(10) not null  @title : '조직코드';
    key md_category_id            : String(4) not null   @title : 'SP 구매기준 정보 Category ID';
    key md_category_item_code     : String(4) not null   @title : 'Item Code';
        md_category_item_name     : String(100) not null @title : 'Item Name';
        md_category_item_desc     : String(500)          @title : 'Item Desc';
        md_category_item_type     : String(1) not null   @title : 'Value Type';
        md_category_itme_content  : String(100)          @title : 'Content';
        md_category_item_sort_seq : Integer64 not null   @title : '정렬 순서';

}


extend Md_Category_Item with util.Managed;
