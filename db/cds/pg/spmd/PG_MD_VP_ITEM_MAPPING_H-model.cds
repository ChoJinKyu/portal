namespace pg;

using util from '../../cm/util/util-model';


entity Md_Vp_Item_Mapping_H {
    key tenant_id              : String(5) not null  @title : '테넌트ID';
    key company_code           : String(10) not null @title : '회사코드';
    key org_type_code          : String(30) not null @title : '조직유형코드';
    key org_code               : String(10) not null @title : '조직코드';
    key vendor_pool_code       : String(20) not null @title : '협력사풀코드';
        vendor_pool_local_name : String(240)         @title : '협력사풀로컬명';
        confirmed_status_code  : String(3) not null  @title : '확정상태코드';

}


extend Md_Vp_Item_Mapping_H with util.Managed;
