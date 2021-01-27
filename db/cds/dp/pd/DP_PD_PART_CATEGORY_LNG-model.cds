namespace dp;	
using util from '../../cm/util/util-model';  	
using {dp as partCategory} from '../pd/DP_PD_PART_CATEGORY-model';
// using {dp as partCategoryLng} from '../pd/DP_PD_PART_CATEGORY_LNG-model';	
	
entity Pd_Part_Category_Lng {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_group_code : String(30)  not null @title: '카테고리 그룹 코드' ;	
  key category_code : String(40)  not null @title: '카테고리 코드' ;	

          parent    : Composition of many partCategory.Pd_Part_Category
                          on  parent.tenant_id  = tenant_id
                          and parent.category_group_code = category_group_code
                          and parent.category_code = category_code;

  key language_cd : String(30)  not null @title: '언어코드' ;	
    code_name : String(240)   @title: '코드명' ;	
}	
extend Pd_Part_Category_Lng with util.Managed;	
