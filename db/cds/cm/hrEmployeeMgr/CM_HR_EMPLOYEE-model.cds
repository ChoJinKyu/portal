namespace cm;	

using { User } from '@sap/cds/common';
	
entity Hr_Employee {	
  key tenant_id : String(5)  not null;	
  key employee_number : String(30)  not null;	
    user_status_code : String(30)  not null;	 
    email_id : String(240)  ;	
    user_korean_name : String(240)  not null;	
    user_english_name : String(240)  ;	
    mobile_phone_number : String(50)  ;	
    office_phone_number : String(50)  ;	
    office_address : String(240)  ;	
    job_title : String(100)  ;	
    assign_type_code : String(30)  not null;	
    assign_company_name : String(240)  ;	
    gender_code : String(30)  ;	
    nation_code : String(30)  ;	
    locale_code : String(30)  ;	
    department_id : String(16)  not null;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id: User not null @cds.on.insert: $user @title: '등록사용자ID';
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID';
    system_create_dtm: DateTime not null @cds.on.insert: $now @title: '시스템등록시간';
    system_update_dtm: DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간';
}	
