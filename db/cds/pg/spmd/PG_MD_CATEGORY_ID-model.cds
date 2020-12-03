namespace pg;

using {pg.Md_Category_Item as items} from './PG_MD_CATEGORY_ITEM-model';
using util from '../../cm/util/util-model';

entity Md_Category_Id {
    key tenant_id                   : String(5) not null            @title : '테넌트ID';
    key company_code                : String(10) not null           @title : '회사코드';
    key org_type_code               : String(30) not null           @title : '조직유형코드';
    key org_code                    : String(10) not null           @title : '조직코드';
    key spmd_category_code          : String(4) not null            @title : 'SPMD범주코드';
        spmd_category_code_name     : String(50) not null           @title : 'SPMD범주코드명';
        rgb_font_color_code         : String(7) default '#000000'   @title : 'RGB글꼴색상코드';
        rgb_cell_clolor_code        : String(7) default '#FFFFFF'   @title : 'RGB셀색상코드';
        spmd_category_sort_sequence : Integer64 not null            @title : 'SPMD범주정렬순서';

        items                       : Association to many items
                                          on  items.tenant_id          = tenant_id
                                          and items.company_code       = company_code
                                          and items.org_type_code      = org_type_code
                                          and items.org_code           = org_code
                                          and items.spmd_category_code = spmd_category_code;
}

extend Md_Category_Id with util.Managed;
