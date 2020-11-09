namespace cm;	
using { User } from '@sap/cds/common';	
	
entity Hr_Department {	
  key tenant_id : String(5)  not null;	
  key department_id : String(100)  not null;	
    department_korean_name : String(240)  not null;	
    department_english_name : String(240)  ;	
    company_id : String(100)  ;	
    company_korean_name : String(240)  ;	
    company_english_name : String(240)  ;	
    parent_department_id : String(100)  not null;	
    department_leader_empno : String(30)  ;	
    bizunit_code : String(10)  ;	
    bizmanage_code : String(10)  ;	
    local_it_center_code : String(30)  ;	
    local_accounting_center_code : String(30)  ;	
    department_start_date : String(8)  ;	
    department_end_date : String(8)  ;	
    department_type_code : String(30)  ;	
    use_flag : Boolean  not null;	
    sort_number : Decimal  ;	
    full_path_desc : String(300)  ;	
    local_create_dtm : DateTime  not null;	
    local_update_dtm : DateTime  not null;	
    create_user_id : User not null @cds.on.insert: $user  ;	
    update_user_id : User not null @cds.on.insert: $user @cds.on.update: $user @title: '변경사용자ID'  ;	
    system_create_dtm : DateTime not null @cds.on.insert: $now @title: '시스템등록시간'  ;	
    system_update_dtm : DateTime not null @cds.on.insert: $now  @cds.on.update: $now @title: '시스템수정시간'  ;	
}	
