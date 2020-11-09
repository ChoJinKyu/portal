namespace cm;

using util from '../../util/util-model';
using { cm as detail } from './CM_CODE_DTL-model';

entity Code_Mst {
    
    key tenant_id: String(5) not null @title: '테넌트ID';
    key company_code: String(10) not null @title: '회사코드';
    key group_code: String(30) not null @title: '그룹코드';

    children: Composition of many detail.Code_Dtl
        on children.tenant_id = tenant_id 
        and children.company_code = company_code
        and children.group_code = group_code;
    
    chain_code: String(30) not null @title: '체인코드';
    group_name: String(240) not null @title: '그룹명';
    group_description: String not null @title: '그룹설명';
    use_flag: Boolean not null @title: '사용여부';

}

extend Code_Mst with util.Managed;