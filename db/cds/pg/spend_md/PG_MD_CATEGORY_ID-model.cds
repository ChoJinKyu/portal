namespace pg;

using util from '../../util/util-model';

entity Md_Category_Id {
    key tenant_id               : String(5) not null         @title : '테넌트ID';
    key company_code            : String(10) not null        @title : '회사코드';
    key org_type_code           : String(30) not null        @title : '조직유형코드';
    key org_code                : String(10) not null        @title : '조직코드';
    key md_category_id          : String(4) not null         @title : 'SP 구매기준 정보 Category ID';
        md_category_id_name     : String(40) not null        @title : 'Category Name';
        md_font_color_rgb       : String(7) default '#000000'@title : '글꼴 색상(RGB)';
        md_cell_clolor_rgb      : String(7) default '#FFFFFF'@title : '셀 색상(RGB)';
        md_category_id_sort_seq : Integer64 not null         @title : 'Category 정렬 순서';

}

extend Md_Category_Id with util.Managed;
