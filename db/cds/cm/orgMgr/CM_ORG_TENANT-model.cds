namespace cm;
using { User } from '@sap/cds/common';


entity Org_Tenant {
  key tenant_id : String(5)  not null @title: '테넌트ID';
    tenant_name : String(240)  not null @title: '테넌트명';
    erp_type_code : String(30)  @title: 'ERP유형코드';
    use_flag : Boolean not null @title: '사용여부';
    local_create_dtm : DateTime  @title: '로컬등록시간';
    local_update_dtm : DateTime  @title: '로컬수정시간';
    create_user_id : User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;
    system_create_dtm : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;
    system_update_dtm : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;
}