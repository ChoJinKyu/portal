namespace dp;	
using util from '../../util/util-model'; 	
// using {dp as partCategory} from '../pd/DP_PD_PART_CATEGORY-model';	
	
entity Pd_Part_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key category_code : String(50)  not null @title: '카테고리 코드' ;	
    parent_category_code : String(50)   @title: '상위 카테고리 코드' ;	
    seq : Decimal default 1  @title: '순번' ;	
    category_name : String(2000)   @title: '카테고리 이름' ;	
    desc : String(2000)   @title: '설명' ;	
    status_code : String(10)   @title: '상태코드' ;	
}	
extend Pd_Part_Category with util.Managed;