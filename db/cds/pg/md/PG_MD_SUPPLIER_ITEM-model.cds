namespace pg;

using {pg as itemLngs} from './PG_MD_SUPPLIER_ITEM_LNG-model';
using {cm as orgTenant} from '../../cm/CM_ORG_TENANT-model';
using util from '../../cm/util/util-model';

entity Md_Supplier_Item {
    key tenant_id                 : String(5) not null   @title : '테넌트ID';
    key company_code              : String(10) not null  @title : '회사코드';
    key org_type_code             : String(30) not null  @title : '조직유형코드';
    key org_code                  : String(10) not null  @title : '조직코드';
    key spmd_character_code       : String(4) not null   @title : 'SPMD특성코드';
        spmd_character_code_name  : String(100) not null @title : 'SPMD특성코드명';
        spmd_character_group_name : String(100)          @title : 'SPMD특성그룹명';
        spmd_character_desc       : String(500)          @title : 'SPMD특성설명';
        spmd_character_type_code  : String(30)           @title : 'SPMD특성유형코드';
        spmd_character_mark_size  : Integer64 default 15 @title : 'SPMD특성표시크기';
        spmd_character_sort_seq   : Integer64 not null   @title : 'SPMD특성정렬순서';
        spmd_character_serial_no  : Integer64 not null   @title : 'SPMD특성일련번호';

        tenant_infos              : Association to orgTenant.Org_Tenant
                                        on tenant_infos.tenant_id = tenant_id;

        lngs                      : Association to many itemLngs.Md_Supplier_Item_Lng
                                        on lngs.tenant_id = tenant_id
                                        and lngs.company_code = company_code
                                        and lngs.org_type_code = org_type_code
                                        and lngs.org_code = org_code
                                        and lngs.spmd_character_code = spmd_character_code;

}


extend Md_Supplier_Item with util.Managed;
