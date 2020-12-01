namespace dp;	
using util from '../../cm/util/util-model'; 	
// using { as } from '/DP_PD_PART_CATEGORY_ACVITITY-model';	
	
entity Pd_Part_Category_Acvitity {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_code : String(50)  not null @title: '카테고리 코드' ;	
  key part_pjt_type : String(30)  not null @title: '부품PJT유형' ;	
  key part_activity_code : String(50)  not null @title: '부품활동코드' ;	
  key part_develope_grade : String(10)   @title: '부품개발등급' ;	
    use_flag : Boolean   @title: '사용여부' ;	
    standard_days : Decimal default 0  @title: '표준일수' ;	
    status_code : String(10)   @title: '상태코드' ;	
}	
extend Pd_Part_Category_Acvitity with util.Managed;