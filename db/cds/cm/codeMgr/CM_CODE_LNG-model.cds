namespace cm;

using { User } from '@sap/cds/common';
using { cm as dtl } from './CM_CODE_DTL-model';

entity Code_Lng {
    
    key tenant_id: String(5) not null @title: '테넌트ID';
    key company_code: String(10) not null @title: '회사코드';
    key group_code: String(30) not null @title: '그룹코드';
    key code: String(30) not null @title: '코드';
    
    ref: Association to dtl.Code_Dtl
        on ref.tenant_id = tenant_id 
        and ref.company_code = company_code 
        and ref.group_code = group_code
        and ref.code = code;

    key language_cd: String(30) not null @title: '코드';
    code_name: String(240) not null @title: '코드명';
    
    local_create_dtm: DateTime not null @title: '로컬등록시간';
    local_update_dtm: DateTime not null @title: '로컬수정시간';
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';

}