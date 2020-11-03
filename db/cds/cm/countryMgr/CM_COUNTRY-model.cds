namespace cm;	
using { cm.Country_Lng as country_Lng } from './CM_COUNTRY_LNG-model';
using { User } from '@sap/cds/common';
	
entity Country {	
  key tenant_id : String(5)  not null;	
  key country_code : String(30)  not null;	
    iso_code : String(30)  ;	
    eu_code : String(30)  ;	
    language_code : String(300)  not null;	
    date_format_code : String(30)  ;	
    number_format_code : String(30)  ;	
    currency_code : String(30)  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id: User not null @cds.on.insert: $user ;
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
    details: Association to many country_Lng on details.tenant_id = tenant_id
                                              and details.country_code = country_code;
}	
