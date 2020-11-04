namespace cm;

using util from '../../util/util-model';
using { cm as detail } from './CM_CONTROL_OPTION_DTL-model';

entity Control_Option_Mst {

    key tenant_id: String(5) not null @title: '테넌트ID';
    key control_option_code: String(30) @title: '제어옵션코드';

    children: Composition of many detail.Control_Option_Dtl
        on children.tenant_id = tenant_id 
        and children.control_option_code = control_option_code;

    chain_code: String(30) not null @title: '체인코드';
    control_option_name: String(240) @title: '제어옵션명';
    start_date: Date not null @title: '시작일자';
    end_date: Date not null @title: '종료일자';
    site_flag: Boolean not null @title: '사이트여부';
    company_flag: Boolean not null @title: '회사여부';
    role_flag: Boolean not null @title: '롤여부';
    organization_flag: Boolean not null @title: '조직여부';
    user_flag: Boolean not null @title: '사용자여부';
    
}

extend Control_Option_Mst with util.Managed;