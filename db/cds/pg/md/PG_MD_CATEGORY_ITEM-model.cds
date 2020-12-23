namespace pg;

using {pg.Md_Category_Item_Lng as itemLngs} from './PG_MD_CATEGORY_ITEM_LNG-model';
using util from '../../cm/util/util-model';


entity Md_Category_Item {
    key tenant_id                : String(5) not null   @title : '테넌트ID';
    key company_code             : String(10) not null  @title : '회사코드';
    key org_type_code            : String(30) not null  @title : '조직유형코드';
    key org_code                 : String(10) not null  @title : '조직코드';
    key spmd_category_code       : String(4) not null   @title : 'SPMD범주코드';
    key spmd_character_code      : String(4) not null   @title : 'SPMD특성코드';
        spmd_character_code_name : String(100) not null @title : 'SPMD특성코드명';
        spmd_character_desc      : String(500)          @title : 'SPMD특성설명';
        spmd_character_sort_seq  : Integer64 not null   @title : 'SPMD특성정렬순서';
        spmd_character_serial_no : Integer64 not null   @title : 'SPMD특성일련번호';
                                          
        lngs                     : Association to many itemLngs
                                    on  lngs.tenant_id          = tenant_id
                                    and lngs.company_code       = company_code
                                    and lngs.org_type_code      = org_type_code
                                    and lngs.org_code           = org_code
                                    and lngs.spmd_category_code = spmd_category_code
                                    and lngs.spmd_character_code = spmd_character_code;
}

extend Md_Category_Item with util.Managed;
