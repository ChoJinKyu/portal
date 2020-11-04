namespace cm;

using util from '../../util/util-model';
using { cm as detail } from './CM_CODE_DTL-model';

entity Code_Lng {
    
    key tenant_id: String(5) not null @title: '테넌트ID';
    key company_code: String(10) not null @title: '회사코드';
    key group_code: String(30) not null @title: '그룹코드';
    key code: String(30) not null @title: '코드';
    
    parent: Association to detail.Code_Dtl
        on parent.tenant_id = tenant_id 
        and parent.company_code = company_code 
        and parent.group_code = group_code
        and parent.code = code;

    key language_cd: String(30) not null @title: '코드';
    code_name: String(240) not null @title: '코드명';

}

extend Code_Lng with util.Managed;