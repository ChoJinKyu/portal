namespace pg;

using {pg.Md_Category_Item as items} from './PG_MD_CATEGORY_ITEM-model';
using util from '../../util/util-model';

@commnet : '[pg.md] VP별 관리항목 Category'
entity Md_Category_Id {
    @comment : '테넌트ID' key tenant_id                       : String(5) not null             @title : '테넌트ID';
    @comment : '회사코드' key company_code                     : String(10) not null            @title : '회사코드';
    @comment : '조직유형코드' key org_type_code                  : String(30) not null            @title : '조직유형코드';
    @comment : '조직코드' key org_code                         : String(10) not null            @title : '조직코드';
    @comment : 'SP 구매기준 정보 Category ID' key md_category_id : String(4) not null             @title : 'SP 구매기준 정보 Category ID';
    @comment : 'Category Name' md_category_id_name         : String(40) not null            @title : 'Category Name';
    @comment : '글꼴 색상(RGB)' md_font_color_rgb              : String(7) default '#000000'    @title : '글꼴 색상(RGB)';
    @comment : '셀 색상(RGB)' md_cell_clolor_rgb              : String(7) default '#FFFFFF'    @title : '셀 색상(RGB)';
    @comment : 'Category 정렬 순서' md_category_id_sort_seq    : Integer64 not null             @title : 'Category 정렬 순서';
    @comment : 'Category 최대 item 수' md_category_id_max_cnt : Integer64 default 100 not null @title : 'Category 최대 item 수';

    items                                                  : Association to many items
                                                                 on  items.tenant_id      = tenant_id
                                                                 and items.company_code   = company_code
                                                                 and items.org_type_code  = org_type_code
                                                                 and items.org_code       = org_code
                                                                 and items.md_category_id = md_category_id;
}

extend Md_Category_Id with util.Managed;
