namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as ActivityCodeCategory} from '../pd/DP_PD_ACTIVITY_CODE_CATEGORY-model';	
	
entity Pd_Activity_Code_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key activity_type_code : String(30)  not null @title: '활동유형코드' ;	
  key activity_code : String(40)  not null @title: '활동코드' ;	
  key category_group_code : String(30)  not null @title: '카테고리 그룹 코드' ;	
  key category_code : String(40)  not null @title: '카테고리' ;	
    s_grade_standard_days : Integer default 0  @title: 'S' ;	
    a_grade_standard_days : Integer default 0  @title: 'A' ;	
    b_grade_standard_days : Integer default 0  @title: 'B' ;	
    c_grade_standard_days : Integer default 0  @title: 'C' ;	
    d_grade_standard_days : Integer default 0  @title: 'D' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Activity_Code_Category with util.Managed;	
