namespace dp;	
using util from '../../util/util-model'; 	
using {dp as partCategory} from '../standardCommon/DP_SC_PART_CATEGORY-model';
	
entity Sc_Part_Category_Auth {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '조직유형코드' ;	
  key org_code : String(10)  not null @title: '조직코드' ;	
  key category_code : String(200)  not null @title: '카테고리 코드' ;	

    parent: Composition of partCategory.Sc_Part_Category
        on parent.tenant_id = tenant_id 
        and parent.org_type_code = org_type_code
        and parent.org_code = org_code
        and parent.category_code = category_code;

  key auth_code : String(200)  not null @title: '권한자,부품개발담당자' ;	
    status_code : String(10)   @title: '상태 코드' ;	
}	
extend Sc_Part_Category_Auth with util.Managed;	
