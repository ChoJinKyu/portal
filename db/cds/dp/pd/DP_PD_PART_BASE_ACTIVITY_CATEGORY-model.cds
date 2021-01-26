namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as DpBaseActivityCategory} from '../pd/DP_PD_PART_BASE_ACTIVITY_CATEGORY-model';	
	
entity Pd_Part_Base_Activity_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
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
extend Pd_Part_Base_Activity_Category with util.Managed;	
