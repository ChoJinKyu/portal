namespace cm;

using util from './util/util-model';
using {cm as detail} from './CM_ORG_CODE_DTL-model';

entity Org_Code_Mst {

    key tenant_id                 : String(5) not null   @title : '테넌트ID';
    key group_code                : String(30) not null  @title : '그룹코드';


        children                  : Composition of many detail.Org_Code_Dtl
                                        on  children.tenant_id  = tenant_id
                                        and children.group_code = group_code;

        code_conrol_org_type_code : String(30) not null  @title : '코드제어조직유형코드';
        chain_code                : String(30) not null  @title : '체인코드';
        group_name                : String(240) not null @title : '그룹명';
        group_description         : String(500) not null @title : '그룹설명';
        maximum_column_size       : Integer default 30   @title : '최대열크기';
        use_flag                  : Boolean not null     @title : '사용 여부';
}

extend Org_Code_Mst with util.Managed;
