namespace pg;

using util from '../../util/util-model';


@comment : '[pg.md] VP별 관리항목 Mapping Header'
entity Md_Vp_Item_Mapping_H {
    @comment : '테넌트ID' key tenant_id            : String(5) not null  @title : '테넌트ID';
    @comment : '회사코드' key company_code          : String(10) not null @title : '회사코드';
    @comment : '조직유형코드' key org_type_code       : String(30) not null @title : '조직유형코드';
    @comment : '조직코드' key org_code              : String(10) not null @title : '조직코드';
    @comment : '협력사풀코드' key vendor_pool_code    : String(20) not null @title : '협력사풀코드';
    @comment : '협력사풀로칼명' vendor_pool_local_name : String(240)         @title : '협력사풀로칼명';
    @comment : '상태' md_status_01                : String(3) not null  @title : '상태';

}


extend Md_Vp_Item_Mapping_H with util.Managed;
