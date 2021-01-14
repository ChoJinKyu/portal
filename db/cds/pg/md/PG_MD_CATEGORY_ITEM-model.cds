namespace pg;

using {pg as itemLngs} from './PG_MD_CATEGORY_ITEM_LNG-model';
using {pg as cateId } from './PG_MD_CATEGORY_ID-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';
using {cm as orgBizunit} from '../../cm/CM_ORG_UNIT-model';
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
        
        category_infos              : Association to cateId.Md_Category_Id
                                       on  category_infos.tenant_id           = tenant_id
                                       and category_infos.company_code        = company_code
                                       and category_infos.org_type_code       = org_type_code
                                       and category_infos.org_code            = org_code
                                       and category_infos.spmd_category_code  = spmd_category_code;

        tenant_infos                : Association to orgTenant.Org_Tenant
                                        on tenant_infos.tenant_id = tenant_id;

        org_infos                   : Association to orgBizunit.Org_Unit
                                        on org_infos.tenant_id = tenant_id
                                        and org_infos.bizunit_code = org_code;

        lngs                        : Association to many itemLngs.Md_Category_Item_Lng
                                       on  lngs.tenant_id           = tenant_id
                                       and lngs.company_code        = company_code
                                       and lngs.org_type_code       = org_type_code
                                       and lngs.org_code            = org_code
                                       and lngs.spmd_category_code  = spmd_category_code
                                       and lngs.spmd_character_code = spmd_character_code;
}

extend Md_Category_Item with util.Managed;
