namespace cm;	

using { User } from '@sap/cds/common';

entity Currency_Lng {	
  key tenant_id : String(5)  not null;	
  key currency_code : String(30)  not null;	
  key language_code : String(30)  ;	
    currency_code_name : String(240)  ;	
    currency_code_desc : String(300)  not null;	
    currency_prefix : String(30)  ;	
    currency_suffix : String(30)  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	