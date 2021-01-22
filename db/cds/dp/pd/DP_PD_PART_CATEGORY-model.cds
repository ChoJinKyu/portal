namespace dp;	
using util from '../../cm/util/util-model';  	
// using {dp as partCategory} from '../pd/DP_PD_PART_CATEGORY-model';	
	
entity Pd_Part_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_group_code : String(30)  not null @title: '카테고리 그룹 코드' ;	
  key category_code : String(40)  not null @title: '카테고리 코드' ;	
    parent_category_code : String(40)   @title: '상위 카테고리 코드' ;	
    sequence : Decimal default 1  @title: '순번' ;	
    active_flag : Boolean   @title: 'Status' ;	
}	
extend Pd_Part_Category with util.Managed;	
