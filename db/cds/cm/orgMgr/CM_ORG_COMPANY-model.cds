namespace cm;
using { User } from '@sap/cds/common';


entity Org_Company {
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key company_code : String(10)  not null @title: '회사코드';
    company_name : String(240)  not null @title: '회사명';
    use_flag : Boolean not null @title: '사용여부';
    currency_code : String(30) @title: '통화코드';
    nation_code : String(30) @title: '국가코드';
    language_code : String(30) @title: '언어코드';
    affiliate_code : String(10) @title: '관계사코드';
    local_create_dtm : DateTime @title: '로컬등록시간';
    local_update_dtm : DateTime @title: '로컬수정시간';
    create_user_id : User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;
    system_create_dtm : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;
    system_update_dtm : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;
}