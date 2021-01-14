namespace dp;	
using util from '../../cm/util/util-model';  	
// using { as } from '/DP_PD_PART_ACTIVITY_TEMPLATE_LNG-model';	
	
entity Pd_Part_Activity_Template_Lng {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key part_project_type_code : String(30)  not null @title: '부품PJT유형' ;	
  key activity_code : String(40)  not null @title: 'Activity코드' ;	
  key language_code : String(4)  not null @title: '언어코드' ;	
    activity_name : String(240)   @title: '활동명' ;	
}	
extend Pd_Part_Activity_Template_Lng with util.Managed;	