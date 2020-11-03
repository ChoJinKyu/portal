namespace cm;	

using { User } from '@sap/cds/common';

entity Message {	
  @comment: '테넌트ID'
  key tenant_id : String(5)  not null;	
  @Comment: '메시지코드'
  key message_code : String(30)  not null;
  @Comment: '언어코드'
  key language_code : String(30)  not null;	
    chain_code : String(30)  not null;	
    message_type_code : String(30)  not null;	
    message_contents : String(1000)  not null;	
    local_create_dtm: DateTime not null;	
    local_update_dtm: DateTime not null;	
    create_user_id: User not null @cds.on.insert: $user ;
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	


