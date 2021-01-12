namespace pg;

using {pg as cateItems} from './PG_MD_CATEGORY_ITEM-model';
using {pg as cateLngs} from './PG_MD_CATEGORY_ID_LNG-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';
using {cm as orgBizunit} from '../../cm/CM_ORG_UNIT-model';
using util from '../../cm/util/util-model';

entity Md_Category_Id {
    key tenant_id                   : String(5) not null         @title : '테넌트ID';
    key company_code                : String(10) not null        @title : '회사코드';
    key org_type_code               : String(30) not null        @title : '조직유형코드';
    key org_code                    : String(10) not null        @title : '조직코드';
    key spmd_category_code          : String(4) not null         @title : 'SPMD범주코드';
        spmd_category_code_name     : String(50) not null        @title : 'SPMD범주코드명';
        rgb_font_color_code         : String(7) default '#000000'@title : 'RGB글꼴색상코드';
        rgb_cell_clolor_code        : String(7) default '#FFFFFF'@title : 'RGB셀색상코드';
        spmd_category_sort_sequence : Integer64 not null         @title : 'SPMD범주정렬순서';

        tenant_infos                : Association to orgTenant.Org_Tenant
                                        on tenant_infos.tenant_id = tenant_id;

        org_infos                   : Association to orgBizunit.Org_Unit
                                        on org_infos.tenant_id = tenant_id
                                        and org_infos.bizunit_code = org_code;

        items                       : Association to many cateItems.Md_Category_Item
                                          on  items.tenant_id          = tenant_id
                                          and items.company_code       = company_code
                                          and items.org_type_code      = org_type_code
                                          and items.org_code           = org_code
                                          and items.spmd_category_code = spmd_category_code;

        lngs                        : Association to many cateLngs.Md_Category_Id_Lng
                                          on  lngs.tenant_id          = tenant_id
                                          and lngs.company_code       = company_code
                                          and lngs.org_type_code      = org_type_code
                                          and lngs.org_code           = org_code
                                          and lngs.spmd_category_code = spmd_category_code;
}

extend Md_Category_Id with util.Managed;