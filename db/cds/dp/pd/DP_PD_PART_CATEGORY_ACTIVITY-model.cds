namespace dp;	
using util from '../../cm/util/util-model';  	
// using { as } from '/DP_PD_PART_CATEGORY_ACTIVITY-model';	
	
entity Pd_Part_Category_Activity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_code : String(40)  not null @title: '카테고리' ;	
  key part_project_type_code : String(30)  not null @title: 'Type' ;	
  key activity_code : String(40)  not null @title: 'Activity코드' ;	
    s_grade_standard_days : Integer default 0  @title: 'S' ;	
    a_grade_standard_days : Integer default 0  @title: 'A' ;	
    b_grade_standard_days : Integer default 0  @title: 'B' ;	
    c_grade_standard_days : Integer default 0  @title: 'C' ;	
    d_grade_standard_days : Integer default 0  @title: 'D' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Category_Activity with util.Managed;