namespace dp;	
using util from '../../cm/util/util-model'; 	
// using {dp as partCategory} from '../standardCommon/DP_SC_PART_CATEGORY-model';
using {dp as categoryClass} from '../standardCommon/DP_SC_PART_CATEGORY_CLASS-model';
using {dp as categoryAuth} from '../standardCommon/DP_SC_PART_CATEGORY_AUTH-model';
	
entity Sc_Part_Category {	
  key tenant_id : String(5)  not null @title: '테넌트ID' ;	
  key company_code : String(10) default '*' not null @title: '회사코드' ;	
  key org_type_code : String(2)  not null @title: '구매운영조직유형' ;	
  key org_code : String(10)  not null @title: '구매운영조직코드' ;	
  key category_code : String(200)  not null @title: '카테고리 코드' ;	

    cClass: Composition of many categoryClass.Sc_Part_Category_Class
        on cClass.tenant_id = tenant_id 
        and cClass.org_type_code = org_type_code
        and cClass.org_code = org_code
        and cClass.category_code = category_code;

    cAuth: Composition of many categoryAuth.Sc_Part_Category_Auth
        on cAuth.tenant_id = tenant_id 
        and cAuth.org_type_code = org_type_code
        and cAuth.org_code = org_code
        and cAuth.category_code = category_code;

    parent_category_code : String(200)   @title: '상위 카테고리 코드' ;	
    seq : Decimal default 0  @title: '순번' ;	
    category_name : String(2000)   @title: '카테고리 이름' ;	
    desc : String(2000)   @title: '설명' ;	
    status_code : String(10)   @title: '상태코드' ;	
}	
extend Sc_Part_Category with util.Managed;	
