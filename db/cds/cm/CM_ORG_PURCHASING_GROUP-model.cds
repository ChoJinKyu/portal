namespace cm;

using util from './util/util-model';


entity Org_Purchasing_Group {
    key tenant_id             : String(5) not null  @title : '테넌트ID';
    key purchasing_group_code : String(3) not null  @title : '구매그룹코드';
        purchasing_group_name : String(30) not null @title : '구매그룹명';
        use_flag              : Boolean not null    @title : '사용여부';
}

extend Org_Purchasing_Group with util.Managed;
