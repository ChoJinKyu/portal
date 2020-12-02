namespace dp;	
using util from '../../cm/util/util-model'; 	
// using {dp as categoryMember} from '../pd/DP_PD_PART_CATEGORY_MEMBER-model';	
	
entity Pd_Part_Category_Member {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_code : String(50)  not null @title: '카테고리 코드' ;	
  key employee_number : String(30)  not null @title: '사번' ;	
    status_code : String(10)   @title: '상태 코드' ;	
}	
extend Pd_Part_Category_Member with util.Managed;