namespace cm;	

using { User } from '@sap/cds/common';

entity Currency {	
  key tenant_id : String(5)  not null;	
  key currency_code : String(30)  not null;	
    effective_start_date : DateTime  ;	
    effective_end_date : DateTime  ;	
    use_flag : Boolean  not null;	
    scale : Decimal  ;	
    extension_scale : Decimal  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	