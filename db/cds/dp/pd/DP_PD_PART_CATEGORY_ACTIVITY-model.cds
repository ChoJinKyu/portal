namespace dp;	
using util from '../../cm/util/util-model';  	
// using { as } from '/DP_PD_PART_CATEGORY_ACTIVITY-model';	
	
entity Pd_Part_Category_Activity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_code : String(50)  not null @title: '카테고리 코드' ;	
  key part_pjt_type : String(30)  not null @title: '부품PJT유형' ;	
  key activity_code : String(50)  not null @title: '부품활동코드' ;	
    standard_day_1 : Decimal default 0  @title: '표준일수 s' ;	
    standard_day_2 : Decimal default 0  @title: '표준일수 a' ;	
    standard_day_3 : Decimal default 0  @title: '표준일수 b' ;	
    standard_day_4 : Decimal default 0  @title: '표준일수 c' ;	
    standard_day_5 : Decimal default 0  @title: '표준일수 d' ;	
    active_flag : Boolean   @title: '활성여부' ;	
}	
extend Pd_Part_Category_Activity with util.Managed;	
