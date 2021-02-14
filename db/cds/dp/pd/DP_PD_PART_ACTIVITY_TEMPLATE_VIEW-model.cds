namespace dp;	
// using {dp as productActivityTemplate} from '../pd/DP_PD_PART_ACTIVITY_TEMPLATE-model';	
@cds.persistence.exists
	
entity Pd_Part_Activity_Template_View {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ; 
  key company_code : String(10) default '*' not null @title: '회사코드' ;   
  key org_type_code : String(2)  not null @title: '조직유형코드' ;    
  key org_code : String(10)  not null @title: '조직코드' ;  
  key part_project_type_code : String(30)  not null @title: '부품PJT유형코드' ;   
  key activity_code : String(40)  not null @title: '활동코드' ; 
    org_name : String(240)   @title: '조직명' ;
    part_project_type_name : String(240)   @title: '이벤트명' ;
    sequence : Decimal default 1  @title: '순번' ;    
    develope_event_code : String(30)   @title: '이벤트코드' ;
    develope_event_name : String(240)   @title: '이벤트명' ;
    actual_role_code : String(40)   @title: '실적 역할' ;   
    actual_role_name : String(240)   @title: '실적 역할' ;   
    activity_complete_type_code : String(10)   @title: '활동완료유형코드' ; 
    activity_complete_type_name : String(240)   @title: '활동완료유형명' ; 
    job_type_code : String(10)   @title: '업무유형코드' ; 
    job_type_name : String(240)   @title: '업무유형명' ; 
    attachment_mandatory_flag : Boolean   @title: '산출물필수여부' ;   
    attachment_mandatory_flag_val :String(1) @title: '산출물필수여부값' ;    
    approve_mandatory_flag : Boolean   @title: '결재필수 여부' ;  
    approve_mandatory_flag_val :String(1) @title: '결재필수 여부값' ;    
    activity_name : String(240)   @title: '활동명' ;   
    active_flag : Boolean   @title: '활성여부' ;    
    active_flag_val :String(1) @title: '활성여부값' ;    
    update_user_id : String(255) @title: '최종수정자';
    local_update_dtm : DateTime @title: '최종수정일시';
}