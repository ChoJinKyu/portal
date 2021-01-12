namespace dp;	
using util from '../../cm/util/util-model';  	
// using { as } from '/DP_PD_PART_ACTIVITY_TEMPLATE-model';	
	
entity Pd_Part_Activity_Template {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key part_project_type_code : String(30)  not null @title: '부품PJT유형코드' ;	
  key activity_code : String(40)  not null @title: '활동코드' ;	
    parent_activity_code : String(40)   @title: '상위활동코드' ;	
    develope_event_code : String(30)   @title: '이벤트코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    actual_role_code : String(40)   @title: '실적 역할' ;	
    activity_complete_type_code : String(10)   @title: '활동완료유형코드' ;	
    job_type_code : String(10)   @title: '업무유형코드' ;
    attachment_mandatory_flag : Boolean   @title: '산출물필수여부' ;	
    approve_mandatory_flag : Boolean   @title: '자가결재 여부' ;	
    activity_name : String(240)   @title: '활동명' ;	
    activity_english_name : String(240)   @title: '활동영문명' ;	
    active_flag : Boolean   @title: '활성여부' ;	
}	
extend Pd_Part_Activity_Template with util.Managed;	