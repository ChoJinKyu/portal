namespace dp;	
using util from '../../util/util-model'; 	
// using { as } from '/DP_PD_PART_ACTIVITY_TEMPLATE-model';	
	
entity Pd_Part_Activity_Template {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key part_activity_code : String(50)  not null @title: '부품활동코드' ;	
    event : String(30)   @title: '이벤트' ;	
    seq : Decimal default 1  @title: '순번' ;	
    actual_role : String(40)   @title: '실적 역할' ;	
    actual_type : String(10)   @title: '실적 유형' ;	
    doc_mandatory_flag : Boolean   @title: '산출물필수여부' ;	
    self_approve_flag : Boolean   @title: '자가결재 여부' ;	
    desc : String(2000)   @title: '설명' ;	
    status_code : String(10)   @title: '상태코드' ;	
}	
extend Pd_Part_Activity_Template with util.Managed;