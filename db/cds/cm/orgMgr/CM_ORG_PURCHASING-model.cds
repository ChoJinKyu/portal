namespace cm;
using { User } from '@sap/cds/common';


entity Org_Purchasing {
  key tenant_id : String(5)  not null @title: '테넌트ID';
  key purchase_org_code : String(10)  not null @title: '구매조직코드';
    purchase_org_name : String(240)  not null @title: '구매조직명';
    use_flag : Boolean not null @title: '사용여부';
    local_create_dtm : DateTime @title: '로컬타임등록시간';
    local_update_dtm : DateTime @title: '로컬타임수정시간';
    create_user_id : User not null @cds.on.insert: $user @title: '시스템등록자ID';
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;
    system_create_dtm : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;
    system_update_dtm : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;
}